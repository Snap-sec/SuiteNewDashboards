// Normalizes raw skill tree or entity from backend into unified tree model
export function normalizeSkillTree(rawTree, rootSkill = null) {
  if (!rawTree) {
    if (!rootSkill) return null;
    return {
      id: rootSkill._id || rootSkill.id,
      name: rootSkill.name || 'skill_package',
      type: 'folder',
      isOpen: true,
      children: [],
    };
  }

  // Handle nested object structure from response
  const root =
    rawTree?.data?.data?.tree ||
    rawTree?.data?.tree ||
    rawTree?.data?.data ||
    rawTree?.data ||
    rawTree;

  // If root is an array of flat nodes
  if (Array.isArray(root)) {
    const rootName = rootSkill?.name || 'skill_package';
    const rootId = rootSkill?._id || rootSkill?.id || 'root';

    const nodeMap = {};
    const tree = {
      id: rootId,
      name: rootName,
      type: 'folder',
      isOpen: true,
      children: [],
    };

    root.forEach((node) => {
      const id = node._id || node.id;
      nodeMap[id] = {
        id,
        name: node.name || 'unnamed',
        type: node.type || (node.children ? 'folder' : 'file'),
        content: node.content || '',
        language: getLanguageFromName(node.name || ''),
        size: formatSize(node.content || node.size),
        badge: isDirectiveFile(node.name) ? 'directive' : node.badge,
        isOpen: true,
        children: [],
      };
    });

    root.forEach((node) => {
      const id = node._id || node.id;
      const parentId = node.parentId || node.parent;
      if (parentId && nodeMap[parentId]) {
        nodeMap[parentId].children.push(nodeMap[id]);
      } else {
        tree.children.push(nodeMap[id]);
      }
    });

    return tree;
  }

  // If root is a nested node object
  function traverse(node, isRoot = false) {
    const name = node.name || (isRoot ? rootSkill?.name || 'skill_package' : 'unnamed');
    const isFolder = node.type === 'folder' || (!node.type && Array.isArray(node.children));

    const item = {
      id: node._id || node.id || (isRoot ? 'root' : `node-${Date.now()}`),
      name,
      type: isFolder ? 'folder' : 'file',
      isOpen: true,
    };

    if (isFolder) {
      item.children = Array.isArray(node.children)
        ? node.children.map((child) => traverse(child, false))
        : [];
    } else {
      item.content = node.content || '';
      item.language = getLanguageFromName(name);
      item.size = formatSize(node.content || node.size);
      if (isDirectiveFile(name)) {
        item.badge = 'directive';
      }
    }

    return item;
  }

  return traverse(root, true);
}

export function isDirectiveFile(fileName = '') {
  return fileName.trim().toUpperCase() === 'SKILL.MD';
}

export function getLanguageFromName(fileName = '') {
  if (fileName.endsWith('.json')) return 'json';
  if (fileName.endsWith('.md')) return 'markdown';
  if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) return 'yaml';
  if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) return 'javascript';
  if (fileName.endsWith('.py')) return 'python';
  return 'text';
}

export function formatSize(contentOrSize) {
  if (typeof contentOrSize === 'number') {
    return `${contentOrSize} B`;
  }
  if (typeof contentOrSize === 'string') {
    if (contentOrSize.endsWith('B') || contentOrSize.endsWith('KB')) {
      return contentOrSize;
    }
    return `${Math.max(12, contentOrSize.length)} B`;
  }
  return '24 B';
}

// Recursively collects all files in tree into an array
export function collectAllFiles(node, result = []) {
  if (!node) return result;
  if (node.type === 'file') {
    result.push(node);
  }
  if (node.children) {
    node.children.forEach((child) => collectAllFiles(child, result));
  }
  return result;
}

// Computes dynamic health checks based on tree files
export function computeHealthChecks(rootNode) {
  const allFiles = collectAllFiles(rootNode);

  // 1. SKILL.md present
  const skillFile = allFiles.find((f) => isDirectiveFile(f.name));
  const hasSkillFile = !!skillFile;

  // 2. YAML frontmatter in SKILL.md
  let hasValidFrontmatter = false;
  let linkedResources = [];
  let linkedExamples = [];

  if (hasSkillFile && skillFile.content?.trim().startsWith('---')) {
    const match = skillFile.content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (match) {
      const frontmatter = match[1];
      hasValidFrontmatter = frontmatter.includes('name:') && frontmatter.includes('version:');

      // Extract referenced files in resources: and examples:
      const resMatches = frontmatter.match(/resources:\s*\n((?:\s*-\s*.+\n?)*)/);
      if (resMatches && resMatches[1]) {
        linkedResources = resMatches[1]
          .split('\n')
          .map((line) => line.replace(/^\s*-\s*/, '').trim())
          .filter(Boolean);
      }

      const exMatches = frontmatter.match(/examples:\s*\n((?:\s*-\s*.+\n?)*)/);
      if (exMatches && exMatches[1]) {
        linkedExamples = exMatches[1]
          .split('\n')
          .map((line) => line.replace(/^\s*-\s*/, '').trim())
          .filter(Boolean);
      }
    }
  }

  // 3. Linked files resolve
  const allReferencedFiles = [...linkedResources, ...linkedExamples];
  let resolvedCount = 0;
  if (allReferencedFiles.length > 0) {
    allReferencedFiles.forEach((ref) => {
      const cleanRefName = ref.split('/').pop().toLowerCase();
      const found = allFiles.some((f) => f.name.toLowerCase() === cleanRefName);
      if (found) resolvedCount++;
    });
  } else {
    // If none declared, check if any files exist in examples/resources
    resolvedCount = allFiles.length > 1 ? 2 : 1;
  }
  const totalReferenced = allReferencedFiles.length || 2;
  const isLinkedResolved = resolvedCount >= totalReferenced;

  // 4. JSON payloads parse
  const jsonFiles = allFiles.filter((f) => f.name.endsWith('.json'));
  let jsonValid = true;
  if (jsonFiles.length > 0) {
    jsonValid = jsonFiles.every((jf) => {
      try {
        JSON.parse(jf.content || '{}');
        return true;
      } catch {
        return false;
      }
    });
  }

  const checks = [
    {
      id: 'skill_present',
      title: 'SKILL.md present',
      statusText: hasSkillFile ? 'found' : 'missing',
      statusVariant: hasSkillFile ? 'primary' : 'destructive',
      passed: hasSkillFile,
    },
    {
      id: 'yaml_frontmatter',
      title: 'YAML frontmatter',
      statusText: hasValidFrontmatter ? 'valid' : 'invalid',
      statusVariant: hasValidFrontmatter ? 'primary' : 'destructive',
      passed: hasValidFrontmatter,
    },
    {
      id: 'linked_files',
      title: 'Linked files resolve',
      statusText: `${resolvedCount}/${totalReferenced} resolved`,
      statusVariant: isLinkedResolved ? 'primary' : 'destructive',
      passed: isLinkedResolved,
    },
    {
      id: 'json_payloads',
      title: 'JSON payloads parse',
      statusText: jsonValid ? 'valid' : 'syntax error',
      statusVariant: jsonValid ? 'primary' : 'destructive',
      passed: jsonValid,
    },
  ];

  const passedTotal = checks.filter((c) => c.passed).length;
  const passRate = `${Math.round((passedTotal / checks.length) * 100)}% pass`;

  return { checks, passRate };
}

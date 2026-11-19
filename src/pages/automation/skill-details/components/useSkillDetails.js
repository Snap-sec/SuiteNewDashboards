import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetSkillsQuery,
  useGetSkillByIdQuery,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetSkillTreeQuery,
  useCreateSkillNodeMutation,
  useUpdateSkillNodeMutation,
  useDeleteSkillNodeMutation,
} from '@/services/automation/skillsApi';
import {
  normalizeSkillTree,
  collectAllFiles,
  computeHealthChecks,
  isDirectiveFile,
  formatSize,
  getLanguageFromName,
  toggleFolderInTree,
  updateFileInTree,
  insertFileInTree,
  insertFolderInTree,
  deleteNodeFromTree,
  renameNodeInTree,
} from './skillTreeUtils';

export function useSkillDetails(targetSkillId) {
  // 1. Fetch skill metadata
  const { data: skillByIdData, isLoading: isLoadingSkillById, isError: isSkillByIdError, error: skillByIdError } = useGetSkillByIdQuery(
    targetSkillId,
    { skip: !targetSkillId }
  );
  const { data: skillsResponse, isLoading: isLoadingSkills, isError: isSkillsError, error: skillsError } = useGetSkillsQuery();

  const activeSkill = useMemo(() => {
    const list =
      skillsResponse?.data?.data?.skills ||
      skillsResponse?.data?.skills ||
      skillsResponse?.data?.data ||
      skillsResponse?.data ||
      (Array.isArray(skillsResponse) ? skillsResponse : []);
    const fromList = Array.isArray(list)
      ? list.find((s) => (s._id || s.id) === targetSkillId)
      : null;

    const raw = skillByIdData?.data || skillByIdData;
    const single =
      raw?.data?.skill ||
      raw?.skill ||
      raw?.data?.data?.skill ||
      raw?.data ||
      raw;

    const merged = {
      ...(fromList || {}),
      ...(single && typeof single === 'object' ? single : {}),
    };

    if (merged._id || merged.id || merged.name || merged.description) {
      return merged;
    }

    if (fromList) return fromList;
    if (single && typeof single === 'object') return single;

    return null;
  }, [skillByIdData, skillsResponse, targetSkillId]);

  const activeSkillId = activeSkill?._id || activeSkill?.id || targetSkillId;

  // 2. Fetch hierarchical tree
  const {
    data: treeResponse,
    isLoading: isLoadingTree,
    isError: isTreeError,
    error: treeError,
  } = useGetSkillTreeQuery(activeSkillId, { skip: !activeSkillId });

  const navigate = useNavigate();

  // 3. RTK Mutations
  const [updateSkill, { isLoading: isUpdatingSkill }] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();
  const [createSkillNode] = useCreateSkillNodeMutation();
  const [updateSkillNode, { isLoading: isUpdatingNode }] = useUpdateSkillNodeMutation();
  const [deleteSkillNode] = useDeleteSkillNodeMutation();

  // 4. File Tree state - initialized to null, populated only from actual API data
  const [fileTree, setFileTree] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const pendingCreatedFileRef = useRef(null);

  // Overall loading status
  const isLoading =
    (isLoadingSkillById && !!targetSkillId) ||
    (isLoadingSkills && !targetSkillId) ||
    (isLoadingTree && !!activeSkillId);

  // Synchronize API tree into fileTree
  useEffect(() => {
    if (treeResponse) {
      const normalized = normalizeSkillTree(treeResponse, activeSkill);
      if (normalized) {
        setFileTree(normalized);
        const allFiles = collectAllFiles(normalized);

        const pending = pendingCreatedFileRef.current;
        let matchedPendingFile = null;
        if (pending) {
          matchedPendingFile =
            allFiles.find((f) => f.id === pending.id) ||
            allFiles.find((f) => f.name === pending.name);
          if (matchedPendingFile) {
            pending.id = matchedPendingFile.id;
          }
        }

        setOpenFiles((prevOpen) => {
          if (!prevOpen || prevOpen.length === 0) {
            // Initial load: open directive file or first file
            const initialFile =
              matchedPendingFile ||
              allFiles.find((f) => isDirectiveFile(f.name)) ||
              allFiles[0];
            if (initialFile) {
              setActiveFileId(initialFile.id);
              return [{
                ...initialFile,
                savedContent: initialFile.content,
                isDirty: false,
              }];
            }
            return [];
          }

          // Subsequent updates (e.g. after save / refetch):
          // Retain open files that have changes (isDirty) or are the active/pending file
          const targetActiveId = pending?.id || activeFileId;
          const updatedOpenFiles = prevOpen
            .map((openFile) => {
              let fresh = allFiles.find((f) => f.id === openFile.id);
              if (!fresh && (openFile.name === pending?.name || openFile.id === pending?.id)) {
                fresh = matchedPendingFile;
              }
              if (!fresh) return null; // file was deleted
              return {
                ...fresh,
                content: openFile.isDirty ? openFile.content : fresh.content,
                savedContent: fresh.content,
                isDirty: openFile.isDirty,
              };
            })
            .filter(Boolean)
            .filter((f) => f.isDirty || f.id === targetActiveId);

          // If pending newly created file is not yet in updatedOpenFiles, add it
          if (matchedPendingFile && !updatedOpenFiles.some((f) => f.id === matchedPendingFile.id)) {
            updatedOpenFiles.push({
              ...matchedPendingFile,
              savedContent: matchedPendingFile.content,
              isDirty: false,
            });
          }

          // If all open files were closed/deleted, fallback
          if (updatedOpenFiles.length === 0) {
            const fallbackFile =
              matchedPendingFile ||
              allFiles.find((f) => f.id === targetActiveId) ||
              allFiles.find((f) => isDirectiveFile(f.name)) ||
              allFiles[0];
            if (fallbackFile) {
              setActiveFileId(fallbackFile.id);
              return [{
                ...fallbackFile,
                savedContent: fallbackFile.content,
                isDirty: false,
              }];
            }
            return [];
          }

          // Always ensure the newly created file is selected if present, else keep current
          setActiveFileId((currActive) => {
            const pendingId = pendingCreatedFileRef.current?.id;
            if (pendingId && updatedOpenFiles.some((f) => f.id === pendingId)) {
              return pendingId;
            }
            const stillExists = updatedOpenFiles.some((f) => f.id === currActive);
            if (stillExists) return currActive;
            return updatedOpenFiles[updatedOpenFiles.length - 1]?.id || '';
          });

          return updatedOpenFiles;
        });
      }
    } else if (activeSkill) {
      const rootNode = {
        id: activeSkill._id || activeSkill.id,
        name: activeSkill.name || 'skill_package',
        type: 'folder',
        isOpen: true,
        children: [],
      };
      setFileTree(rootNode);
    }
  }, [treeResponse, activeSkill, activeSkillId, activeFileId]);

  // Compute live health checks
  const { checks: healthChecks, passRate } = useMemo(() => {
    return computeHealthChecks(fileTree);
  }, [fileTree]);

  // Select file in tree - only keep files with changes plus the newly selected file
  const handleSelectFile = useCallback((file) => {
    pendingCreatedFileRef.current = null;
    setOpenFiles((prev) => {
      const dirtyFiles = prev.filter((f) => f.isDirty && f.id !== file.id);
      const existing = prev.find((f) => f.id === file.id);
      const targetFile = existing || {
        ...file,
        savedContent: file.savedContent !== undefined ? file.savedContent : file.content,
        isDirty: file.isDirty || false,
      };
      return [...dirtyFiles, targetFile];
    });
    setActiveFileId(file.id);
  }, []);

  // Select tab in editor - only keep files with changes plus the selected tab
  const handleSelectTab = useCallback((fileId) => {
    pendingCreatedFileRef.current = null;
    setOpenFiles((prev) => {
      return prev.filter((f) => f.isDirty || f.id === fileId);
    });
    setActiveFileId(fileId);
  }, []);

  // Toggle folder open/closed
  const handleToggleFolder = useCallback((folderId) => {
    setFileTree((prev) => toggleFolderInTree(prev, folderId));
  }, []);

  // Close editor tab
  const handleCloseTab = useCallback((fileId) => {
    setOpenFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== fileId);
      if (activeFileId === fileId && filtered.length > 0) {
        setActiveFileId(filtered[filtered.length - 1].id);
      }
      return filtered;
    });
  }, [activeFileId]);

  // Edit file content
  const handleContentChange = useCallback((fileId, newContent) => {
    setOpenFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          const original = f.savedContent !== undefined ? f.savedContent : f.content;
          return {
            ...f,
            content: newContent,
            savedContent: original,
            isDirty: newContent !== original,
          };
        }
        return f;
      })
    );
    setFileTree((prev) => updateFileInTree(prev, fileId, newContent));
  }, []);

  // Add new file
  const handleAddFile = useCallback(
    async ({ name, folderId, content, language }) => {
      const isRoot = !folderId || folderId === 'root' || folderId === fileTree?.id;
      const parentId = isRoot ? null : folderId;
      const targetId = isRoot ? 'root' : folderId;
      const tempId = `file-${Date.now()}`;

      // Optimistically record new file as pending selection
      pendingCreatedFileRef.current = { id: tempId, name };

      const optimisticFile = {
        id: tempId,
        name,
        type: 'file',
        language,
        size: formatSize(content),
        content,
        savedContent: content,
        isDirty: false,
      };

      // Immediately select the new file and add to tree & open tabs; keep only dirty files plus new file
      setFileTree((prev) => insertFileInTree(prev, targetId, optimisticFile));
      setOpenFiles((prev) => {
        const dirtyFiles = prev.filter((f) => f.isDirty && f.name !== name);
        return [...dirtyFiles, optimisticFile];
      });
      setActiveFileId(tempId);

      if (activeSkillId) {
        try {
          const res = await createSkillNode({
            skillId: activeSkillId,
            name,
            type: 'file',
            parentId,
            content,
          }).unwrap();

          const rawNode = res?.data?.node || res?.data?.data || res?.data || res?.node || res;
          const realId = rawNode?._id || rawNode?.id || rawNode?.nodeId || tempId;

          pendingCreatedFileRef.current = { id: realId, name };

          // Confirm tree & tabs with real server ID
          setFileTree((prev) => updateFileInTree(prev, tempId, content, realId) || prev);
          setOpenFiles((prev) =>
            prev.map((f) => (f.id === tempId ? { ...f, id: realId } : f))
          );
          setActiveFileId(realId);
          toast.success(`File "${name}" created successfully`);
        } catch (err) {
          // Rollback on failure
          setFileTree((prev) => deleteNodeFromTree(prev, tempId));
          setOpenFiles((prev) => prev.filter((f) => f.id !== tempId));
          pendingCreatedFileRef.current = null;
          toast.error(err?.data?.message || err?.message || 'Failed to create file');
        }
      } else {
        toast.success(`File "${name}" created locally`);
      }
    },
    [activeSkillId, createSkillNode, fileTree?.id]
  );

  // Add new folder
  const handleAddFolder = useCallback(
    async (arg, maybeFolderId) => {
      const folderName = typeof arg === 'object' && arg !== null ? arg.name : arg;
      const targetFolderId = typeof arg === 'object' && arg !== null ? arg.folderId : maybeFolderId;
      const isRoot = !targetFolderId || targetFolderId === 'root' || targetFolderId === fileTree?.id;
      const parentId = isRoot ? null : targetFolderId;
      const targetId = isRoot ? 'root' : targetFolderId;

      if (activeSkillId) {
        try {
          const res = await createSkillNode({
            skillId: activeSkillId,
            name: folderName,
            type: 'folder',
            parentId,
          }).unwrap();

          const createdNode = res?.data || res;
          const newFolder = {
            id: createdNode._id || createdNode.id || `folder-${Date.now()}`,
            name: folderName,
            type: 'folder',
            isOpen: true,
            children: [],
          };
          setFileTree((prev) => insertFolderInTree(prev, targetId, newFolder));
          toast.success(`Folder "${folderName}" created successfully`);
        } catch (err) {
          toast.error(err?.data?.message || err?.message || 'Failed to create folder');
        }
      } else {
        const newFolder = {
          id: `folder-${Date.now()}`,
          name: folderName,
          type: 'folder',
          isOpen: true,
          children: [],
        };
        setFileTree((prev) => insertFolderInTree(prev, targetId, newFolder));
        toast.success(`Folder "${folderName}" created`);
      }
    },
    [activeSkillId, createSkillNode, fileTree?.id]
  );

  // Save Draft
  const handleSaveDraft = useCallback(
    async (targetFileId) => {
      const fileId =
        typeof targetFileId === 'string' && targetFileId
          ? targetFileId
          : activeFileId;

      const activeFile =
        openFiles.find((f) => f.id === fileId) ||
        openFiles.find((f) => f.id === activeFileId) ||
        openFiles[0];

      if (!activeFile) {
        toast.error('No active file to save');
        return;
      }

      setIsSavingDraft(true);
      const isLocalTemp =
        !activeFile.id ||
        activeFile.id.startsWith('file-') ||
        activeFile.id.startsWith('node-');

      if (activeSkillId && !isLocalTemp) {
        try {
          await updateSkillNode({
            skillId: activeSkillId,
            nodeId: activeFile.id,
            name: activeFile.name,
            content: activeFile.content,
          }).unwrap();

          setOpenFiles((prev) =>
            prev.map((f) =>
              f.id === activeFile.id
                ? { ...f, savedContent: activeFile.content, isDirty: false }
                : f
            )
          );
          setFileTree((prev) =>
            updateFileInTree(prev, activeFile.id, activeFile.content)
          );
          toast.success(`Saved "${activeFile.name}"`);
        } catch (err) {
          // If server returns error, still persist locally so edits are never lost
          setOpenFiles((prev) =>
            prev.map((f) =>
              f.id === activeFile.id
                ? { ...f, savedContent: activeFile.content, isDirty: false }
                : f
            )
          );
          setFileTree((prev) =>
            updateFileInTree(prev, activeFile.id, activeFile.content)
          );
          toast.error(
            err?.data?.message || err?.message || 'Failed to sync with server, saved locally'
          );
        } finally {
          setIsSavingDraft(false);
        }
      } else {
        setOpenFiles((prev) =>
          prev.map((f) =>
            f.id === activeFile.id
              ? { ...f, savedContent: activeFile.content, isDirty: false }
              : f
          )
        );
        setFileTree((prev) =>
          updateFileInTree(prev, activeFile.id, activeFile.content)
        );
        setIsSavingDraft(false);
        toast.success(`Saved "${activeFile.name}"`);
      }
    },
    [activeFileId, activeSkillId, openFiles, updateSkillNode]
  );

  // Publish Skill
  const handlePublishSkills = useCallback(async () => {
    if (!activeSkillId) {
      toast.error('No skill selected to publish');
      return;
    }

    try {
      await updateSkill({
        skillId: activeSkillId,
        name: activeSkill?.name || fileTree?.name,
        description: activeSkill?.description || '',
        tags: activeSkill?.tags || [],
      }).unwrap();
      toast.success(`Skill "${activeSkill?.name || fileTree?.name}" published successfully`);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to publish skill');
    }
  }, [activeSkill, activeSkillId, fileTree?.name, updateSkill]);

  // Update Skill metadata (name, description)
  const handleUpdateSkill = useCallback(
    async (payload) => {
      const id = payload?.skillId || activeSkillId;
      if (!id) return;
      try {
        await updateSkill({
          skillId: id,
          name: payload.name,
          description: payload.description,
          tags: activeSkill?.tags || [],
        }).unwrap();
        toast.success(`Skill "${payload.name}" updated successfully`);
      } catch (err) {
        toast.error(err?.data?.message || err?.message || 'Failed to update skill');
        throw err;
      }
    },
    [activeSkill, activeSkillId, updateSkill]
  );

  // Delete file or folder node
  const handleDeleteNode = useCallback(
    async (node) => {
      if (!node) return;
      const isRoot = node.id === fileTree?.id || node.id === activeSkillId;

      if (isRoot) {
        if (activeSkillId) {
          try {
            await deleteSkill(activeSkillId).unwrap();
            toast.success(`Skill "${node.name}" deleted successfully`);
            navigate('/automation/skills');
          } catch (err) {
            toast.error(err?.data?.message || err?.message || 'Failed to delete skill');
          }
        }
        return;
      }

      // Internal file or folder
      if (activeSkillId && node.id && !node.id.startsWith('file-') && !node.id.startsWith('folder-')) {
        try {
          await deleteSkillNode({
            skillId: activeSkillId,
            nodeId: node.id,
          }).unwrap();
          toast.success(`${node.type === 'folder' ? 'Folder' : 'File'} "${node.name}" deleted`);
        } catch (err) {
          toast.error(err?.data?.message || err?.message || 'Failed to delete');
          return;
        }
      } else {
        toast.success(`${node.type === 'folder' ? 'Folder' : 'File'} "${node.name}" removed`);
      }

      // Remove from local file tree
      setFileTree((prev) => deleteNodeFromTree(prev, node.id));

      // Close open tab(s) if this file or any file inside this folder was open
      if (node.type === 'file') {
        handleCloseTab(node.id);
      } else {
        const filesInside = collectAllFiles(node);
        filesInside.forEach((f) => handleCloseTab(f.id));
      }
    },
    [activeSkillId, deleteSkill, deleteSkillNode, fileTree?.id, handleCloseTab, navigate]
  );

  // Rename file or folder node
  const handleRenameNode = useCallback(
    async (node, newName) => {
      if (!node || !newName || node.name === newName) return;
      const oldName = node.name;

      // Optimistically update fileTree
      setFileTree((prev) => renameNodeInTree(prev, node.id, newName));

      // Update openFiles if this file was open
      setOpenFiles((prev) =>
        prev.map((f) =>
          f.id === node.id || f.name === oldName
            ? {
                ...f,
                name: newName,
                language: getLanguageFromName(newName),
                badge: isDirectiveFile(newName) ? 'directive' : f.badge,
              }
            : f
        )
      );

      const isServerNode =
        activeSkillId &&
        node.id &&
        !node.id.startsWith('file-') &&
        !node.id.startsWith('folder-') &&
        !node.id.startsWith('temp-');

      if (isServerNode) {
        try {
          const body = { name: newName };
          if (node.type === 'file' && node.content !== undefined) {
            body.content = node.content;
          }
          await updateSkillNode({
            skillId: activeSkillId,
            nodeId: node.id,
            ...body,
          }).unwrap();
          toast.success(`Renamed "${oldName}" to "${newName}"`);
        } catch (err) {
          // Revert on error
          setFileTree((prev) => renameNodeInTree(prev, node.id, oldName));
          setOpenFiles((prev) =>
            prev.map((f) =>
              f.id === node.id
                ? {
                    ...f,
                    name: oldName,
                    language: getLanguageFromName(oldName),
                    badge: isDirectiveFile(oldName) ? 'directive' : f.badge,
                  }
                : f
            )
          );
          toast.error(err?.data?.message || err?.message || 'Failed to rename');
        }
      } else {
        toast.success(`Renamed to "${newName}"`);
      }
    },
    [activeSkillId, updateSkillNode]
  );

  // Extract description with comprehensive fallback chain
  const skillDescription = useMemo(() => {
    if (activeSkill?.description?.trim()) {
      return activeSkill.description.trim();
    }

    // Check treeResponse metadata
    const treeMeta =
      treeResponse?.data?.skill ||
      treeResponse?.data?.data?.skill ||
      treeResponse?.skill;
    if (treeMeta?.description?.trim()) {
      return treeMeta.description.trim();
    }

    // Check directive file (SKILL.MD) in file tree
    if (fileTree) {
      const allFiles = collectAllFiles(fileTree);
      const directiveFile = allFiles.find((f) => isDirectiveFile(f.name));
      if (directiveFile?.content) {
        // Try YAML frontmatter: description: "..." or description: ...
        const frontmatterMatch = directiveFile.content.match(
          /^description:\s*(?:["'](.*?)["']|(.*))$/m
        );
        if (frontmatterMatch) {
          const desc = (frontmatterMatch[1] || frontmatterMatch[2] || '').trim();
          if (desc) return desc;
        }

        // Try markdown content after frontmatter or first paragraph
        const cleaned = directiveFile.content.replace(/^---[\s\S]*?---/, '').trim();
        const firstLine = cleaned
          .split(/\r?\n/)
          .find((line) => line.trim() && !line.trim().startsWith('#'));
        if (firstLine?.trim()) {
          return firstLine.trim();
        }
      }
    }

    return activeSkill?.description || '';
  }, [activeSkill, treeResponse, fileTree]);

    const isError = isSkillByIdError || isSkillsError || isTreeError;
  const error = skillByIdError || skillsError || treeError;

  return {
    activeSkill: activeSkill
      ? {
          ...activeSkill,
          description: skillDescription || activeSkill.description || '',
        }
      : null,
    skillDescription,
    activeSkillId,
    fileTree,
    openFiles,
    activeFileId,
    setActiveFileId: handleSelectTab,
    healthChecks,
    passRate,
    isLoading,
    isLoadingTree,
    isUpdatingNode,
    isError,
    error,
    isSavingDraft,
    isSaving: isUpdatingNode || isSavingDraft,
    isUpdatingSkill,
    handleSelectFile,
    handleToggleFolder,
    handleCloseTab,
    handleContentChange,
    handleAddFile,
    handleAddFolder,
    handleRenameNode,
    handleDeleteNode,
    handleSaveDraft,
    handlePublishSkills,
    handleUpdateSkill,
  };
}


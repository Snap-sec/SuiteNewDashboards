export const INITIAL_SKILL_FILES = {
  id: 'root',
  name: 'cloud_iam_policy_validator',
  type: 'folder',
  isOpen: true,
  children: [
    {
      id: 'folder-examples',
      name: 'examples',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'file-valid-response',
          name: 'valid_response.json',
          type: 'file',
          size: '41 B',
          language: 'json',
          content: `{
  "risk_score": 8.5,
  "findings": [
    {
      "severity": "HIGH",
      "action": "iam:PassRole",
      "resource": "*"
    }
  ]
}`,
        },
      ],
    },
    {
      id: 'folder-resources',
      name: 'resources',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'file-methodology',
          name: 'methodology.md',
          type: 'file',
          size: '81 B',
          language: 'markdown',
          content: `# IAM Assessment Methodology

1. Review wildcard statements (\`*\`) in permissions policies.
2. Validate privilege escalation paths in \`iam:*\` actions.
3. Check principal trust policies for unauthenticated cross-account access.`,
        },
      ],
    },
    {
      id: 'file-skill-md',
      name: 'SKILL.md',
      type: 'file',
      badge: 'directive',
      language: 'yaml',
      content: `---
name: cloud_iam_policy_validator
version: 1.0.0
description: Evaluates cloud IAM policies for excessive privileges
inputs:
  policy_json: string (required)
  cloud_provider: enum [aws, gcp, azure]
outputs:
  risk_score: float (0.0 - 10.0)
  findings: array of SecurityFinding
resources:
  - resources/methodology.md
examples:
  - examples/valid_response.json
---

# Cloud IAM Policy Validator Skill

## Overview
This skill equips autonomous agents with deep static analysis of cloud IAM role definitions and permission boundaries.

## Execution Protocol
1. Ingest target policy JSON document.
2. Cross-reference against \`resources/methodology.md\`.
3. Match against known exploitation patterns:
   - iam:PassRole without resource boundaries
   - sts:AssumeRole wildcard trust relationships`,
    },
  ],
};

export const INITIAL_HEALTH_CHECKS = [
  {
    id: 'skill_present',
    title: 'SKILL.md present',
    statusText: 'found',
    statusVariant: 'primary',
    passed: true,
  },
  {
    id: 'yaml_frontmatter',
    title: 'YAML frontmatter',
    statusText: 'valid',
    statusVariant: 'primary',
    passed: true,
  },
  {
    id: 'linked_files',
    title: 'Linked files resolve',
    statusText: '2/2 resolved',
    statusVariant: 'primary',
    passed: true,
  },
  {
    id: 'json_payloads',
    title: 'JSON payloads parse',
    statusText: 'valid',
    statusVariant: 'primary',
    passed: true,
  },
];

import {
  Hash,
  Calendar,
  Type,
  ListFilter,
  CheckCircle2,
  Circle,
  GripVertical,
  Settings2,
  Plus,
  Trash2,
  Copy,
} from 'lucide-react';

// ─── Local Icon Mapping ──────────────────────────────────────────────────────
const FIELD_ICON_MAP = {
  asset_id: <Hash className="size-3" />,
  name: <Type className="size-3" />,
  category: <ListFilter className="size-3" />,
  status: <CheckCircle2 className="size-3" />,
  location: <GripVertical className="size-3" />,
  assigned_to: <UserIcon className="size-3" />,
  department: <Settings2 className="size-3" />,
  purchase_date: <Calendar className="size-3" />,
  warranty_expiry: <Calendar className="size-3" />,
  purchase_price: <Hash className="size-3" />,
  current_value: <Hash className="size-3" />,
  serial_number: <Hash className="size-3" />,
  manufacturer: <Type className="size-3" />,
  model: <Type className="size-3" />,
  is_insured: <CheckCircle2 className="size-3" />,
  tags: <Type className="size-3" />,
  notes: <Type className="size-3" />,
};

const DEFAULT_ICON = <Circle className="size-3" />;

export function getFieldIcon(field) {
  return FIELD_ICON_MAP[field] || DEFAULT_ICON;
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export const OPERATORS_DISPLAY_MAP = {
  'equals': 'Equals',
  'not_equals': 'Not Equals',
  'contains': 'Contains',
  'does not contain': 'Does Not Contain',
  'starts_with': 'Starts With',
  'ends with': 'Ends With',
  'is_empty': 'Is Empty',
  'is not empty': 'Is Not Empty',
  'greater_than': 'Greater Than',
  'less_than': 'Less Than',
  'greater or equal': 'Greater or Equal',
  'less or equal': 'Less or Equal',
  'before': 'Before',
  'after': 'After',
  'is_between': 'Is Between',
  'is_one_of': 'Is One Of',
  'is_not_one_of': 'Is Not One Of',
  'is_true': 'Is True',
  'is_false': 'Is False',
};

export const NO_VALUE_OPS = new Set([
  'is_empty',
  'is not empty',
  'is_true',
  'is_false',
]);
export const MULTI_VALUE_OPS = new Set(['is_one_of', 'is_not_one_of', 'is_between']);

let idCounter = Date.now();
export const newId = () => `n${idCounter++}`;

export const makeRule = () => ({
  id: newId(),
  type: 'rule',
  field: '',
  operator: '',
  value: '',
  valueTo: '',
});

export const makeGroup = (logicOp = 'AND') => ({
  id: newId(),
  type: 'group',
  logicOp,
  children: [makeRule()],
});

// ─── Hydration ─────────────────────────────────────────────────────────────
/**
 * Ensures every node in the AST has a unique 'id' property.
 * Useful when loading a saved query that was sanitized (IDs removed).
 */
export function hydrateQueryAST(node) {
  if (!node) return null;
  const hydrated = { ...node };
  if (!hydrated.id) hydrated.id = newId();

  if (hydrated.type === 'group' && Array.isArray(hydrated.children)) {
    hydrated.children = hydrated.children.map(hydrateQueryAST);
  }
  return hydrated;
}

// ─── Sanitization ───────────────────────────────────────────────────────────
export function sanitizeQueryAST(node) {
  if (!node) return null;
  if (node.type === 'rule') {
    const sanitized = {
      type: 'rule',
      field: node.field,
      operator: node.operator,
      value: node.value,
    };
    if (node.operator === 'is_between') {
      sanitized.valueTo = node.valueTo;
    }
    return sanitized;
  }
  if (node.type === 'group') {
    return {
      type: 'group',
      logicOp: node.logicOp,
      children: (node.children || []).map(sanitizeQueryAST).filter(Boolean),
    };
  }
  return null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function buildQueryString(node, schemaList, depth = 0) {
  if (!node) return '';
  if (node.type === 'rule') {
    const schema = schemaList?.find((s) => s.field === node.field);
    if (!schema || !node.operator) return null;
    const label = schema.label;
    const op = node.operator;
    const opLabel = OPERATORS_DISPLAY_MAP[op] || op;
    if (NO_VALUE_OPS.has(op)) return `${label} ${opLabel}`;
    if (MULTI_VALUE_OPS.has(op) && op === 'is_between')
      return `${label} is between ${node.value} and ${node.valueTo}`;
    if (MULTI_VALUE_OPS.has(op)) return `${label} ${opLabel} [${node.value}]`;
    return `${label} ${opLabel} "${node.value}"`;
  }
  if (node.type === 'group') {
    const parts = node.children
      .map((c) => buildQueryString(c, schemaList, depth + 1))
      .filter(Boolean);
    if (parts.length === 0) return null;
    const joined = parts.join(` ${node.logicOp} `);
    return depth > 0 ? `(${joined})` : joined;
  }
  return '';
}

export function ruleCount(node) {
  if (!node) return 0;
  if (node.type === 'rule') return 1;
  return node.children.reduce((s, c) => s + ruleCount(c), 0);
}

export function isRuleIncomplete(rule) {
  if (!rule || rule.type !== 'rule') return false;
  if (!rule.field || !rule.operator) return true;
  if (NO_VALUE_OPS.has(rule.operator)) return false;
  if (rule.operator === 'is_between') {
    return !rule.value || !rule.valueTo;
  }
  return !rule.value;
}

export function validateQueryAST(node) {
  if (!node) return false;
  if (node.type === 'rule') {
    return !isRuleIncomplete(node);
  }
  if (node.type === 'group') {
    if (node.children.length === 0) return false;
    return node.children.every(validateQueryAST);
  }
  return false;
}


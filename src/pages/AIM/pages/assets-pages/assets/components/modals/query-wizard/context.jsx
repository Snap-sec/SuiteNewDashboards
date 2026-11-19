import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { makeRule, makeGroup } from './utils.jsx';

// ─── Context ─────────────────────────────────────────────────────────────────
const QueryWizardContext = createContext(null);

export function useQueryWizard() {
  return useContext(QueryWizardContext);
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
// Immutable tree operations. All operations receive the id of the target node.
// This means dispatch references are STABLE and children never re-render
// just because a sibling changed.

function updateNode(node, id, updater) {
  if (node.id === id) return updater(node);
  if (node.type === 'group') {
    const nextChildren = node.children.map((c) => updateNode(c, id, updater));
    // Return same reference if nothing changed, preventing re-renders up the tree
    if (nextChildren === node.children) return node;
    const changed = nextChildren.some((c, i) => c !== node.children[i]);
    if (!changed) return node;
    return { ...node, children: nextChildren };
  }
  return node;
}

function removeNode(node, id) {
  if (node.type === 'group') {
    const nextChildren = node.children.filter((c) => c.id !== id);
    // recurse into sub-groups
    const recursed = nextChildren.map((c) => {
      if (c.type === 'group') return removeNode(c, id);
      return c;
    });
    const children = recursed.length > 0 ? recursed : [makeRule()];
    return { ...node, children };
  }
  return node;
}

function wizardReducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return makeGroup('AND');
    case 'SET_TREE':
      return action.payload;
    case 'UPDATE_NODE':
      return updateNode(state, action.id, action.updater);
    case 'REMOVE_NODE':
      return removeNode(state, action.id);
    case 'ADD_RULE': {
      return updateNode(state, action.groupId, (g) => ({
        ...g,
        children: [...g.children, makeRule()],
      }));
    }
    case 'ADD_GROUP': {
      return updateNode(state, action.groupId, (g) => ({
        ...g,
        children: [...g.children, makeGroup('AND')],
      }));
    }
    case 'SET_LOGIC_OP': {
      return updateNode(state, action.groupId, (g) => ({
        ...g,
        logicOp: action.logicOp,
      }));
    }
    case 'UPDATE_RULE': {
      return updateNode(state, action.ruleId, () => action.rule);
    }
    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function QueryWizardProvider({ children, initialTree, schemaList, operatorsMap }) {
  const [tree, dispatch] = useReducer(wizardReducer, initialTree);

  // Stable action creators — these refs never change so memo on child components is not broken
  const actions = useMemo(() => ({
    reset: () => dispatch({ type: 'RESET' }),
    setTree: (payload) => dispatch({ type: 'SET_TREE', payload }),
    addRule: (groupId) => dispatch({ type: 'ADD_RULE', groupId }),
    addGroup: (groupId) => dispatch({ type: 'ADD_GROUP', groupId }),
    removeNode: (id) => dispatch({ type: 'REMOVE_NODE', id }),
    setLogicOp: (groupId, logicOp) => dispatch({ type: 'SET_LOGIC_OP', groupId, logicOp }),
    updateRule: (ruleId, rule) => dispatch({ type: 'UPDATE_RULE', ruleId, rule }),
  }), []); // dispatch is stable from useReducer, so this memo is truly stable

  const value = useMemo(() => ({
    tree,
    actions,
    schemaList,
    operatorsMap,
  }), [tree, actions, schemaList, operatorsMap]);

  return (
    <QueryWizardContext.Provider value={value}>
      {children}
    </QueryWizardContext.Provider>
  );
}

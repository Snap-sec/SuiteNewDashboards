import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, Settings2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCreateAimSavedQueryMutation, useDeleteAimSavedQueryMutation, useGetAimQuerySchemaQuery, useGetAimSavedQueriesQuery, usePerformAimAdvancedSearchMutation, useUpdateAimSavedQueryMutation } from '@/services/asset-inventory/assets/queriesApi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
// ─── Internal Imports ────────────────────────────────────────────────────────
import { GroupNode } from './query-wizard/components/GroupNode';
import { buildQueryString, hydrateQueryAST, makeGroup, ruleCount, sanitizeQueryAST, validateQueryAST } from './query-wizard/utils.jsx';


/**
 * QueryWizardContent contains the heavy lifting of the query builder.
 * It is separated to ensure that hooks and heavy state only run when the modal is open.
 */
const QueryWizardContent = memo(function QueryWizardContent({ setOpen, onSuccess, initialAST, editingQuery, setQueryString }) {
  // Initialize state based on initial props
  const [rootGroup, setRootGroup] = useState(() => {
    if (editingQuery) return hydrateQueryAST(editingQuery.queryAST);
    if (initialAST) return hydrateQueryAST(initialAST);
    return makeGroup('AND');
  });

  const [activePreset, setActivePreset] = useState(editingQuery?.name || null);
  const [isSaveToggle, setIsSaveToggle] = useState(!!editingQuery);
  const [queryName, setQueryName] = useState(editingQuery?.name || '');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState(null);
  const [localEditingQuery, setLocalEditingQuery] = useState(editingQuery);

  // Sync if props change while open (handle edge case)
  useEffect(() => {
    if (editingQuery) {
      setRootGroup(hydrateQueryAST(editingQuery.queryAST));
      setQueryName(editingQuery.name);
      setIsSaveToggle(true);
      setLocalEditingQuery(editingQuery);
      setActivePreset(editingQuery.name);
    } else if (initialAST) {
      setRootGroup(hydrateQueryAST(initialAST));
      setQueryName('');
      setIsSaveToggle(false);
      setLocalEditingQuery(null);
      setActivePreset(null);
    }
  }, [editingQuery, initialAST]);

  const { data: schemaData } = useGetAimQuerySchemaQuery();
  const { data: savedQueries } = useGetAimSavedQueriesQuery();
  const [performSearch, { isLoading: isSearching }] = usePerformAimAdvancedSearchMutation();
  const [createSavedQuery, { isLoading: isCreating }] = useCreateAimSavedQueryMutation();
  const [updateSavedQuery, { isLoading: isUpdating }] = useUpdateAimSavedQueryMutation();
  const [deleteSavedQuery] = useDeleteAimSavedQueryMutation();

  const ASSET_SCHEMA = useMemo(() => schemaData?.properties || [], [schemaData]);
  const OPERATORS_LIST = useMemo(() => schemaData?.operators?.[0] || {}, [schemaData]);

  const queryStr = useMemo(() => buildQueryString(rootGroup, ASSET_SCHEMA) || '', [rootGroup, ASSET_SCHEMA]);
  const totalRules = useMemo(() => ruleCount(rootGroup), [rootGroup]);
  const isQueryValid = useMemo(() => validateQueryAST(rootGroup), [rootGroup]);

  const reset = useCallback(() => {
    setRootGroup(makeGroup('AND'));
    setActivePreset(null);
    setQueryName('');
    setIsSaveToggle(false);
    setLocalEditingQuery(null);
  }, []);

  const handleApplyFilter = async () => {
    if (!isQueryValid) {
      toast.error('Please complete all filter rules before applying');
      return;
    }
    try {
      const sanitized = sanitizeQueryAST(rootGroup);

      if (isSaveToggle && queryName.trim()) {
        if (localEditingQuery?._id) {
          await updateSavedQuery({
            id: localEditingQuery._id,
            name: queryName.trim(),
            queryAST: sanitized
          }).unwrap();
        } else {
          await createSavedQuery({
            name: queryName.trim(),
            queryAST: sanitized
          }).unwrap();
        }
      }

      await performSearch({ body: sanitized }).unwrap();
      setQueryString(queryStr);
      onSuccess?.(sanitized);
      toast.success(isSaveToggle ? 'Query updated/saved and applied' : 'Filter criteria applied successfully');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to apply filter');
      console.error(error);
    }
  };

  const handleSaveOnly = async () => {
    if (!isQueryValid) {
      toast.error('Please complete all filter rules before saving');
      return;
    }
    if (!queryName.trim()) {
      toast.error('Please enter a query name');
      return;
    }
    try {
      const sanitized = sanitizeQueryAST(rootGroup);
      if (localEditingQuery?._id) {
        await updateSavedQuery({
          id: localEditingQuery._id,
          name: queryName.trim(),
          queryAST: sanitized
        }).unwrap();
        toast.success('Query updated successfully');
      } else {
        await createSavedQuery({
          name: queryName.trim(),
          queryAST: sanitized
        }).unwrap();
        toast.success('Query saved successfully');
      }
      setIsSaveToggle(false);
      setQueryName('');
    } catch (error) {
      toast.error('Failed to save query');
    }
  };

  const applyPreset = useCallback((preset) => {
    setActivePreset(preset.name);
    setRootGroup(hydrateQueryAST(preset.queryAST));
    setQueryName(preset.name);
    setIsSaveToggle(true);
    setLocalEditingQuery(preset);
    toast.success(`Applied: ${preset.name}`);
  }, []);

  const PRESETS = savedQueries || [];

  return (
    <>
      <DialogContent className="max-w-[850px] max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden border-border bg-background shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 border-b border-border mb-0">
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight">Query Wizard</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Build advanced nested filters for your asset registry</p>
          </div>
        </DialogHeader>

        <div className="px-6 py-3 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 shrink-0">Presets:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PRESETS.map((p) => (
                <div
                  key={p._id}
                  className={cn(
                    "group flex items-center gap-2 px-2.5 py-0.5 rounded-md border transition-all cursor-pointer h-7 shrink-0",
                    activePreset === p.name
                      ? "bg-primary/5 border-primary/50 text-primary"
                      : "bg-muted/30 border-transparent hover:border-border text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => applyPreset(p)}
                >
                  <span className="text-[11px] font-medium whitespace-nowrap">
                    {p.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQueryToDelete(p);
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-0.5 hover:text-destructive transition-opacity"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground shrink-0"
          >
            Reset
          </Button>
        </div>

        <ScrollArea className="flex-1 min-h-0 w-full">
          <div className="p-8 max-w-4xl mx-auto">
            <GroupNode
              group={rootGroup}
              onUpdate={setRootGroup}
              onRemove={() => { }}
              depth={0}
              isOnly={true}
              schemaList={ASSET_SCHEMA}
              operatorsMap={OPERATORS_LIST}
            />
          </div>
        </ScrollArea>

        {queryStr && (
          <div className="px-6 py-3 bg-primary/5 border-y border-border mx-0 mb-0 flex gap-4 items-center">
            <div className="flex items-center gap-2 text-primary flex-shrink-0">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">Output:</span>
            </div>
            <code className="text-[11px] font-mono text-primary/80 break-all leading-relaxed flex-1">
              {queryStr}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="size-8 hover:bg-primary/10"
              onClick={() => {
                navigator.clipboard.writeText(queryStr);
                toast.success('Query copied to clipboard');
              }}
            >
              <Copy className="size-3.5" />
            </Button>
          </div>
        )}

        <DialogFooter className="p-6 border-t border-border bg-background gap-4 items-center">
          <div className="flex-1 flex gap-3">
            <div className="flex items-center gap-3">
              <div
                onClick={() => setIsSaveToggle(!isSaveToggle)}
                className={cn(
                  "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
                  isSaveToggle ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    isSaveToggle ? "translate-x-5" : "translate-x-1"
                  )}
                />
              </div>
              <label className="text-xs font-normal tracking-wider text-muted-foreground cursor-pointer"
                onClick={() => setIsSaveToggle(!isSaveToggle)}>
                Save Query
              </label>
            </div>
            {isSaveToggle && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 w-70 duration-200">
                <input
                  type="text"
                  placeholder="Query nickname (e.g. Critical Cloud Assets)"
                  value={queryName}
                  onChange={(e) => setQueryName(e.target.value)}
                  className="flex-1 h-8 px-3 bg-background border border-border rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  autoFocus
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isSaveToggle && (
              <Button
                variant="ghost"
                onClick={handleSaveOnly}
                disabled={isCreating || !isQueryValid}
              >
                {isCreating ? 'Saving...' : 'Save Query'}
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isSearching || isCreating || !isQueryValid}
              onClick={handleApplyFilter}
            >
              {isSearching ? 'Applying...' : 'Apply Filter'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      <ConfirmDialog
        open={deleteConfirmOpen}
        setOpen={setDeleteConfirmOpen}
        dialog={`Are you sure you want to delete "${queryToDelete?.name}"? This action cannot be undone.`}
        onConfirm={async () => {
          if (!queryToDelete) return;
          try {
            await deleteSavedQuery(queryToDelete._id).unwrap();
            toast.success('Query deleted successfully');
            setDeleteConfirmOpen(false);
            setQueryToDelete(null);
            if (activePreset === queryToDelete.name) {
              reset();
            }
          } catch (err) {
            toast.error('Failed to delete query');
          }
        }}
        confirmButton={<Button variant="destructive">Delete Query</Button>}
      />
    </>
  );
});

export default function QueryWizardModal({
  trigger,
  onSuccess,
  initialAST,
  open: controlledOpen,
  onOpenChange,
  editingQuery,
  setQueryString = ""
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            <Settings2 className="size-4" />
            Query Wizard
          </Button>
        )}
      </DialogTrigger>

      {/* 
          Performance Optimization: 
          Only render the modal content when the modal is open.
          This prevents heavy query-wizard hooks and state updates from running
          background-re-renders of the entire page when the modal is closed.
      */}
      {open && (
        <QueryWizardContent
          setOpen={setOpen}
          onSuccess={onSuccess}
          initialAST={initialAST}
          editingQuery={editingQuery}
          setQueryString={setQueryString}
        />
      )}
    </Dialog>
  );
}
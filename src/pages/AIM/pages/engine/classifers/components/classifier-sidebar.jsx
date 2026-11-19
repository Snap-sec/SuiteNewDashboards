import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Plus, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import {
  useGetAimPoliciesByTypeQuery,
  useToggleAimPolicyMutation,
  useDeleteAimPolicyMutation,
  useExecuteSingleAimPolicyMutation,
  useExecuteAllAimPolicyMutation,
} from '@/services/asset-inventory/policyApi';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import useStore from '../store';
import { ClassifierCard, ClassifierCardSkeleton } from './classifier-card';

const PAGE_SIZE = 20;

export function ClassifierSidebar({ onActiveClassifierChange, onClassifiersStateChange }) {
  const navigate = useNavigate();

  const currentTab = useStore((state) => state.currentTab);
  const setCurrentTab = useStore((state) => state.setCurrentTab);
  const sidebarSearch = useStore((state) => state.sidebarSearch);
  const setSidebarSearch = useStore((state) => state.setSidebarSearch);
  const activeClassifierId = useStore((state) => state.activeClassifierId);
  const setActiveClassifierId = useStore((state) => state.setActiveClassifierId);

  const { data: classifiersData, isFetching, isLoading, isError, error } = useGetAimPoliciesByTypeQuery({
    search: sidebarSearch || undefined,
    limit: PAGE_SIZE,
  }, { refetchOnMountOrArgChange: true });

  const allClassifiers = classifiersData?.data || (Array.isArray(classifiersData) ? classifiersData : []);

  const displayClassifiers = useMemo(() => {
    if (currentTab === 'active') return allClassifiers.filter((c) => c.enabled !== false);
    if (currentTab === 'disabled') return allClassifiers.filter((c) => c.enabled === false);
    return allClassifiers;
  }, [allClassifiers, currentTab]);

  // Auto-select first classifier
  useEffect(() => {
    if (displayClassifiers.length > 0) {
      const current = displayClassifiers.find((c) => c._id === activeClassifierId);
      if (!current) {
        const first = displayClassifiers[0];
        setActiveClassifierId(first._id);
        onActiveClassifierChange?.(first);
      } else {
        onActiveClassifierChange?.(current);
      }
    } else {
      onActiveClassifierChange?.(null);
    }
  }, [displayClassifiers, activeClassifierId, setActiveClassifierId, onActiveClassifierChange]);

  // Propagate loading/empty state upward
  useEffect(() => {
    if (onClassifiersStateChange) {
      onClassifiersStateChange({
        isLoading: isLoading || isFetching,
        isEmpty: !isLoading && !isFetching && displayClassifiers.length === 0,
        isSystemEmpty: !isLoading && !isFetching && allClassifiers.length === 0 && !sidebarSearch,
        isError,
        error
      });
    }
  }, [isLoading, isFetching, displayClassifiers.length, allClassifiers.length, sidebarSearch, onClassifiersStateChange]);

  const [togglePolicy] = useToggleAimPolicyMutation();
  const [deletePolicy] = useDeleteAimPolicyMutation();
  const [executeSingle] = useExecuteSingleAimPolicyMutation();
  const [executeAll, { isLoading: isExecutingAll }] = useExecuteAllAimPolicyMutation();

  const handleClassifierClick = (classifier) => {
    setActiveClassifierId(classifier._id);
    onActiveClassifierChange?.(classifier);
  };

  const handleToggle = (classifier, enabled) => {
    toast.promise(togglePolicy({ policyId: classifier._id, enabled }).unwrap(), {
      loading: 'Updating Status...',
      success: () => {
        setCurrentTab(enabled ? 'active' : 'disabled');
        return 'Status Updated';
      },
      error: 'Failed to update status',
    });
  };

  const handleDelete = (id) => {
    toast.promise(
      deletePolicy(id)
        .unwrap()
        .then(() => {
          if (activeClassifierId === id) {
            setActiveClassifierId(null);
            onActiveClassifierChange?.(null);
          }
        }),
      {
        loading: 'Deleting Policy...',
        success: 'Policy Deleted',
        error: 'Failed to delete Policy',
      }
    );
  };

  const handleExecute = (id) => {
    toast.promise(executeSingle(id).unwrap(), {
      loading: 'Executing Policy...',
      success: 'Execution started',
      error: (err) => err?.data?.message || err?.data?.error || 'Failed to execute Policy',
    });
  };

  const handleEdit = (id) => {
    navigate(`/assetinventory/automation/new?policyId=${id}`);
  };

  const handleExecuteAll = () => {
    toast.promise(executeAll().unwrap(), {
      loading: 'Executing all policies...',
      success: 'Execution started',
      error: 'Failed to execute policies',
    });
  };

  return (
    <aside className="w-[380px] shrink-0 border-r border-border flex flex-col bg-background h-full">
      <div className="p-4 flex flex-col gap-3">
        {/* Tabs + Execute All */}
        <div className="flex items-center justify-between">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1">
            <TabsList className="w-full bg-muted/50 p-1" variant="default" size="sm">
              <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
              <TabsTrigger value="disabled" className="flex-1">Disabled</TabsTrigger>
            </TabsList>
          </Tabs>

          <AuthorityGuard forbidRoles={['Auditor']}>
            <div className="ml-2">
              <CustomTooltip text="Execute All Policies">
                <ButtonWithConfirm
                  variant="ghost"
                  className="h-8 w-8"
                  confirm
                  onConfirm={handleExecuteAll}
                  disabled={isExecutingAll}
                  title="Execute All Policies"
                  dialog="This will execute all policy rules. Are you sure you want to proceed?"
                >
                  <Play className={`size-4 ${isExecutingAll ? 'animate-pulse' : ''}`} />
                </ButtonWithConfirm>
              </CustomTooltip>
            </div>
          </AuthorityGuard>
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search Policy..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          <AuthorityGuard forbidRoles={['Auditor']}>
            <CustomTooltip text="Create New Policy">
              <Button
                className="h-8 w-8 shrink-0"
                title="Create New Policy"
                onClick={() => navigate('/assetinventory/automation/new')}
              >
                <Plus className="size-4" />
              </Button>
            </CustomTooltip>
          </AuthorityGuard>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="flex flex-col gap-2.5">
          {/* Loading skeletons */}
          {isLoading && displayClassifiers.length === 0 &&
            Array.from({ length: 4 }).map((_, i) => <ClassifierCardSkeleton key={i} />)
          }

          {/* Classifier cards */}
          {displayClassifiers.map((classifier) => (
            <ClassifierCard
              key={classifier._id}
              classifier={classifier}
              isActive={activeClassifierId === classifier._id}
              onClick={() => handleClassifierClick(classifier)}
              onToggle={handleToggle}
              onExecute={handleExecute}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {/* No results */}
          {!isLoading && displayClassifiers.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No {currentTab === 'disabled' ? 'disabled' : 'active'} policies found
              {sidebarSearch && ` matching "${sidebarSearch}"`}
            </div>
          )}

          {/* End of list */}
          {!isLoading && !isFetching && displayClassifiers.length > 0 && (
            <p className="text-center text-[10px] text-muted-foreground/50 py-2">
              {displayClassifiers.length} polic{displayClassifiers.length !== 1 ? 'ies' : 'y'} loaded
            </p>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

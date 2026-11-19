import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Sparkles,
  ShieldCheck,
  Code2,
  MessageSquareCode,
  Boxes,
  Key,
  Bug,
  Database,
  Check,
  Loader2,
  X,
} from 'lucide-react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSkillsQuery } from '@/services/automation/skillsApi';
import { cn } from '@/lib/utils';


export function getSkillIcon(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('cve') || lower.includes('shield') || lower.includes('vuln')) return ShieldCheck;
  if (lower.includes('semgrep') || lower.includes('code') || lower.includes('ast')) return Code2;
  if (lower.includes('github') || lower.includes('pr') || lower.includes('comment')) return MessageSquareCode;
  if (lower.includes('k8s') || lower.includes('kube') || lower.includes('box')) return Boxes;
  if (lower.includes('secret') || lower.includes('key') || lower.includes('trufflehog')) return Key;
  if (lower.includes('zap') || lower.includes('dast') || lower.includes('bug') || lower.includes('probe')) return Bug;
  if (lower.includes('nvd') || lower.includes('db') || lower.includes('data')) return Database;
  return Sparkles;
}

export default function AddSkillsModal({
  open,
  setOpen,
  assignedSkills = [],
  onAddSkills,
  isAdding = false,
}) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch skills from endpoint /automations/api/v1/skills
  const { data: apiData, isLoading, isFetching } = useGetSkillsQuery(undefined, {
    skip: !open,
  });

  // Reset local state when modal opens, initializing with currently assigned skills
  useEffect(() => {
    if (open) {
      setSearch('');
      const initialIds = [];
      assignedSkills.forEach((s) => {
        const val = typeof s === 'string' ? s : s.id || s._id || s.name;
        if (val) initialIds.push(val);
      });
      setSelectedIds(initialIds);
    }
  }, [open, assignedSkills]);

  // Normalize set of initially assigned skill names/IDs
  const assignedSet = useMemo(() => {
    const set = new Set();
    assignedSkills.forEach((s) => {
      const val = typeof s === 'string' ? s : s.name || s.id || s._id;
      if (val) set.add(String(val).trim().toLowerCase());
    });
    return set;
  }, [assignedSkills]);

  // Combine endpoint skills with base capabilities
  const allSkills = useMemo(() => {
    const raw =
      apiData?.data?.skills ||
      apiData?.data?.data ||
      apiData?.data ||
      apiData?.skills ||
      (Array.isArray(apiData) ? apiData : []);

    return Array.isArray(raw)
      ? raw.map((item) => {
          const id = item._id || item.id || item.name;
          const name = item.name || 'unnamed_skill';
          const desc = item.description || item.desc || 'Autonomous capability package';
          return {
            id,
            name,
            desc,
            icon: getSkillIcon(name),
            isApi: true,
          };
        })
      : [];
  }, [apiData]);

  // Filter skills based on search
  const filteredSkills = useMemo(() => {
    if (!search.trim()) return allSkills;
    const q = search.toLowerCase().trim();
    return allSkills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.desc && s.desc.toLowerCase().includes(q))
    );
  }, [allSkills, search]);

  const toggleSelectSkill = (skill) => {
    setSelectedIds((prev) => {
      const matches = (id) =>
        id === skill.id ||
        (skill._id && id === skill._id) ||
        (skill.name && String(id).toLowerCase() === skill.name.toLowerCase());

      const exists = prev.some(matches);
      if (exists) {
        return prev.filter((id) => !matches(id));
      }
      return [...prev, skill.id];
    });
  };

  const handleConfirm = async () => {
    const toApply = allSkills.filter((s) =>
      selectedIds.some(
        (id) =>
          id === s.id ||
          (s._id && id === s._id) ||
          (s.name && String(id).toLowerCase() === s.name.toLowerCase())
      )
    );
    if (onAddSkills) {
      await onAddSkills(toApply);
    }
    setOpen(false);
  };

  const selectedCount = selectedIds.length;

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Add Skills & Capabilities"
      description="Attach autonomous execution skills and security analyzers to this agent."
      className="sm:max-w-xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-2xs text-muted-foreground">
            {selectedCount > 0 ? (
              <span className="text-foreground font-medium">
                {selectedCount} skill{selectedCount > 1 ? 's' : ''} selected
              </span>
            ) : (
              'No skills selected'
            )}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirm}
              disabled={isAdding}
              className="gap-1.5"
            >
              {isAdding ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  Save Skills ({selectedCount})
                </>
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-3 py-1">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills by name or capability..."
            className="pl-8.5 pr-8 h-9 text-2sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Skills Grid */}
        <div className="min-h-[260px] max-h-[380px] overflow-y-auto pr-1 flex flex-col gap-2">
          {isLoading || isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="border border-border/60 rounded-xl p-3 flex items-center gap-3 animate-pulse"
                >
                  <Skeleton className="size-9 rounded-lg shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Sparkles className="size-8 stroke-1 mb-2 opacity-50" />
              <p className="text-sm font-medium">No skills found</p>
              <p className="text-2xs mt-0.5">
                {search ? 'Try adjusting your search query' : 'No available skills in the package repository'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-1">
              {filteredSkills.map((skill) => {
                const SkillIcon = skill.icon || Sparkles;
                const isAssigned = assignedSet.has(skill.name.toLowerCase());
                const isSelected = selectedIds.some(
                  (id) =>
                    id === skill.id ||
                    (skill._id && id === skill._id) ||
                    (skill.name && String(id).toLowerCase() === skill.name.toLowerCase())
                );

                return (
                  <div
                    key={skill.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSelectSkill(skill)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSelectSkill(skill);
                      }
                    }}
                    className={cn(
                      'border rounded-xl p-3 flex items-center justify-between gap-2.5 transition-all select-none text-left cursor-pointer',
                      isSelected
                        ? 'bg-primary/10 border-primary ring-1 ring-primary shadow-xs'
                        : 'bg-card hover:bg-muted/30 border-border hover:border-border/80'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={cn(
                          'size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-primary/10 text-primary'
                        )}
                      >
                        <SkillIcon className="size-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-2sm font-semibold text-foreground truncate">
                          {skill.name}
                        </span>
                        <span className="text-2xs text-muted-foreground truncate leading-tight mt-0.5">
                          {skill.desc}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 ml-1 flex items-center gap-2">
                      {isAssigned && (
                        <Badge
                          variant="secondary"
                          size="xs"
                          className="text-[10px] uppercase tracking-wider"
                        >
                          Assigned
                        </Badge>
                      )}
                      <div
                        className={cn(
                          'size-5 rounded-md flex items-center justify-center transition-colors',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-input hover:border-primary/50'
                        )}
                      >
                        {isSelected && <Check className="size-3.5 stroke-[2.5]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Select from '@/components/custom/select';
import { Badge } from '@/components/ui/badge';
import { useGetVmAssessmentsQuery } from '../../../../../../../services/vm/assessmentsApi';
import { useGetVmChangeManagementPentestRequestsQuery } from '../../../../../../../services/vm/changeManagementApi';
import { SelectedKindPill } from './selected-kind-pill';
import useDebounce from '@/hooks/use-debounce';
import {
  KIND_ICON_MAP,
  SCOPE_ICON_MAP,
  SCOPE_LABEL_MAP,
  FORMAT_DESCRIPTION_MAP,
} from './constants';

export function Step2Configuration({
  selectedKind,
  scopes,
  selectedScope,
  selectedScopeIdx,
  setSelectedScopeIdx,
  availableFormats,
  selectedFormat,
  setSelectedFormat,
  selectedAssessment,
  setSelectedAssessment,
  selectedChangeRequest,
  setSelectedChangeRequest,
  handleBack,
}) {
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search, 400);
  const [selectedAssessmentObj, setSelectedAssessmentObj] = useState(null);

  useEffect(() => {
    setLimit(10);
  }, [debouncedSearch]);

  // ─── Queries ─────────────────────────────────────────────────────────────
  const {
    data: assessments,
    isLoading,
    isFetching,
  } = useGetVmAssessmentsQuery(
    { page: 1, limit, search: debouncedSearch },
    { skip: selectedScope?.type !== 'assessment' },
  );

  const assessmentsList = assessments?.data?.assessments || [];
  const totalAssessments = assessments?.data?.total || assessments?.data?.totalAssessments;
  const hasMore =
    totalAssessments !== undefined
      ? assessmentsList.length < totalAssessments
      : assessmentsList.length >= limit;

  const handleReachBottom = () => {
    if (!isFetching && !isLoading && hasMore) {
      setLimit((prev) => prev + 10);
    }
  };

  const { data: changeData, isLoading: isLoadingChangeRequest } =
    useGetVmChangeManagementPentestRequestsQuery(
      { page: 1, limit: 10, search },
      { skip: selectedScope?.type !== 'change-request' },
    );

  const asmObj =
    selectedAssessmentObj ||
    assessmentsList.find((a) => a._id === selectedAssessment);

  const isExecutive =
    selectedKind?.type === 'executive' ||
    selectedScope?.id === 'executive' ||
    selectedScope?.id === 'fullexec';

  let renderedFormats = [...availableFormats];
  const isLargeAssessment =
    !isExecutive &&
    selectedScope?.type === 'assessment' &&
    Boolean(asmObj && asmObj.totalVulns > 500);

  if (isLargeAssessment) {
    renderedFormats = renderedFormats.filter((fmt) => fmt !== 'pdf');
    if (!renderedFormats.includes('xlsx')) {
      renderedFormats.push('xlsx');
    }
  }

  const stringifiedFormats = renderedFormats.join(',');
  useEffect(() => {
    if (renderedFormats.length > 0 && !renderedFormats.includes(selectedFormat)) {
      setSelectedFormat(renderedFormats[0]);
    }
  }, [stringifiedFormats, selectedFormat, setSelectedFormat]);

  return (
    <div className="flex flex-col gap-5">
      {/* Back link */}
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      {/* Selected kind pill */}
      <SelectedKindPill
        icon={KIND_ICON_MAP[selectedKind.type] || FileText}
        label={selectedKind.name}
      />

      {/* ── Generate On (scope) ─────────────────────────────────── */}
      {scopes.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-muted-foreground tracking-widest uppercase mb-2.5">
            Generate On
          </p>
          <div className="flex flex-wrap gap-2">
            {scopes.map((scope, idx) => {
              const ScopeIcon = SCOPE_ICON_MAP[scope.type] || Circle;
              return (
                <button
                  key={scope.type}
                  type="button"
                  onClick={() => {
                    setSelectedScopeIdx(idx);
                    setSelectedFormat(scope.formats?.[0] || '');
                    setSelectedAssessment('');
                    setSelectedAssessmentObj(null);
                    setSelectedChangeRequest('');
                    setSearch('');
                    setLimit(10);
                  }}
                  className={cn(
                    'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm border transition-all cursor-pointer',
                    selectedScopeIdx === idx
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30',
                  )}
                >
                  <ScopeIcon className="w-3.5 h-3.5" />
                  {SCOPE_LABEL_MAP[scope.type] || scope.type}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Assessment selector ─────────────────────────────────── */}
      {selectedScope?.type === 'assessment' && (
        <div>
          <p className="text-sm text-muted-foreground mb-1.5">
            Select Assessment
          </p>
          <Select
            defaultValue={selectedAssessment}
            options={assessmentsList.map((o) => ({
              label: o.title,
              value: o._id,
              raw: o,
              customLabel: (
                <div className="flex items-center justify-between gap-2 w-full overflow-hidden">
                  <span className="truncate font-medium">{o.title}</span>
                  {o.totalVulns !== undefined && (
                    <Badge variant="destructive" appearance="outline" size="sm">
                      {o.totalVulns} Vuln{o.totalVulns !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              ),
            }))}
            onChange={(o) => {
              setSelectedAssessment(o ? o.value : '');
              setSelectedAssessmentObj(o ? o.raw : null);
            }}
            onSearchChange={(s) => setSearch(s)}
            isSearching={isLoading}
            isFetching={isFetching}
            onReachBottom={handleReachBottom}
            renderCustomLabelInTrigger={true}
          />
          {isLargeAssessment && (
            <p className="text-[11px] text-amber-500/90 mt-2 font-medium">
              * Reports with more than 500 vulnerabilities can only be generated in XLSX format.
            </p>
          )}
        </div>
      )}

      {/* ── Change Request selector ─────────────────────────────── */}
      {selectedScope?.type === 'change-request' && (
        <div>
          <p className="text-sm text-muted-foreground mb-1.5">
            Select Change Request
          </p>
          <Select
            defaultValue={selectedChangeRequest}
            options={changeData?.data?.map((cr) => {
              const labelText = cr.title || cr?.changeRequestData?.requestTitle || cr?.changeRequestData?.applicationServiceName;
              return {
                label: labelText,
                value: cr._id,
                customLabel: (
                  <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <span className="truncate font-medium">{labelText}</span>
                    <div className="flex items-center gap-2">
                      {cr.status && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 uppercase tracking-wider font-semibold">
                          {cr.status}
                        </Badge>
                      )}
                      {cr.crqNumber && (
                        <span className="text-xs text-muted-foreground">
                          {cr.crqNumber}
                        </span>
                      )}
                    </div>
                  </div>
                ),
              };
            })}
            onChange={(o) => setSelectedChangeRequest(o ? o.value : '')}
            onSearchChange={(s) => setSearch(s)}
            isSearching={isLoadingChangeRequest}
            renderCustomLabelInTrigger={true}
          />
        </div>
      )}

      {/* ── Export Format ────────────────────────────────────────── */}
      {renderedFormats.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-muted-foreground tracking-widest uppercase mb-2.5">
            Export Format
          </p>
          <div className="flex flex-wrap gap-2">
            {renderedFormats.map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-sm border transition-all cursor-pointer',
                  selectedFormat === fmt
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30',
                )}
              >
                <span className="font-semibold uppercase">{fmt}</span>{' '}
                <span className="text-xs text-muted-foreground">
                  {FORMAT_DESCRIPTION_MAP[fmt] || fmt}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

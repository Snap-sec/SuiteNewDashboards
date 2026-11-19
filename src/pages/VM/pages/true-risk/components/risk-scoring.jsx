import { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Info, RefreshCcw } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider, SliderThumb } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';

const ASSET_TYPE_MAP = {
  subdomain: 'Subdomain',
  ip: 'IP Address',
  repository: 'Source Code Repository',
  dns: 'DNS Record',
  employee: 'Employee Account',
  technology: 'Technology/Stack',
  application: 'Web Application',
  certificate: 'SSL/TLS Certificate',
  registry: 'Container Registry',
  vendor: 'Third-party Vendor',
  object_storage: 'Cloud Storage',
  api: 'API Endpoint',
  // endpoint: 'User Endpoint',
  workstation: 'Workstation',
  server: 'Infrastructure Server',
  port: 'Network Port',
};

const RiskScoring = forwardRef(({ data, onChange }, ref) => {
  const { user } = useAuth();

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // State for each section - initialize with defaults or props
  const [cvssEnabled, setCvssEnabled] = useState(data?.data?.factors?.cvss?.enabled ?? true);
  const [cvssWeight, setCvssWeight] = useState(data?.data?.factors?.cvss?.weight ?? 25);

  const [exposureEnabled, setExposureEnabled] = useState(data?.data?.factors?.exposure?.enabled ?? true);
  const [exposureWeight, setExposureWeight] = useState(data?.data?.factors?.exposure?.weight ?? 25);
  const [exposureLevels, setExposureLevels] = useState(data?.data?.factors?.exposure?.riskLevels ?? []);

  const [slaEnabled, setSlaEnabled] = useState(data?.data?.factors?.sla?.enabled ?? true);
  const [slaWeight, setSlaWeight] = useState(data?.data?.factors?.sla?.weight ?? 25);
  const [slaLevels, setSlaLevels] = useState(data?.data?.factors?.sla?.riskLevels ?? []);

  const [epssEnabled, setEpssEnabled] = useState(data?.data?.factors?.epss?.enabled ?? true);
  const [epssWeight, setEpssWeight] = useState(data?.data?.factors?.epss?.weight ?? 25);

  const [kevEnabled, setKevEnabled] = useState(data?.data?.factors?.kev?.enabled ?? true);
  const [kevWeight, setKevWeight] = useState(data?.data?.factors?.kev?.weight ?? 25);

  const [assetTypeEnabled, setAssetTypeEnabled] = useState(data?.data?.factors?.assetType?.enabled ?? true);
  const [assetTypeWeight, setAssetTypeWeight] = useState(data?.data?.factors?.assetType?.weight ?? 25);
  const [assetTypeLevels, setAssetTypeLevels] = useState(data?.data?.factors?.assetType?.riskLevels ?? []);

  const [buRiskEnabled, setBuRiskEnabled] = useState(data?.data?.factors?.businessUnitRisk?.enabled ?? true);
  const [buRiskWeight, setBuRiskWeight] = useState(data?.data?.factors?.businessUnitRisk?.weight ?? 25);
  const [buRiskLevels, setBuRiskLevels] = useState(data?.data?.factors?.businessUnitRisk?.riskLevels ?? []);

  const [lastChanged, setLastChanged] = useState('epss');


  // Sync state when data prop changes
  const initializedRef = useRef(false);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!data?.data?.factors || initializedRef.current) return;

    initializedRef.current = true;
    isSyncingRef.current = true; // Mark as syncing from API — propagation effect must skip this

    setCvssEnabled(data.data.factors.cvss?.enabled ?? true);
    setCvssWeight(data.data.factors.cvss?.weight ?? 25);

    setExposureEnabled(data.data.factors.exposure?.enabled ?? true);
    setExposureWeight(data.data.factors.exposure?.weight ?? 25);
    setExposureLevels(data.data.factors.exposure?.riskLevels ?? []);

    setSlaEnabled(data.data.factors.sla?.enabled ?? true);
    setSlaWeight(data.data.factors.sla?.weight ?? 25);
    setSlaLevels(data.data.factors.sla?.riskLevels ?? []);

    setEpssEnabled(data.data.factors.epss?.enabled ?? true);
    setEpssWeight(data.data.factors.epss?.weight ?? 25);

    setKevEnabled(data.data.factors.kev?.enabled ?? true);
    setKevWeight(data.data.factors.kev?.weight ?? 25);

    setAssetTypeEnabled(data.data.factors.assetType?.enabled ?? true);
    setAssetTypeWeight(data.data.factors.assetType?.weight ?? 25);
    setAssetTypeLevels(data.data.factors.assetType?.riskLevels ?? []);

    setBuRiskEnabled(data.data.factors.businessUnitRisk?.enabled ?? true);
    setBuRiskWeight(data.data.factors.businessUnitRisk?.weight ?? 25);
    setBuRiskLevels(data.data.factors.businessUnitRisk?.riskLevels ?? []);
  }, [data]);

  // Propagate changes to parent - skip mount and API-driven syncs
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    // If state was just set from API data, skip this round and reset the flag
    if (isSyncingRef.current) {
      isSyncingRef.current = false;
      return;
    }
    const newData = {
      factors: {
        cvss: {
          enabled: cvssEnabled,
          weight: Number(cvssWeight),
        },
        exposure: {
          enabled: exposureEnabled,
          weight: Number(exposureWeight),
          riskLevels: exposureLevels,
        },
        sla: {
          enabled: slaEnabled,
          weight: Number(slaWeight),
          riskLevels: slaLevels,
        },
        epss: {
          enabled: epssEnabled,
          weight: Number(epssWeight),
        },
        kev: {
          enabled: kevEnabled,
          weight: Number(kevWeight),
        },
        assetType: {
          enabled: assetTypeEnabled,
          weight: Number(assetTypeWeight),
          riskLevels: assetTypeLevels,
        },
        businessUnitRisk: {
          enabled: buRiskEnabled,
          weight: Number(buRiskWeight),
          riskLevels: buRiskLevels,
        },
      },
    };
    onChangeRef.current?.(newData);
  }, [
    cvssEnabled,
    cvssWeight,
    exposureEnabled,
    exposureWeight,
    exposureLevels,
    slaEnabled,
    slaWeight,
    slaLevels,
    epssEnabled,
    epssWeight,
    kevEnabled,
    kevWeight,
    assetTypeEnabled,
    assetTypeWeight,
    assetTypeLevels,
    buRiskEnabled,
    buRiskWeight,
    buRiskLevels,
  ]);

  const handleRebalance = () => {
    const enabledMetrics = [];
    if (cvssEnabled) enabledMetrics.push('cvss');
    if (exposureEnabled) enabledMetrics.push('exposure');
    if (slaEnabled) enabledMetrics.push('sla');
    if (epssEnabled) enabledMetrics.push('epss');
    if (kevEnabled) enabledMetrics.push('kev');
    if (assetTypeEnabled) enabledMetrics.push('assetType');
    if (buRiskEnabled) enabledMetrics.push('buRisk');

    // Helper to create the final data object
    const getFinalData = (weights) => ({
      factors: {
        cvss: { enabled: weights.cvssEnabled ?? cvssEnabled, weight: Number(weights.cvss ?? cvssWeight) },
        exposure: { enabled: weights.exposureEnabled ?? exposureEnabled, weight: Number(weights.exposure ?? exposureWeight), riskLevels: exposureLevels },
        sla: { enabled: weights.slaEnabled ?? slaEnabled, weight: Number(weights.sla ?? slaWeight), riskLevels: slaLevels },
        epss: { enabled: weights.epssEnabled ?? epssEnabled, weight: Number(weights.epss ?? epssWeight) },
        kev: { enabled: weights.kevEnabled ?? kevEnabled, weight: Number(weights.kev ?? kevWeight) },
        assetType: { enabled: weights.assetTypeEnabled ?? assetTypeEnabled, weight: Number(weights.assetType ?? assetTypeWeight), riskLevels: assetTypeLevels },
        businessUnitRisk: { enabled: weights.buRiskEnabled ?? buRiskEnabled, weight: Number(weights.buRisk ?? buRiskWeight), riskLevels: buRiskLevels },
      },
    });

    if (enabledMetrics.length === 0) {
      const equalWeight = Math.floor(100 / 7);
      const remainder = 100 % 7;
      const cvssW = equalWeight + remainder;

      setCvssEnabled(true);
      setExposureEnabled(true);
      setSlaEnabled(true);
      setEpssEnabled(true);
      setKevEnabled(true);
      setAssetTypeEnabled(true);
      setBuRiskEnabled(true);

      setCvssWeight(cvssW);
      setExposureWeight(equalWeight);
      setSlaWeight(equalWeight);
      setEpssWeight(equalWeight);
      setKevWeight(equalWeight);
      setAssetTypeWeight(equalWeight);
      setBuRiskWeight(equalWeight);

      return getFinalData({
        cvssEnabled: true, exposureEnabled: true, slaEnabled: true, epssEnabled: true, kevEnabled: true, assetTypeEnabled: true, buRiskEnabled: true,
        cvss: cvssW, exposure: equalWeight, sla: equalWeight, epss: equalWeight, kev: equalWeight, assetType: equalWeight, buRisk: equalWeight
      });
    }

    const weights = {
      cvss: cvssWeight,
      exposure: exposureWeight,
      sla: slaWeight,
      epss: epssWeight,
      kev: kevWeight,
      assetType: assetTypeWeight,
      buRisk: buRiskWeight
    };

    if (enabledMetrics.length === 1) {
      const metric = enabledMetrics[0];
      weights[metric] = 100;

      if (cvssEnabled) setCvssWeight(100);
      if (exposureEnabled) setExposureWeight(100);
      if (slaEnabled) setSlaWeight(100);
      if (epssEnabled) setEpssWeight(100);
      if (kevEnabled) setKevWeight(100);
      if (assetTypeEnabled) setAssetTypeWeight(100);
      if (buRiskEnabled) setBuRiskWeight(100);

      return getFinalData(weights);
    }

    // Proportional rebalance preserving the last changed value
    let fixedVal = 0;
    if (lastChanged === 'cvss' && cvssEnabled) fixedVal = Number(cvssWeight);
    if (lastChanged === 'exposure' && exposureEnabled) fixedVal = Number(exposureWeight);
    if (lastChanged === 'sla' && slaEnabled) fixedVal = Number(slaWeight);
    if (lastChanged === 'epss' && epssEnabled) fixedVal = Number(epssWeight);
    if (lastChanged === 'kev' && kevEnabled) fixedVal = Number(kevWeight);
    if (lastChanged === 'assetType' && assetTypeEnabled) fixedVal = Number(assetTypeWeight);
    if (lastChanged === 'buRisk' && buRiskEnabled) fixedVal = Number(buRiskWeight);

    fixedVal = Math.min(100, fixedVal);
    const remaining = 100 - fixedVal;
    const others = enabledMetrics.filter(m => m !== lastChanged);

    if (others.length > 0) {
      const share = Math.floor(remaining / others.length);
      const remainder = remaining % others.length;

      others.forEach((m, idx) => {
        const val = share + (idx === 0 ? remainder : 0);
        weights[m] = val;
        if (m === 'cvss') setCvssWeight(val);
        if (m === 'exposure') setExposureWeight(val);
        if (m === 'sla') setSlaWeight(val);
        if (m === 'epss') setEpssWeight(val);
        if (m === 'kev') setKevWeight(val);
        if (m === 'assetType') setAssetTypeWeight(val);
        if (m === 'buRisk') setBuRiskWeight(val);
      });
    }

    // Ensure last changed is capped at 100
    weights[lastChanged] = fixedVal;
    if (lastChanged === 'cvss' && cvssEnabled) setCvssWeight(fixedVal);
    if (lastChanged === 'exposure' && exposureEnabled) setExposureWeight(fixedVal);
    if (lastChanged === 'sla' && slaEnabled) setSlaWeight(fixedVal);
    if (lastChanged === 'epss' && epssEnabled) setEpssWeight(fixedVal);
    if (lastChanged === 'kev' && kevEnabled) setKevWeight(fixedVal);
    if (lastChanged === 'assetType' && assetTypeEnabled) setAssetTypeWeight(fixedVal);
    if (lastChanged === 'buRisk' && buRiskEnabled) setBuRiskWeight(fixedVal);

    return getFinalData(weights);
  };

  useImperativeHandle(ref, () => ({
    rebalance: handleRebalance,
  }));

  const handleLevelScoreChange = (idx, newScore) => {
    const updatedLevels = [...assetTypeLevels];
    updatedLevels[idx] = { ...updatedLevels[idx], score: Number(newScore) };
    setAssetTypeLevels(updatedLevels);
  };

  const handleBuRiskLevelScoreChange = (idx, newScore) => {
    const updatedLevels = [...buRiskLevels];
    updatedLevels[idx] = { ...updatedLevels[idx], score: Number(newScore) };
    setBuRiskLevels(updatedLevels);
  };

  const handleExposureLevelScoreChange = (idx, newScore) => {
    const updatedLevels = [...exposureLevels];
    updatedLevels[idx] = { ...updatedLevels[idx], score: Number(newScore) };
    setExposureLevels(updatedLevels);
  };

  const handleSlaLevelScoreChange = (idx, newScore) => {
    const updatedLevels = [...slaLevels];
    updatedLevels[idx] = { ...updatedLevels[idx], score: Number(newScore) };
    setSlaLevels(updatedLevels);
  };

  // Calculate total weight
  const totalWeight = useMemo(() => {
    let total = 0;
    if (cvssEnabled) total += Number(cvssWeight) || 0;
    if (exposureEnabled) total += Number(exposureWeight) || 0;
    if (slaEnabled) total += Number(slaWeight) || 0;
    if (epssEnabled) total += Number(epssWeight) || 0;
    if (kevEnabled) total += Number(kevWeight) || 0;
    if (assetTypeEnabled) total += Number(assetTypeWeight) || 0;
    if (buRiskEnabled) total += Number(buRiskWeight) || 0;
    return total;
  }, [cvssEnabled, cvssWeight, exposureEnabled, exposureWeight, slaEnabled, slaWeight, epssEnabled, epssWeight, kevEnabled, kevWeight, assetTypeEnabled, assetTypeWeight, buRiskEnabled, buRiskWeight]);

  return (
    <div className="space-y-4">
      {/* Total Weight Display */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">Total Weight Allocated</span>

          </div>

          <div className='flex items-center gap-2'>
            {totalWeight !== 100 && (
              <Button
                variant="outline"
                size="sm"
                appearance="warning"
                onClick={handleRebalance}
              >
                <RefreshCcw size={12} />
                Rebalance to 100%
              </Button>
            )}
            <span
              className={cn(
                'text-lg font-bold',
                totalWeight === 100 ? 'text-green-500' : 'text-orange-500',
              )}
            >
              {totalWeight}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500',
                totalWeight === 100 ? 'bg-green-500' : 'bg-orange-500',
              )}
              style={{ width: `${Math.min(totalWeight, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            <span>0%</span>
            {totalWeight < 100 && (
              <span className="text-orange-500">
                {100 - totalWeight}% remaining
              </span>
            )}
            {totalWeight > 100 && (
              <span className="text-destructive">
                {totalWeight - 100}% over-allocated
              </span>
            )}
            {totalWeight === 100 && (
              <span className="text-green-500">Fully allocated</span>
            )}
            <span>100%</span>
          </div>
        </div>
      </div>

      <Accordion
        type="multiple"
        variant="outline"
        className="space-y-3"
      >
        {/* CVSS Scoring System */}
        <AccordionItem value="cvss">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="hover:no-underline flex-1">
              <div className="flex items-center gap-3 flex-1">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">CVSS Scoring System</span>
                <span className="text-sm text-muted-foreground">
                  (Weight: {cvssWeight}%)
                </span>
              </div>
            </AccordionTrigger>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <div className="flex items-center gap-3 mr-2">
                <Checkbox
                  checked={cvssEnabled}
                  onCheckedChange={setCvssEnabled}
                />
                <span className="text-sm text-primary">Enabled</span>
              </div>
            </AuthorityGuard>
          </div>
          <AccordionContent>
            <div className="space-y-6 pt-2 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Common Vulnerability Scoring System (CVSS) provides a way to capture the principal characteristics of a vulnerability and produce a numerical score reflecting its severity.
              </p>

              <div className="grid gap-4 max-w-sm">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Allocated Weight
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      disabled={user?.role === 'Auditor'}
                      type="number"
                      value={cvssWeight}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 0 && v <= 100) {
                          setCvssWeight(v);
                          setLastChanged('cvss');
                        }
                      }}
                      min={0}
                      max={100}
                      className="h-8 w-16 text-center text-sm tabular-nums"
                    />
                    <span className="text-muted-foreground text-xs">%</span>
                  </div>
                </div>
                <Slider
                  disabled={user?.role === 'Auditor'}
                  value={[cvssWeight]}
                  onValueChange={(val) => {
                    setCvssWeight(val[0]);
                    setLastChanged('cvss');
                  }}
                  max={100}
                  step={1}
                  className="py-4"
                  rangeClassName="bg-muted-foreground/70"
                >
                  <SliderThumb className="relative border-muted-foreground/70">
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-background border border-border shadow-md rounded px-2 py-1 text-[11px] font-bold text-foreground pointer-events-none whitespace-nowrap">
                      {cvssWeight}%
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background border-b border-r border-border rotate-45" />
                    </div>
                  </SliderThumb>
                </Slider>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Exposure Prioritization */}
        <AccordionItem value="exposure">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="hover:no-underline flex-1">
              <div className="flex items-center gap-3 flex-1">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">Exposure Prioritization</span>
                <span className="text-sm text-muted-foreground">
                  (Weight: {exposureWeight}%)
                </span>
              </div>
            </AccordionTrigger>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <div className="flex items-center gap-3 mr-2">
                <Checkbox
                  checked={exposureEnabled}
                  onCheckedChange={setExposureEnabled}
                />
                <span className="text-sm text-primary">Enabled</span>
              </div>
            </AuthorityGuard>
          </div>
          <AccordionContent>
            <div className="space-y-6 pt-2 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prioritize risks based on their exposure to the internet or internal networks.
              </p>

              <div className="grid gap-4 max-w-sm">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Allocated Weight
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      disabled={user?.role === 'Auditor'}
                      type="number"
                      value={exposureWeight}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 0 && v <= 100) {
                          setExposureWeight(v);
                          setLastChanged('exposure');
                        }
                      }}
                      min={0}
                      max={100}
                      className="h-8 w-16 text-center text-sm tabular-nums"
                    />
                    <span className="text-muted-foreground text-xs">%</span>
                  </div>
                </div>
                <Slider
                  disabled={user?.role === 'Auditor'}
                  value={[exposureWeight]}
                  onValueChange={(val) => {
                    setExposureWeight(val[0]);
                    setLastChanged('exposure');
                  }}
                  max={100}
                  step={1}
                  className="py-4"
                  rangeClassName="bg-muted-foreground/70"
                >
                  <SliderThumb className="relative border-muted-foreground/70">
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-background border border-border shadow-md rounded px-2 py-1 text-[11px] font-bold text-foreground pointer-events-none whitespace-nowrap">
                      {exposureWeight}%
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background border-b border-r border-border rotate-45" />
                    </div>
                  </SliderThumb>
                </Slider>
              </div>

              {/* Risk Levels Display */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                  Exposure Risk Scores (0-10)
                </Label>

                <div className="space-y-1">
                  {exposureLevels.map((level, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between gap-8 py-3 px-2 rounded-lg transition-colors hover:bg-muted/30"
                    >
                      <div className="flex-1 min-w-[140px]">
                        <Label className="text-sm font-semibold text-foreground/90">
                          {level.label}
                        </Label>
                      </div>

                      <div className="flex-[3] px-2">
                        <Slider
                          disabled={user?.role === 'Auditor'}
                          value={[level.score]}
                          onValueChange={(val) => handleExposureLevelScoreChange(idx, val[0])}
                          max={10}
                          step={1}
                          className="py-2"
                          rangeClassName="bg-muted-foreground/70"
                        >
                          <SliderThumb className="relative border-muted-foreground/70">
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-background border border-border shadow-md rounded px-2 py-1 text-[11px] font-bold text-foreground pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                              {level.score}
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background border-b border-r border-border rotate-45" />
                            </div>
                          </SliderThumb>
                        </Slider>
                      </div>

                      <div className="flex items-center justify-end min-w-[60px]">
                        <Input
                          disabled={user?.role === 'Auditor'}
                          type="number"
                          value={level.score}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (v >= 0 && v <= 10) handleExposureLevelScoreChange(idx, v);
                          }}
                          min={0}
                          max={10}
                          className="h-8 w-14 text-center text-sm font-medium tabular-nums border-muted-foreground/20 focus:border-primary/50"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SLA Prioritization */}
        <AccordionItem value="sla">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="hover:no-underline flex-1">
              <div className="flex items-center gap-3 flex-1">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">SLA Prioritization</span>
                <span className="text-sm text-muted-foreground">
                  (Weight: {slaWeight}%)
                </span>
              </div>
            </AccordionTrigger>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <div className="flex items-center gap-3 mr-2">
                <Checkbox
                  checked={slaEnabled}
                  onCheckedChange={setSlaEnabled}
                />
                <span className="text-sm text-primary">Enabled</span>
              </div>
            </AuthorityGuard>
          </div>
          <AccordionContent>
            <div className="space-y-6 pt-2 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prioritize risks based on SLA compliance status and breach proximity.
              </p>

              <div className="grid gap-4 max-w-sm">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Allocated Weight
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      disabled={user?.role === 'Auditor'}
                      type="number"
                      value={slaWeight}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 0 && v <= 100) {
                          setSlaWeight(v);
                          setLastChanged('sla');
                        }
                      }}
                      min={0}
                      max={100}
                      className="h-8 w-16 text-center text-sm tabular-nums"
                    />
                    <span className="text-muted-foreground text-xs">%</span>
                  </div>
                </div>
                <Slider
                  disabled={user?.role === 'Auditor'}
                  value={[slaWeight]}
                  onValueChange={(val) => {
                    setSlaWeight(val[0]);
                    setLastChanged('sla');
                  }}
                  max={100}
                  step={1}
                  className="py-4"
                  rangeClassName="bg-muted-foreground/70"
                >
                  <SliderThumb className="relative border-muted-foreground/70">
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-background border border-border shadow-md rounded px-2 py-1 text-[11px] font-bold text-foreground pointer-events-none whitespace-nowrap">
                      {slaWeight}%
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background border-b border-r border-border rotate-45" />
                    </div>
                  </SliderThumb>
                </Slider>
              </div>

              {/* Risk Levels Display */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                  SLA Risk Scores (0-10)
                </Label>

                <div className="space-y-1">
                  {slaLevels.map((level, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between gap-8 py-3 px-2 rounded-lg transition-colors hover:bg-muted/30"
                    >
                      <div className="flex-1 min-w-[140px]">
                        <Label className="text-sm font-semibold text-foreground/90">
                          {level.label}
                        </Label>
                      </div>

                      <div className="flex-[3] px-2">
                        <Slider
                          disabled={user?.role === 'Auditor'}
                          value={[level.score]}
                          onValueChange={(val) => handleSlaLevelScoreChange(idx, val[0])}
                          max={10}
                          step={1}
                          className="py-2"
                          rangeClassName="bg-muted-foreground/70"
                        >
                          <SliderThumb className="relative border-muted-foreground/70">
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-background border border-border shadow-md rounded px-2 py-1 text-[11px] font-bold text-foreground pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                              {level.score}
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background border-b border-r border-border rotate-45" />
                            </div>
                          </SliderThumb>
                        </Slider>
                      </div>

                      <div className="flex items-center justify-end min-w-[60px]">
                        <Input
                          disabled={user?.role === 'Auditor'}
                          type="number"
                          value={level.score}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (v >= 0 && v <= 10) handleSlaLevelScoreChange(idx, v);
                          }}
                          min={0}
                          max={10}
                          className="h-8 w-14 text-center text-sm font-medium tabular-nums border-muted-foreground/20 focus:border-primary/50"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* EPSS Scoring System */}
        <AccordionItem value="epss">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="hover:no-underline flex-1">
              <div className="flex items-center gap-3 flex-1">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">EPSS Scoring System</span>
                <span className="text-sm text-muted-foreground">
                  (Weight: {epssWeight}%)
                </span>
              </div>
            </AccordionTrigger>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <div className="flex items-center gap-3 mr-2">
                <Checkbox
                  checked={epssEnabled}
                  onCheckedChange={setEpssEnabled}
                />
                <span className="text-sm text-primary">Enabled</span>
              </div>
            </AuthorityGuard>
          </div>
          <AccordionContent>
            <div className="space-y-6 pt-2 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Exploit Prediction Scoring System (EPSS) estimates the
                probability that a vulnerability will be exploited in the wild.
              </p>

              <div className="grid gap-4 max-w-sm">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Allocated Weight
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      disabled={user?.role === 'Auditor'}
                      type="number"
                      value={epssWeight}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 0 && v <= 100) {
                          setEpssWeight(v);
                          setLastChanged('epss');
                        }
                      }}
                      min={0}
                      max={100}
                      className="h-8 w-16 text-center text-sm tabular-nums"
                    />
                    <span className="text-muted-foreground text-xs">%</span>
                  </div>
                </div>
                <Slider
                  disabled={user?.role === 'Auditor'}
                  value={[epssWeight]}
                  onValueChange={(val) => {
                    setEpssWeight(val[0]);
                    setLastChanged('epss');
                  }}
                  max={100}
                  step={1}
                  className="py-4"
                  rangeClassName="bg-muted-foreground/70"
                >
                  <SliderThumb className="relative border-muted-foreground/70">
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-background border border-border shadow-md rounded px-2 py-1 text-[11px] font-bold text-foreground pointer-events-none whitespace-nowrap">
                      {epssWeight}%
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background border-b border-r border-border rotate-45" />
                    </div>
                  </SliderThumb>
                </Slider>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Known Exploited Vulnerabilities (KEV) */}
        <AccordionItem value="kev">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="hover:no-underline flex-1">
              <div className="flex items-center gap-3 flex-1">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">
                  Known Exploited Vulnerabilities (KEV)
                </span>
                <span className="text-sm text-muted-foreground">
                  (Weight: {kevWeight}%)
                </span>
              </div>
            </AccordionTrigger>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <div className="flex items-center gap-3 mr-2">
                <Checkbox
                  checked={kevEnabled}
                  onCheckedChange={setKevEnabled}
                />
                <span className="text-sm text-primary">Enabled</span>
              </div>
            </AuthorityGuard>
          </div>
          <AccordionContent>
            <div className="space-y-6 pt-2 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                CISA's KEV catalog identifies vulnerabilities actively exploited
                in the wild.
              </p>

              <div className="grid gap-4 max-w-sm">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Allocated Weight
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      disabled={user?.role === 'Auditor'}
                      type="number"
                      value={kevWeight}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 0 && v <= 100) {
                          setKevWeight(v);
                          setLastChanged('kev');
                        }
                      }}
                      min={0}
                      max={100}
                      className="h-8 w-16 text-center text-sm tabular-nums"
                    />
                    <span className="text-muted-foreground text-xs">%</span>
                  </div>
                </div>
                <Slider
                  disabled={user?.role === 'Auditor'}
                  value={[kevWeight]}
                  onValueChange={(val) => {
                    setKevWeight(val[0]);
                    setLastChanged('kev');
                  }}
                  max={100}
                  step={1}
                  className="py-4"
                  rangeClassName="bg-muted-foreground/70"
                >
                  <SliderThumb className="relative border-muted-foreground/70">
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-background border border-border shadow-md rounded px-2 py-1 text-[11px] font-bold text-foreground pointer-events-none whitespace-nowrap">
                      {kevWeight}%
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background border-b border-r border-border rotate-45" />
                    </div>
                  </SliderThumb>
                </Slider>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Asset Type Prioritization */}
        <AccordionItem value="assetType">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="hover:no-underline flex-1">
              <div className="flex items-center gap-3 flex-1">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">Asset Type Prioritization</span>
                <span className="text-sm text-muted-foreground">
                  (Weight: {assetTypeWeight}%)
                </span>
              </div>
            </AccordionTrigger>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <div className="flex items-center gap-3 mr-2">
                <Checkbox
                  checked={assetTypeEnabled}
                  onCheckedChange={setAssetTypeEnabled}
                />
                <span className="text-sm text-primary">Enabled</span>
              </div>
            </AuthorityGuard>
          </div>
          <AccordionContent>
            <div className="space-y-6 pt-2 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prioritize risks based on the criticality of the affected asset
                type (e.g., Databases vs Development servers).
              </p>

              <div className="grid gap-4 max-w-sm">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Allocated Weight
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      disabled={user?.role === 'Auditor'}
                      type="number"
                      value={assetTypeWeight}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 0 && v <= 100) {
                          setAssetTypeWeight(v);
                          setLastChanged('assetType');
                        }
                      }}
                      min={0}
                      max={100}
                      className="h-8 w-16 text-center text-sm tabular-nums"
                    />
                    <span className="text-muted-foreground text-xs">%</span>
                  </div>
                </div>
                <Slider
                  disabled={user?.role === 'Auditor'}
                  value={[assetTypeWeight]}
                  onValueChange={(val) => {
                    setAssetTypeWeight(val[0]);
                    setLastChanged('assetType');
                  }}
                  max={100}
                  step={1}
                  className="py-4"
                  rangeClassName="bg-muted-foreground/70"
                >
                  <SliderThumb className="relative border-muted-foreground/70">
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-background border border-border shadow-md rounded px-2 py-1 text-[11px] font-bold text-foreground pointer-events-none whitespace-nowrap">
                      {assetTypeWeight}%
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background border-b border-r border-border rotate-45" />
                    </div>
                  </SliderThumb>
                </Slider>
              </div>

              {/* Risk Levels Display */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                  Asset Risk Scores (0-10)
                </Label>

                <div className="space-y-1">
                  {assetTypeLevels.map((level, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between gap-8 py-3 px-2 rounded-lg transition-colors hover:bg-muted/30"
                    >
                      <div className="flex-1 min-w-[140px]">
                        <Label className="text-sm font-semibold text-foreground/90">
                          {ASSET_TYPE_MAP[level.label] || level.label}
                        </Label>
                      </div>

                      <div className="flex-[3] px-2">
                        <Slider
                          disabled={user?.role === 'Auditor'}
                          value={[level.score]}
                          onValueChange={(val) => handleLevelScoreChange(idx, val[0])}
                          max={10}
                          step={1}
                          className="py-2"
                          rangeClassName="bg-muted-foreground/70"
                        >
                          <SliderThumb className="relative border-muted-foreground/70">
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-background border border-border shadow-md rounded px-2 py-1 text-[11px] font-bold text-foreground pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                              {level.score}
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background border-b border-r border-border rotate-45" />
                            </div>
                          </SliderThumb>
                        </Slider>
                      </div>

                      <div className="flex items-center justify-end min-w-[60px]">
                        <Input
                          disabled={user?.role === 'Auditor'}
                          type="number"
                          value={level.score}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (v >= 0 && v <= 10) handleLevelScoreChange(idx, v);
                          }}
                          min={0}
                          max={10}
                          className="h-8 w-14 text-center text-sm font-medium tabular-nums border-muted-foreground/20 focus:border-primary/50"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Business Unit Risk */}
        <AccordionItem value="buRisk">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="hover:no-underline flex-1">
              <div className="flex items-center gap-3 flex-1">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">Business Unit Risk</span>
                <span className="text-sm text-muted-foreground">
                  (Weight: {buRiskWeight}%)
                </span>
              </div>
            </AccordionTrigger>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <div className="flex items-center gap-3 mr-2">
                <Checkbox
                  checked={buRiskEnabled}
                  onCheckedChange={setBuRiskEnabled}
                />
                <span className="text-sm text-primary">Enabled</span>
              </div>
            </AuthorityGuard>
          </div>
          <AccordionContent>
            <div className="space-y-6 pt-2 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prioritize risks based on the business unit's criticality and its
                impact on overall operations.
              </p>

              <div className="grid gap-4 max-w-sm">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Allocated Weight
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      disabled={user?.role === 'Auditor'}
                      type="number"
                      value={buRiskWeight}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 0 && v <= 100) {
                          setBuRiskWeight(v);
                          setLastChanged('buRisk');
                        }
                      }}
                      min={0}
                      max={100}
                      className="h-8 w-16 text-center text-sm tabular-nums"
                    />
                    <span className="text-muted-foreground text-xs">%</span>
                  </div>
                </div>
                <Slider
                  disabled={user?.role === 'Auditor'}
                  value={[buRiskWeight]}
                  onValueChange={(val) => {
                    setBuRiskWeight(val[0]);
                    setLastChanged('buRisk');
                  }}
                  max={100}
                  step={1}
                  className="py-4"
                  rangeClassName="bg-muted-foreground/70"
                >
                  <SliderThumb className="relative border-muted-foreground/70">
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-background border border-border shadow-md rounded px-2 py-1 text-[11px] font-bold text-foreground pointer-events-none whitespace-nowrap">
                      {buRiskWeight}%
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background border-b border-r border-border rotate-45" />
                    </div>
                  </SliderThumb>
                </Slider>
              </div>

              {/* Risk Levels Display */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                  Business Unit Risk Scores (0-10)
                </Label>

                <div className="space-y-1">
                  {buRiskLevels.map((level, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between gap-8 py-3 px-2 rounded-lg transition-colors hover:bg-muted/30"
                    >
                      <div className="flex-1 min-w-[140px]">
                        <Label className="text-sm font-semibold text-foreground/90">
                          {level.label}
                        </Label>
                      </div>

                      <div className="flex-[3] px-2">
                        <Slider
                          disabled={user?.role === 'Auditor'}
                          value={[level.score]}
                          onValueChange={(val) => handleBuRiskLevelScoreChange(idx, val[0])}
                          max={10}
                          step={1}
                          className="py-2"
                          rangeClassName="bg-muted-foreground/70"
                        >
                          <SliderThumb className="relative border-muted-foreground/70">
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-background border border-border shadow-md rounded px-2 py-1 text-[11px] font-bold text-foreground pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                              {level.score}
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background border-b border-r border-border rotate-45" />
                            </div>
                          </SliderThumb>
                        </Slider>
                      </div>

                      <div className="flex items-center justify-end min-w-[60px]">
                        <Input
                          disabled={user?.role === 'Auditor'}
                          type="number"
                          value={level.score}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (v >= 0 && v <= 10) handleBuRiskLevelScoreChange(idx, v);
                          }}
                          min={0}
                          max={10}
                          className="h-8 w-14 text-center text-sm font-medium tabular-nums border-muted-foreground/20 focus:border-primary/50"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
});

export default RiskScoring;

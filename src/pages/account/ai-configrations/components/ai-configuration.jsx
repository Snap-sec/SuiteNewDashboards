import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Check, Eye, EyeOff } from 'lucide-react';
import appConfig from '@/config/appConfig';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { Skeleton } from '@/components/ui/skeleton';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

const AIConfigurationSkeleton = () => {
  return (
    <Card className="min-w-full">
      <CardHeader>
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </CardHeader>

      <CardContent className="space-y-8 py-6">
        <Skeleton className="h-20 w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="border-2 border-border rounded-xl p-5 space-y-4"
              >
                <div className="flex items-start gap-4">
                  <Skeleton className="size-12 rounded-lg" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PROVIDERS = [
  {
    id: 'anthropic',
    label: 'Anthropic Claude',
    domain: 'anthropic.com',
    isCloud: true,
    description: 'Advanced reasoning and safety-focused models',
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    domain: 'deepseek.com',
    isCloud: true,
    description: 'Highly efficient open-source model',
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    domain: 'gemini.google.com/',
    logoUrl: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
    isCloud: true,
    description: 'Advanced reasoning and large context window',
  },
  {
    id: 'ollama',
    label: 'Ollama',
    domain: 'ollama.com',
    isCloud: false,
    description: 'Run powerful models locally',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    domain: 'openai.com',
    isCloud: true,
    description: 'Most powerful and versatile model',
  },
];

const MODELS_BY_PROVIDER = {
  anthropic: [
    { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20240620' },
    { label: 'Claude 3 Opus', value: 'claude-3-opus-20240229' },
    { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet-20240229' },
    { label: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307' },
  ],
  deepseek: [
    { label: 'DeepSeek Chat', value: 'deepseek-chat' },
    { label: 'DeepSeek Coder', value: 'deepseek-coder' },
  ],
  openai: [
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'GPT-4o mini', value: 'gpt-4o-mini' },
    { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
  ],
  ollama: [
    { label: 'Llama 3', value: 'llama3' },
    { label: 'Mistral', value: 'mistral' },
    { label: 'Phi-3', value: 'phi3' },
    { label: 'Neural Chat', value: 'neural-chat' },
  ],
  gemini: [
    { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
    { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
    { label: 'Gemini 1.0 Pro', value: 'gemini-1.0-pro' },
  ],
};

const AIConfiguration = ({
  aiConfigData = {},
  aiConfig = {},
  isLoading,
  setAiConfig,
  handleSaveCompanyDetails,
  isError,
  error,
}) => {
  const { user } = useAuth();
  const isMember = user?.role?.toLowerCase() === 'member';
  const isAuditor = user?.role === 'Auditor';
  const [showApiKey, setShowApiKey] = useState(false);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (aiConfigData && !isInitialized.current) {
      setAiConfig({
        enabled: aiConfigData?.enabled || false,
        provider: aiConfigData?.provider || '',
        model: aiConfigData?.model || '',
        api_key: aiConfigData?.api_key || '',
        api_base_url: aiConfigData?.api_base_url || '',
      });
      isInitialized.current = true;
    }
  }, [aiConfigData]);

  const handleChange = (key, value, shouldSave = false) => {
    setAiConfig((prev) => ({ ...prev, [key]: value }));
    if (shouldSave && handleSaveCompanyDetails) {
      handleSaveCompanyDetails({ ai_configuration: { [key]: value } });
    }
  };

  const getChangedFields = () => {
    const changedFields = {};
    const keys = ['enabled', 'provider', 'model', 'api_key', 'api_base_url'];

    keys.forEach(key => {
      const current = aiConfig[key];
      const original = aiConfigData?.[key] ?? (key === 'enabled' ? false : '');

      if (current !== original) {
        changedFields[key] = current;
      }
    });
    return changedFields;
  };

  const changedFields = getChangedFields();
  const hasChanges = Object.keys(changedFields).some(key => key !== 'enabled');

  const handleProviderSelect = (providerId) => {
    if (isMember) return;
    setAiConfig((prev) => ({
      ...prev,
      provider: providerId,
      model: '', // Reset model when provider changes
    }));
  };

  const handleModelSelect = (modelValue) => {
    if (isMember) return;
    setAiConfig((prev) => ({
      ...prev,
      model: modelValue,
    }));
  };

  const selectedProvider = PROVIDERS.find((p) => p.id === aiConfig?.provider);
  const availableModels = aiConfig?.provider
    ? MODELS_BY_PROVIDER[aiConfig.provider]
    : [];

  if (isLoading) {
    return <AIConfigurationSkeleton />;
  }

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <Card className="min-w-full">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <CardTitle>AI Configuration</CardTitle>
          <span className="text-secondary-foreground text-sm">
            Manage your AI model providers and credentials
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 py-6">
        <div className="flex items-center justify-between gap-3 bg-muted/50 p-4 rounded-lg border border-border">
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {aiConfig?.enabled
                ? 'AI Features Active'
                : 'AI Features Disabled'}
            </span>
            <span className="text-xs text-muted-foreground">
              {aiConfig?.enabled
                ? 'This will allow users to send data to AI models that is enabled in your settings'
                : 'This will disable all AI features'}
            </span>
          </div>

          <Switch
            checked={!!aiConfig?.enabled}
            onCheckedChange={(checked) =>
              handleChange('enabled', checked, true)
            }
            disabled={isMember || isAuditor}
          />
        </div>

        {/* Model Selection Cards */}
        <div className="space-y-4">
          <div className="text-sm font-medium">AI Provider</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROVIDERS.filter(
              (opt) => !isAuditor || aiConfig?.provider === opt.id,
            ).map((opt) => {
              const isSelected = aiConfig?.provider === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleProviderSelect(opt.id)}
                  className={cn(
                    'relative group border-2 rounded-xl p-5 transition-all duration-200',
                    !isMember && !isAuditor && 'cursor-pointer hover:shadow-md',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-background hover:border-primary/50',
                  )}
                >
                  {isSelected && !isAuditor && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'flex items-center justify-center size-12 rounded-lg bg-white border border-border shadow-sm overflow-hidden p-2',
                        isSelected &&
                        'border-primary/50 ring-1 ring-primary/20',
                      )}
                    >
                      <img
                        src={opt.logoUrl || appConfig.getLogoUrl(opt.domain)}
                        alt={`${opt.label} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden size-full items-center justify-center font-bold text-muted-foreground">
                        {opt.label[0]}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="font-semibold text-foreground">
                        {opt.label}
                      </div>
                      <div className="text-xs text-secondary-foreground mt-1 line-clamp-2">
                        {opt.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Model Selection - Only visible if a provider is selected */}
        {aiConfig?.provider && (
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="text-sm font-medium">AI Model</div>
            <div className="flex flex-wrap gap-2">
              {availableModels
                .filter((m) => !isAuditor || aiConfig.model === m.value)
                .map((m) => (
                  <Button
                    key={m.value}
                    variant={aiConfig.model === m.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModelSelect(m.value)}
                    disabled={isMember || isAuditor}
                    className="rounded-full px-4"
                  >
                    {aiConfig.model === m.value && (
                      <Check size={14} className="mr-2" />
                    )}
                    {m.label}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {/* API Key Section - Only visible if a model is selected and not an auditor */}
        <AuthorityGuard forbidRoles={['Auditor']}>
          {aiConfig?.model && (
            <div className="space-y-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-sm font-medium">API Credentials</div>
                  <span className="text-xs text-secondary-foreground">
                    Provide the connection details for {selectedProvider?.label}
                  </span>
                </div>
                {!isMember && (
                  <Button
                    size="sm"
                    onClick={() =>
                      handleSaveCompanyDetails({ ai_configuration: changedFields })
                    }
                    disabled={!hasChanges}
                    className="gap-2"
                  >
                    <Check size={14} />
                    Save Credentials
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {/* API Key Field */}
                <div className="space-y-2">
                  <Label htmlFor="api_key" className="text-xs">
                    API Key
                  </Label>
                  <div className="relative">
                    <Input
                      id="api_key"
                      type={showApiKey ? 'text' : 'password'}
                      value={aiConfig?.api_key || ''}
                      onChange={(e) => handleChange('api_key', e.target.value)}
                      disabled={isMember}
                      placeholder={
                        selectedProvider?.isCloud
                          ? 'Enter your API key here...'
                          : 'API Key (optional for local)'
                      }
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      type="button"
                    >
                      {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                  </div>
                </div>

                {/* API Base URL Field - Only for non-cloud (Ollama) */}
                {!selectedProvider?.isCloud && (
                  <div className="space-y-2">
                    <Label htmlFor="api_base_url" className="text-xs">
                      API Base URL
                    </Label>
                    <Input
                      id="api_base_url"
                      type="text"
                      value={aiConfig?.api_base_url || ''}
                      onChange={(e) =>
                        handleChange('api_base_url', e.target.value)
                      }
                      disabled={isMember}
                      placeholder="http://localhost:11434"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </AuthorityGuard>
      </CardContent>
    </Card>
  );
};

export { AIConfiguration };

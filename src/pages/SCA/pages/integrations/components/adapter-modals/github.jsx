import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiLockPasswordFill } from '@remixicon/react';
import { GitBranch, Tag, ChevronRight, ChevronLeft, CheckCircle2, Loader2, User, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useStore } from '../../store';
import { useIntegration } from '../../context/integration-context';
import { useGetScaGitHubAccountsMutation } from '@/services/sca/integrationsApi';
import { githubSchema } from '../../schemas';

export function GithubModal() {
  const { showInstallModal, setShowInstallModal, showConfigModal, setShowConfigModal } = useStore();
  const { handleSaveConfig, isConfiguring } = useIntegration();
  const [fetchAccounts, { isLoading: isVerifying }] = useGetScaGitHubAccountsMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [accounts, setAccounts] = useState([]);
  const [authUser, setAuthUser] = useState(null);

  const form = useForm({
    resolver: zodResolver(githubSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      organization: 'all',
      token: '',
    },
  });

  useEffect(() => {
    const installType = showInstallModal?.type?.toLowerCase();
    const configId = showConfigModal?.id?.toLowerCase();
    const configType = showConfigModal?.type?.toLowerCase();
    const configTitle = showConfigModal?.title?.toLowerCase();

    const isGithubInstall = installType === 'github' || installType === 'github-sca';
    const isGithubConfig =
      configId === 'github-sca' ||
      configType === 'github' ||
      (configTitle && configTitle.includes('github'));

    if (isGithubInstall) {
      setIsOpen(true);
      setStep(1);
      setAccounts([]);
      setAuthUser(null);
      form.reset({
        name: '',
        organization: 'all',
        token: '',
      });
    } else if (isGithubConfig && showConfigModal) {
      setIsOpen(true);
      setStep(1);
      setAccounts([]);
      setAuthUser(null);
      form.reset({
        name: showConfigModal.name || showConfigModal.config?.name || '',
        organization: showConfigModal.config?.organization || showConfigModal.config?.org || 'all',
        token: showConfigModal.config?.token || showConfigModal.config?.patToken || showConfigModal.config?.accessToken || '',
      });
    } else {
      setIsOpen(false);
    }
  }, [showInstallModal, showConfigModal, form]);

  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    setShowConfigModal(null);
    setStep(1);
    setAccounts([]);
    setAuthUser(null);
    form.reset();
  };

  const handleVerifyToken = async () => {
    const tokenVal = form.getValues('token')?.trim();
    if (!tokenVal) {
      toast.error('Please enter a Personal Access Token (PAT).');
      return;
    }

    try {
      const res = await fetchAccounts({ token: tokenVal }).unwrap();
      const data = res?.data || res;
      if (data?.accounts && data.accounts.length > 0) {
        setAccounts(data.accounts);
        setAuthUser(data.user);

        // Default to 'all' or user's currently selected org if valid
        const currentOrg = form.getValues('organization');
        const matched = data.accounts.find((a) => a.login === currentOrg);
        const selectedLogin = matched ? matched.login : 'all';

        form.setValue('organization', selectedLogin);
        const autoName = selectedLogin === 'all' ? 'GitHub (All Accounts)' : selectedLogin;
        form.setValue('name', autoName);

        setStep(2);
      } else {
        toast.error('No accessible accounts or organizations found for this token.');
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.data?.error || err?.message || 'Failed to verify token with GitHub.');
    }
  };

  const handleSave = async (data) => {
    const adapterId = showConfigModal?.id || 'github-sca';
    const fallbackName = data.organization === 'all' ? 'GitHub (All Accounts)' : data.organization;
    const finalName = data.name?.trim() || fallbackName;

    const success = await handleSaveConfig(adapterId, {
      name: finalName,
      organization: data.organization,
      token: data.token,
      patToken: data.token,
      accessToken: data.token,
    });

    if (success) {
      handleClose();
    }
  };

  const tokenVal = form.watch('token') || '';

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="GitHub Repository Scanner"
      description={
        step === 1
          ? "Step 1 of 2: Connect your GitHub Personal Access Token"
          : "Step 2 of 2: Select GitHub organization or account"
      }
      footer={
        step === 1 ? (
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleVerifyToken}
              disabled={isVerifying || !tokenVal.trim()}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" /> Verifying Token...
                </>
              ) : (
                <>
                  Next: Select Account <ChevronRight className="size-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              disabled={isConfiguring}
            >
              <ChevronLeft className="size-4 mr-1" /> Back
            </Button>
            <Button
              onClick={form.handleSubmit(handleSave)}
              disabled={form.formState.isSubmitting || isConfiguring}
            >
              {isConfiguring ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  <GitBranch className="size-4 mr-2" /> Integrate
                </>
              )}
            </Button>
          </div>
        )
      }
      className="max-h-[95vh] overflow-y-auto w-fit"
    >
      <Form {...form}>
        <div style={{ display: 'none' }} aria-hidden="true">
          <input type="text" name="prevent_autofill_user" tabIndex={-1} autoComplete="off" />
          <input type="password" name="prevent_autofill_pwd" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="flex flex-col gap-4 min-w-[340px] sm:min-w-[420px]">
          {step === 1 ? (
            /* STEP 1: Personal Access Token Input */
            <>
              <div className="p-3 rounded-lg border border-border/50 bg-secondary/20 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ShieldCheck className="size-4 text-primary" />
                  <span>Secure GitHub Authentication</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Provide a Personal Access Token with <code className="text-primary font-mono font-medium">repo</code> scope.
                  SnapSec will automatically inspect and display your accessible personal accounts and organizations in the next step.
                </p>
              </div>

              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Personal Access Token (PAT) <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputWrapper className={form.formState.errors.token ? 'border-destructive' : ''}>
                        <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                          <RiLockPasswordFill className="size-4" />
                        </Button>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          data-1p-ignore="true"
                          data-lpignore="true"
                          data-form-type="other"
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleVerifyToken();
                            }
                          }}
                        />
                      </InputWrapper>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            /* STEP 2: Account Selection & Auto-assigned Name */
            <>
              {/* Authenticated user profile banner */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-secondary/20">
                <div className="flex items-center gap-2.5">
                  {authUser?.avatarUrl ? (
                    <img
                      src={authUser.avatarUrl}
                      alt=""
                      className="size-8 rounded-full border border-border object-cover"
                      onError={(e) => { e.currentTarget.src = '/new-adapter-logos/github.svg'; }}
                    />
                  ) : (
                    <User className="size-8 p-1.5 rounded-full bg-secondary text-foreground" />
                  )}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground">
                        {authUser?.name || authUser?.login}
                      </span>
                      <Badge variant="success" appearance="outline" className="text-[10px] py-0 px-1.5 h-4 flex items-center gap-1">
                        <CheckCircle2 className="size-2.5 text-success" /> Verified
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">@{authUser?.login}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setStep(1)}
                >
                  Change Token
                </Button>
              </div>

              {/* Account Dropdown */}
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      GitHub Organization / Account <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        const nameToSet = val === 'all' ? 'GitHub (All Accounts)' : val;
                        form.setValue('name', nameToSet);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select account or organization..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]">
                        {accounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.login}>
                            <div className="flex items-center gap-2.5 py-0.5">
                              <img
                                src={acc.avatarUrl}
                                alt=""
                                className="size-5 rounded-full object-cover shrink-0"
                                onError={(e) => { e.currentTarget.src = '/new-adapter-logos/github.svg'; }}
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{acc.name}</span>
                                <Badge
                                  variant={acc.type === 'All' ? 'info' : acc.type === 'Organization' ? 'secondary' : 'outline'}
                                  className="text-[10px] py-0 h-4"
                                >
                                  {acc.type}
                                </Badge>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Integration Name Input (Auto-populated, editable) */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>
                        Integration Name
                      </FormLabel>
                      <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                        Editable
                      </Badge>
                    </div>
                    <FormControl>
                      <InputWrapper className={form.formState.errors.name ? 'border-destructive' : ''}>
                        <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                          <Tag className="size-4" />
                        </Button>
                        <Input
                          placeholder="e.g. My GitHub Account"
                          {...field}
                        />
                      </InputWrapper>
                    </FormControl>
                    <p className="text-[11px] text-muted-foreground">
                      Auto-populated based on your selected account. You can freely change or customize this name.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </Form>
    </Modal>
  );
}

export default GithubModal;


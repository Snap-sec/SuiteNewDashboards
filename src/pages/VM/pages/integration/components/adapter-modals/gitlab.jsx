import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RiGitlabFill } from '@remixicon/react';
import { GitBranch, Globe, Key, Tag, FolderGit2, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { useInstallVmAdapterMutation } from '@/services/vm/adaptersApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { useStore } from '../../store';
import Select from '@/components/custom/select';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { gitlabSchema } from '../../schemas';
import AssessmentSelect from '../assessment-select';

// Project scope options for GitLab
const projectScopeOptions = [
  { value: 'membership', label: 'My Projects (Member of)' },
  { value: 'owned', label: 'Owned Projects Only' },
  { value: 'public', label: 'Public Projects (Explore)' },
  { value: 'internal', label: 'Internal Projects' },
  { value: 'starred', label: 'Starred Projects' },
  { value: 'all', label: 'All Accessible Projects' },
];

function Gitlab() {
  const { showInstallModal, setShowInstallModal } = useStore();
  const [search, setSearch] = useState('');

  // Get all assessments with search
  const { data: assessments, isLoading, isFetching } = useGetVmAssessmentsQuery({ search });

  const assessmentOptions = assessments?.data?.assessments?.map?.(assessment => ({
    value: assessment._id,
    label: assessment.name || assessment.title,
    id: assessment._id,
  })) || [];

  const form = useForm({
    resolver: zodResolver(gitlabSchema),
    mode: "onChange",
    defaultValues: {
      name: '',
      accessToken: '',
      gitlabUrl: '',
      projectIds: '',
      issueLabels: '',
      fetchNotes: false,
      projectScope: 'membership',
      assessmentId: '',
      adapterName: 'gitlab',
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const [installGitlab] = useInstallVmAdapterMutation();

  useEffect(() => {
    let { type } = showInstallModal;

    if (type == 'gitlab') {
      setIsOpen(true);
      form.reset({
        name: '',
        accessToken: '',
        gitlabUrl: '',
        projectIds: '',
        issueLabels: '',
        fetchNotes: false,
        projectScope: 'membership',
        assessmentId: '',
        adapterName: 'gitlab',
      });
    }
    else setIsOpen(false);
  }, [showInstallModal, form]);



  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    form.reset();
  };

  const handleInstall = (data) => {
    // Build the final payload, only include optional fields if they have values
    const finalPayload = {
      adapterName: 'gitlab',
      name: data.name,
      accessToken: data.accessToken,
      assessmentId: data.assessmentId,
      projectScope: data.projectScope || 'membership',
    };

    // Add optional fields only if they have values
    if (data.gitlabUrl?.trim()) {
      finalPayload.gitlabUrl = data.gitlabUrl.trim();
    }
    if (data.projectIds?.trim()) {
      finalPayload.projectIds = data.projectIds.trim();
    }
    if (data.issueLabels?.trim()) {
      finalPayload.issueLabels = data.issueLabels.trim();
    }
    if (data.fetchNotes) {
      finalPayload.fetchNotes = true;
    }

    toast.promise(installGitlab(finalPayload).unwrap(), {
      loading: 'Installing GitLab Integration...',
      success: () => {
        handleClose();
        return 'GitLab Integration has been installed';
      },
      error: 'Failed to install GitLab Integration',
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="Integrate GitLab"
      className="max-h-[95vh] overflow-y-auto w-fit"
      description="Import security issues and vulnerabilities from GitLab projects"
      footer={
        <Button 
          variant="outline" 
          onClick={form.handleSubmit(handleInstall)} 
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          <GitBranch /> Integrate
        </Button>
      }
    >
      <Form {...form}>
        <div className="flex flex-col gap-4">
          {/* Required Fields */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Integration Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.name ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <RiGitlabFill />
                    </Button>
                    <Input placeholder="Enter integration name" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accessToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Access Token <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.accessToken ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Key />
                    </Button>
                    <Input type="password" placeholder="Enter access token" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assessmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Assessment <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <AssessmentSelect
                    value={field.value}
                    onChange={(option) => field.onChange(option.value)}
                    error={!!form.formState.errors.assessmentId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Optional Fields */}
          <div className="pt-2 border-t">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Optional Settings</Label>
          </div>

          <FormField
            control={form.control}
            name="projectScope"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Scope</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    options={projectScopeOptions}
                    placeholder="Select scope"
                    onChange={(option) => field.onChange(option.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gitlabUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitLab URL</FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.gitlabUrl ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Globe />
                    </Button>
                    <Input placeholder="e.g., https://gitlab.com" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project IDs</FormLabel>
                <FormControl>
                  <InputWrapper>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <FolderGit2 />
                    </Button>
                    <Input placeholder="Comma separated IDs" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issueLabels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Labels Filter</FormLabel>
                <FormControl>
                  <InputWrapper>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Tag />
                    </Button>
                    <Input placeholder="Comma separated labels" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fetchNotes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Fetch issue comments
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Enable to retrieve comments and notes from GitLab issues.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </Modal>
  );
}

export default Gitlab;

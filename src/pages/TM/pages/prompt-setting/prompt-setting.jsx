import { useCallback, useEffect, useState } from 'react';
import { RefreshCcw, RefreshCcwDotIcon, Save, Paintbrush } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { ContentLoader } from '../../../../components/common/content-loader';
import { Editor } from '../../../../components/custom/Editor/Editor';
import { Skeleton } from '../../../../components/ui/skeleton';
import {
  useFlushThreatsMutation,
  useGetProjectByIdQuery,
  useRefreshThreatsMutation,
  useResetPromptMutation,
  useUpdateProjectMutation,
} from '../../../../services/tm/projectApi';

const DefaultData = ` #  Project Overview Template

Please fill out the following sections to help us understand your app better.

---

## 1. App/Project Name
> _What is the name of the app/project?_

---

## 2. Purpose
> _Briefly describe what the app does and why it exists (1-3 sentences)._

---

## 3. Key Features
> _List the main features of the app._
- Feature 1:
- Feature 2:
- Feature 3:

---

## 4. User Roles
> _List the different types of users who will use the app and their responsibilities._

### Example:
- **Admin**: Manages users and settings  
- **Customer**: Can browse and place orders  
- **Support Agent**: Handles customer queries  

---

## 5. Role-Based Restrictions
> _Mention any limitations or access restrictions per role._

### Example:
- Customers **cannot** delete other users  
- Support Agents **cannot** access admin settings  
- Only Admins can manage user roles  

---

## 6. Technical Information
> _Provide details about the technical stack of the project._

- **Database User**: 
- **Database Type**: 
- **Languages**: 
- **Frameworks**: 
- **Cloud Provider**:

---

## 7. Additional Notes (Optional)
> _Any other information you'd like to share._

    `;

function PromptSetting() {
  const { projectId } = useParams();
  const [updateProject] = useUpdateProjectMutation();
  const [promptEditorValue, setPromptEditorValue] = useState('');
  const [overviewEditorValue, setOverviewEditorValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [usingCustomPrompt, setUsingCustomPrompt] = useState(false);

  const { data, isLoading } = useGetProjectByIdQuery(projectId);
  const [flushThreats, { isLoading: isFlushing }] = useFlushThreatsMutation();
  const [refreshThreats, { isLoading: isRefreshing }] =
    useRefreshThreatsMutation();
  const [resetPrompt, { isLoading: isResetting }] = useResetPromptMutation();

  useEffect(() => {
    setPromptEditorValue(data?.prompt);
    setOverviewEditorValue(data?.about || DefaultData);
    setUsingCustomPrompt(data?.useCustomPrompt);
  }, [data]);

  const handlePromptEditorChange = useCallback((markdown) => {
    setPromptEditorValue(markdown);
  }, []);

  const handleOverviewEditorChange = (value) => {
    setOverviewEditorValue(value);
    // Check if content has changed from the original
    if (value !== data?.about) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  };

  if (isLoading) {
    return (
      // <ContentLoader />
      <div className=" flex flex-col space-y-3">
        <Skeleton className=" w-full h-[500px] rounded-lg" />
        <Skeleton className=" w-full h-[300px] rounded-lg" />
      </div>
    );
  }

  const handleFlush = async () => {
    try {
      const result = await flushThreats(projectId).unwrap();
      toast.success('Threats flushed successfully.');
    } catch (error) {
      toast.error('Failed to flush threats.');
    }
  };

  const handleRefresh = async () => {
    try {
      const result = await refreshThreats(projectId).unwrap();
      toast.success('Threats refreshed successfully.');
    } catch (error) {
      toast.error('Failed to refresh threats.');
    }
  };

  // const handleReset = async () => {
  //     toast.promise(resetPrompt(projectId).unwrap(), {
  //         loading: "Resetting prompt",
  //         success: "Prompt Reset",
  //         error: "Failed to reset prompt"
  //     });
  // };

  const switchPromptUsage = (useCustom) => {
    toast.promise(
      updateProject({
        projectId,
        payload: { useCustomPrompt: useCustom },
      }).unwrap(),
      {
        loading: 'Switching Prompt usage',
        success: () =>
          useCustom ? 'Switched to Custom Prompt' : 'Switched to Default Prompt',
        error: 'Failed to switch prompt usage',
      },
    );
  };

  const handlePromptUpdate = async () => {
    if (!promptEditorValue.includes('{request}', '{about}')) {
      toast.error(
        "Prompt must include '{request}' and '{about}' somewhere in the text.",
      );
      return;
    }
    setIsUpdating(true);
    try {
      await updateProject({
        projectId,
        payload: { prompt: promptEditorValue },
      }).unwrap();
      toast.success('Prompt updated successfully.');
    } catch (error) {
      toast.error('Failed to update prompt.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOverviewSave = async () => {
    if (!hasUnsavedChanges) {
      toast.info('No changes to save.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProject({
        projectId,
        payload: { about: overviewEditorValue },
      }).unwrap();

      toast.success('Project details saved successfully!');
      setHasUnsavedChanges(false);
    } catch (err) {
      toast.error('Failed to save project details.');
      console.log('Save failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>Prompt Setting</span>
            <CustomTooltip
              text={
                usingCustomPrompt
                  ? 'Using Custom Prompt'
                  : 'Using Default Prompt'
              }
            >
              <Switch
                shape="square"
                checked={usingCustomPrompt}
                onClick={(e) => {
                  setUsingCustomPrompt((prev) => !prev);
                  switchPromptUsage(!usingCustomPrompt);
                }}
              />
            </CustomTooltip>
          </CardTitle>

          <div className="flex gap-2 items-center">
            <ButtonWithConfirm
              variant="outline"
              confirm={true}
              onConfirm={handleFlush}
              confirmButton={<Button variant="primary">Proceed</Button>}
              cancelButton={<Button variant="outline">Cancel</Button>}
            >
              <Paintbrush /> {isFlushing ? 'Flushing...' : 'Flush Threats'}
            </ButtonWithConfirm>

            <ButtonWithConfirm
              variant="outline"
              confirm={true}
              onConfirm={handleRefresh}
              confirmButton={<Button variant="primary">Proceed</Button>}
              cancelButton={<Button variant="outline">Cancel</Button>}
            >
              <RefreshCcw />{' '}
              {isRefreshing ? 'Refreshing...' : 'Re-fetch Threats'}
            </ButtonWithConfirm>
          </div>
        </CardHeader>
        <CardContent>
          <Editor
            onChange={handlePromptEditorChange}
            defaultValue={promptEditorValue}
            readOnly={!usingCustomPrompt}
          />

          <div className="flex justify-end mt-4">
            {usingCustomPrompt && (
              <Button
                variant="primary"
                onClick={handlePromptUpdate}
                disabled={isUpdating}
              >
                <Save /> {isUpdating ? 'Updating...' : 'Update'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Editor
            defaultValue={overviewEditorValue}
            onChange={handleOverviewEditorChange}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="mono"
            onClick={handleOverviewSave}
            disabled={isSaving || !hasUnsavedChanges}
          >
            <Save />
            {isSaving
              ? 'Saving...'
              : hasUnsavedChanges
                ? 'Save Changes'
                : 'Saved'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PromptSetting;

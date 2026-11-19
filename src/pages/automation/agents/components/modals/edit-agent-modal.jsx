import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bot, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import { CustomTooltip } from '@/components/custom/tooltip';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateAgentMutation } from '@/services/automation/agentsApi';
import { editAgentSchema } from '../schemas/agent-schema';

export default function EditAgentModal({
  row,
  agent: propAgent,
  trigger,
  open: controlledOpen,
  setOpen: controlledSetOpen,
  onAgentUpdated,
  className = 'sm:max-w-lg',
}) {
  const agent = row?.original || propAgent || {};
  const agentId = agent?._id || agent?.id;
  const isPredefined = Boolean(row?.original?.agent_type || agent?.agent_type);

  const [updateAgent, { isLoading: isUpdating }] = useUpdateAgentMutation();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isModalOpen = isControlled ? controlledOpen : internalOpen;
  const setIsModalOpen = isControlled ? controlledSetOpen : setInternalOpen;

  const form = useForm({
    resolver: zodResolver(editAgentSchema),
    mode: 'onChange',
    defaultValues: {
      name: agent?.name || '',
      description: agent?.description || '',
    },
  });

  const handleClose = () => {
    setIsModalOpen(false);
    form.reset({
      name: agent?.name || '',
      description: agent?.description || '',
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      form.reset({
        name: agent?.name || '',
        description: agent?.description || '',
      });
    }
  }, [isModalOpen, agent, form]);

  const onSubmit = async (values) => {
    if (isPredefined) {
      toast.error('System agents cannot be edited');
      return;
    }

    if (!agentId) {
      toast.error('Agent ID is missing');
      return;
    }

    try {
      const payload = {
        agentId,
        name: values.name.trim(),
        description: (values.description || '').trim(),
        ...(agent?.model ? { model: agent.model } : {}),
        ...(agent?.prompt ? { prompt: agent.prompt } : {}),
        ...(agent?.temperature !== undefined ? { temperature: agent.temperature } : {}),
        ...(agent?.maxSteps !== undefined ? { maxSteps: agent.maxSteps } : {}),
        ...(Array.isArray(agent?.skills)
          ? {
              skills: agent.skills
                .map((s) => (typeof s === 'string' ? s : s?.name || s?.id))
                .filter(Boolean),
            }
          : {}),
      };

      const result = await updateAgent(payload).unwrap();
      const updatedAgent = result?.data || result || payload;
      onAgentUpdated?.(updatedAgent);
      toast.success('Agent updated successfully');
      handleClose();
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to update agent');
    }
  };

  // If predefined, keep the trigger disabled with a tooltip
  if (isPredefined) {
    const disabledTrigger = React.isValidElement(trigger) ? (
      React.cloneElement(trigger, {
        disabled: true,
        'aria-disabled': true,
        onClick: (e) => {
          e?.preventDefault?.();
          e?.stopPropagation?.();
        },
        className: cn(
          trigger.props.className,
          'cursor-not-allowed opacity-50 pointer-events-none'
        ),
      })
    ) : (
      <Button variant="outline" size="sm" disabled className="gap-2 cursor-not-allowed opacity-50">
        <Pencil className="w-3.5 h-3.5" /> Edit
      </Button>
    );

    return (
      <CustomTooltip text="System Agents cannot be edited">
        <div className="w-full cursor-not-allowed">
          {disabledTrigger}
        </div>
      </CustomTooltip>
    );
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
      <Pencil className="w-3.5 h-3.5" /> Edit
    </Button>
  );

  return (
    <Modal
      open={isModalOpen}
      setOpen={(open) => {
        setIsModalOpen(open);
        if (!open) handleClose();
      }}
      title="Edit Agent"
      description="Update your automation agent's name and description."
      trigger={trigger || defaultTrigger}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="edit-agent-form"
            disabled={isUpdating || !form.formState.isValid || form.formState.isSubmitting}
          >
            <Bot className="w-4 h-4 mr-1.5" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      }
      className={className}
    >
      <Form {...form}>
        <form
          id="edit-agent-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Agent Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium">
                  Agent Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Vulnerability Triage Agent"
                    className="h-9 text-xs"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium">Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Describe what this agent does..."
                    className="text-xs resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
}

EditAgentModal.propTypes = {
  row: PropTypes.object,
  agent: PropTypes.object,
  trigger: PropTypes.node,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  onAgentUpdated: PropTypes.func,
  className: PropTypes.string,
};


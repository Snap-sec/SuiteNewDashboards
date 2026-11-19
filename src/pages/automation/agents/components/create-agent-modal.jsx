import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Bot, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateAgentMutation } from '@/services/automation/agentsApi';
import { createAgentSchema } from './schemas/agent-schema';

export default function CreateAgentModal({ onAgentCreated }) {
  const [createAgent, { isLoading: isCreating }] = useCreateAgentMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(createAgentSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleClose = () => {
    setIsModalOpen(false);
    form.reset();
  };

  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name.trim(),
        description: (values.description || '').trim(),
      };

      const result = await createAgent(payload).unwrap();
      const createdAgent = result?.data || result || payload;
      onAgentCreated?.(createdAgent);
      toast.success('Agent created successfully');
      handleClose();
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to create agent');
    }
  };

  return (
    <Modal
      open={isModalOpen}
      setOpen={(open) => {
        setIsModalOpen(open);
        if (!open) form.reset();
      }}
      title="Create Agent"
      description="Configure your automation agent with a name and description."
      trigger={
        <Button className="gap-2 text-xs h-9 shrink-0">
          <Plus className="w-4 h-4" /> Create Agent
        </Button>
      }
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="create-agent-form"
            disabled={isCreating || !form.formState.isValid || form.formState.isSubmitting}
          >
            <Bot className="w-4 h-4 mr-1.5" />
            {isCreating ? 'Creating...' : 'Create Agent'}
          </Button>
        </div>
      }
      className="sm:max-w-lg"
    >
      <Form {...form}>
        <form
          id="create-agent-form"
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

CreateAgentModal.propTypes = {
  onAgentCreated: PropTypes.func,
};


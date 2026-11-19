import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Copy } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const editCredentialsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

const StepEditCredentials = forwardRef(function StepEditCredentials(
  { onValidData, defaultValues },
  ref
) {
  const form = useForm({
    resolver: zodResolver(editCredentialsSchema),
    defaultValues: {
      name: defaultValues?.name || '',
    },
  });

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.handleSubmit((data) => {
        onValidData(data);
      })();
    },
    isSubmitting: form.formState.isSubmitting,
  }));

  const webhookUrl = defaultValues?.webhookUrl || '';

  const handleCopy = () => {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <InputWrapper>
                  <User className="size-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="e.g. My Jira Instance"
                    {...field}
                  />
                </InputWrapper>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Webhook URL
          </Label>
          <span className="text-xs text-muted-foreground">
            Configure your Jira instance to push results to this endpoint.
          </span>
          <div className="flex relative items-center">
            <Input
              readOnly
              value={webhookUrl}
              className="font-mono text-xs pr-24 h-10 truncate bg-background border-border/50"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="absolute right-1 h-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={handleCopy}
            >
              <Copy className="mr-1.5 size-3.5" /> Copy
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
});

export default StepEditCredentials;

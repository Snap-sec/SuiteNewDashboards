import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Key, User, Tag } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { credentialsSchema } from './StepCredentials-schema';

const StepCredentials = forwardRef(function StepCredentials({ onValidData, defaultValues }, ref) {
  const form = useForm({
    resolver: zodResolver(credentialsSchema),
    defaultValues: defaultValues || {
      name: '',
      email: '',
      apiToken: '',
      domain: '',
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

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
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

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <InputWrapper>
                  <User className="size-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    {...field}
                  />
                </InputWrapper>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Token</FormLabel>
              <FormControl>
                <InputWrapper>
                  <Key className="size-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter your Jira API token"
                    {...field}
                  />
                </InputWrapper>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <InputWrapper>
                  <Globe className="size-4 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://yourcompany.atlassian.net"
                    {...field}
                  />
                </InputWrapper>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
});

export default StepCredentials;

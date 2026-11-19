import React, { useEffect, useState } from 'react';
import { ArrowLeft, Edit, Save, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateVsSuppressionRuleMutation,
  useGetVsSuppressionRulePropertiesQuery,
  useUpdateVsSuppressionRuleMutation
} from '@/services/vs/vsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinners';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useStore from '../store';
import { suppressionRuleSchema } from './schemas/suppression-rule-schema';

const mapApiRuleToUiRule = (apiRule) => {
  return {
    name: apiRule.name || '',
    description: apiRule.description || '',
    conditions: {
      type: 'group',
      operator: apiRule.match?.operator || 'AND',
      children: (apiRule.match?.conditions || []).map((c) => ({
        type: 'condition',
        key: c.field,
        operator: c.operator || '==',
        value: c.value,
        transformer: c.transformer || null,
      })),
    },
  };
};

const GuidedRuleEditor = () => {
  const setSelectedRule = useStore((state) => state.setSelectedRule);
  const selectedRule = useStore((state) => state.selectedRule);
  const isEditingRule = useStore((state) => state.mode) === 'update';

  const navigate = useNavigate();
  const { data: schemaResponse, isLoading: isSchemaLoading } = useGetVsSuppressionRulePropertiesQuery();
  const schema = schemaResponse || { keys: [], operators: [] };

  const [createRule, { isLoading: isCreatingRule }] = useCreateVsSuppressionRuleMutation();
  const [updateSuppressionRule, { isLoading: isUpdatingRule }] = useUpdateVsSuppressionRuleMutation();

  const form = useForm({
    resolver: zodResolver(suppressionRuleSchema),
    mode: "onChange",
    defaultValues: {
      name: '',
      description: '',
      conditions: {
        type: 'group',
        operator: 'AND',
        children: [
          {
            type: 'condition',
            key: 'severity',
            operator: '==',
            value: 'high',
          },
        ],
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "conditions.children"
  });

  useEffect(() => {
    if (!isEditingRule || !selectedRule || isSchemaLoading) return;
    form.reset(mapApiRuleToUiRule(selectedRule));
  }, [isEditingRule, selectedRule, isSchemaLoading, form]);

  const generateYAMLPreview = () => {
    const values = form.getValues();
    let str = `name: '${values.name}'\n`;
    str += `description: '${values.description}'\n`;
    str += `match:\n  conditions:\n`;
    (values.conditions?.children || []).forEach(c => {
      str += `    - field: ${c.key}\n      operator: '${c.operator}'\n      value: ${c.value}\n`;
      if (c.transformer) str += `      transformer: ${c.transformer}\n`;
    });
    return str;
  }

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      description: values.description,
      match: {
        conditions: values.conditions.children.map((c) => ({
          field: c.key,
          operator: c.operator,
          value: c.value,
          transformer: c.transformer || undefined
        }))
      }
    };

    if (isEditingRule) {
      toast.promise(updateSuppressionRule({ id: selectedRule?._id, ...payload }).unwrap().then(() => {
        setSelectedRule(null);
        useStore.setState({ mode: 'create' });
        navigate('/vs/suppression-rules');
      }), {
        loading: 'Updating Rule...',
        success: 'Rule Updated successfully',
        error: 'Failed to Update rule',
      });
    } else {
      toast.promise(createRule(payload).unwrap().then(() => {
        setSelectedRule(null);
        useStore.setState({ mode: 'create' });
        navigate('/vs/suppression-rules');
      }), {
        loading: 'Saving Rule...',
        success: 'Rule saved successfully',
        error: 'Failed to save rule',
      });
    }
  };

  if (isSchemaLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-muted-foreground">
        <Spinner className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!schema?.keys) {
    return <div className="p-10 text-red-500">Failed to load rule schema properties.</div>;
  }

  const watchAllFields = form.watch(); // Keep preview updated

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-[calc(100vh-64px)] flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setSelectedRule(null);
                  useStore.setState({ mode: 'create' });
                  navigate(-1);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Suppression Rule Editor</h1>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-gray-900/5">
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rule Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="E.g. Suppress Info Level SQLi"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Optional description of when to suppress."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 w-full justify-between">
                  <CardTitle>Matching Conditions</CardTitle>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline" 
                    onClick={() => append({ type: 'condition', key: schema?.keys?.[0]?.value || 'severity', operator: '==', value: '', transformer: null })}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Condition
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, idx) => {
                  const currentKey = form.watch(`conditions.children.${idx}.key`);
                  const fieldSchema = schema.keys.find((f) => f.value === currentKey);
                  
                  return (
                    <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg group">
                      <div className="w-1/3 min-w-[200px]">
                        <FormField
                          control={form.control}
                          name={`conditions.children.${idx}.key`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={(val) => {
                                  field.onChange(val);
                                  form.setValue(`conditions.children.${idx}.value`, '');
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {schema.keys.map((f) => (
                                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="w-[120px]">
                        <FormField
                          control={form.control}
                          name={`conditions.children.${idx}.operator`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="text-center font-mono text-xs"><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {(schema?.operators || ['==']).map((op) => (
                                    <SelectItem key={op} value={op}>{op}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`conditions.children.${idx}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                {fieldSchema?.type === 'enum' ? (
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                      {fieldSchema.options.map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input
                                    {...field}
                                    type={fieldSchema?.type === 'number' ? 'number' : 'text'}
                                    placeholder="Value"
                                  />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(idx)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="flex w-full justify-end pb-8">
              <Button type="submit" disabled={isCreatingRule || isUpdatingRule || !form.formState.isValid}>
                {isEditingRule ? <Edit className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {isEditingRule ? "Update Rule" : isCreatingRule || isUpdatingRule ? 'Saving...' : 'Save Rule'}
              </Button>
            </div>
          </div>

          {/* Right Panel - Structure Preview */}
          <div className="w-[350px] border-l flex flex-col bg-muted/30">
            <div className="px-4 py-3 border-b flex justify-between items-center bg-background backdrop-blur">
              <h2 className="font-semibold text-sm tracking-wide">
                Rule Structure Preview
              </h2>
            </div>
            <Textarea
              className="flex-1 p-4 text-xs font-mono leading-relaxed resize-none outline-none border-none bg-transparent"
              value={generateYAMLPreview()}
              readOnly
              spellCheck="false"
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default GuidedRuleEditor;

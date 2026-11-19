import { useCallback, useEffect, useState } from 'react';
import { SquarePen, Check, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { debounce, formatDate } from '@/lib/helpers';
import { useSetVmDefaultAsigneeMutation } from '@/services/vm/assessmentsApi';
import { useGetDepartmentsQuery } from '@/services/auth/departmentsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import DatePicker from '@/components/custom/date-picker';
import CustomSelect from '@/components/custom/select';
import SelectDepartments from '../../../../../components/common/multiple-departments-selector';
import SingleBusinessUnitSelector from '../../../../../components/common/single-business-unit-selector';
import SingleVendorSelector from '../../../../../components/common/single-vendor-selector';
import SingleVulnSourceSelector from '../../../../../components/common/single-vuln-source-selector';
import { Badge } from '../../../../../components/ui/badge';
import OverRideModel from './override-model';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editAssessmentSchema } from "./schemas/edit-assessment-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';

const CATEGORIES = [
  'SAST (Static Application Security Testing)',
  'DAST (Dynamic Application Security Testing)',
  'Penetration Testing',
  'SCA (Software Composition Analysis)',
  'IAST (Interactive Application Security Testing)',
  'Secret Scanning',
  'Cloud Security Posture Management (CSPM) Scans',
  'Container Security Scanning',
  'Infrastructure Vulnerability Scanning',
  'API Security Testing',
  'Red Team Exercises',
  'Configuration Audits (CIS Benchmarking)',
  'Attack Surface Management (ASM) Findings',
  'Zero-Day & Threat Intelligence Reporting',
  'Third-Party & Supply Chain Security Assessments',
  'Code Review for Security Issues',
  'Wi-Fi Security Audits',
  'Mobile Application Security Testing',
];

const BasicEdit = ({
  assessment = {},
  onUpdate,
  isUpdatingAssignment,
  onUpdateScope,
  membersSearch,
}) => {
  const [editView, setEditView] = useState(null);
  const [params] = useSearchParams();
  const assessmentId = params.get('assessmentId');
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

  // Fetch departments here so they display initially on the page without needing to click edit
  const { data: departmentsData } = useGetDepartmentsQuery();
  const departmentOptions = departmentsData?.data || [];

  const [setDefaultAsignee, { isLoading: isSettingAssignee }] =
    useSetVmDefaultAsigneeMutation();

  // Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(editAssessmentSchema),
    mode: "onChange",
    defaultValues: {
      title: assessment.title || "",
      date: assessment.date || null,
      startDate: assessment.startDate || null,
      endDate: assessment.endDate || null,
      category: assessment.category || "",
      scopeString: assessment.scopeString || "",
      defaultTicketOwner: assessment.defaultTicketOwner || null,
      departmentId: assessment.departmentId || [],
      businessUnitIds: assessment.businessUnitIds || [],
      vendorId: assessment.vendorId || (assessment.vendor?._id || assessment.vendor?.id) || "",
      vulnSource: assessment.vulnSource || (assessment.vulnSource?._id || assessment.vulnSource?.id) || "",
    },
  });

  // Keep form values in sync with assessment prop
  useEffect(() => {
    if (assessment) {
      form.reset({
        title: assessment.title || "",
        date: assessment.date || null,
        startDate: assessment.startDate || null,
        endDate: assessment.endDate || null,
        category: assessment.category || "",
        scopeString: assessment.scopeString || "",
        defaultTicketOwner: assessment.defaultTicketOwner || null,
        departmentId: assessment.departmentId || [],
        businessUnitIds: assessment.businessUnitIds || [],
        vendorId: assessment.vendorId || (assessment.vendor?._id || assessment.vendor?.id) || "",
        vulnSource: assessment.vulnSource || (assessment.vulnSource?._id || assessment.vulnSource?.id) || "",
      });
    }
  }, [assessment, form]);

  const handleSaveField = (field) => {
    const values = form.getValues();

    if (field === 'scopeString') {
      onUpdate({ scopeString: values.scopeString });
    } else if (field === 'defaultTicketOwner') {
      setIsOverrideModalOpen(true);
    } else if (field === 'departmentId') {
      const newDprtmentIds = (values.departmentId || [])
        .filter((d) => d && d.id && d.id !== 'none')
        .map((d) => d.id);
      onUpdate({ departmentId: newDprtmentIds });
    } else if (field === 'businessUnitIds') {
      // Business Units is handled differently in this component via it's own state in legacy, 
      // but let's adapt it to RHF values.
      onUpdate({ businessUnitIds: values.businessUnitIds });
    } else if (field === 'vendorId') {
      onUpdate({ vendorId: values.vendorId });
    } else if (field === 'vulnSource') {
      onUpdate({ vulnSource: values.vulnSource });
    } else if (field === 'date') {
      onUpdate({ date: values.date, startDate: values.date });
    } else {
      onUpdate({ [field]: values[field] });
    }

    setEditView(null);
  };

  const handleOverrideModalConfirm = (override) => {
    const user = form.getValues("defaultTicketOwner");
    const userId = user ? user._id : null;
    const name = user ? user.name : null;
    const email = user ? user.email : null;

    toast.promise(
      setDefaultAsignee({
        assessmentId,
        userId,
        name,
        email,
        override: override,
      }).unwrap(),
      {
        loading: 'Setting default assignee...',
        success: 'Default ticket assignee updated',
        error: 'Failed to set default assignee',
      },
    );
    setEditView(null);
  };

  const handleCancelEdit = () => {
    form.reset({
      title: assessment.title || "",
      date: assessment.date || null,
      startDate: assessment.startDate || null,
      endDate: assessment.endDate || null,
      category: assessment.category || "",
      scopeString: assessment.scopeString || "",
      defaultTicketOwner: assessment.defaultTicketOwner || null,
      departmentId: assessment.departmentId || [],
      businessUnitIds: assessment.businessUnitIds || [],
      vendorId: assessment.vendorId || (assessment.vendor?._id || assessment.vendor?.id) || "",
      vulnSource: assessment.vulnSource || (assessment.vulnSource?._id || assessment.vulnSource?.id) || "",
    });
    setEditView(null);
  };

  return (
    <>
      <OverRideModel
        isOpen={isOverrideModalOpen}
        setIsOpen={setIsOverrideModalOpen}
        onConfirm={handleOverrideModalConfirm}
      />
      <Card className="min-w-full">
        <CardHeader>
          <CardTitle>Assessment Info</CardTitle>
        </CardHeader>
        <CardContent className="kt-scrollable-x-auto pb-3 p-0">
          <Form {...form}>
            <Table className="align-middle text-sm text-muted-foreground">
              <TableBody>
                {/* Assessment Name */}
                <TableRow className="group">
                  <TableCell className="py-2 text-secondary-foreground min-w-50 font-normal">
                    Assessment Name
                  </TableCell>
                  <TableCell className="py-2 text-foreground font-normal min-w-10 text-sm">
                    {editView === 'title' ? (
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter Assessment Name"
                              />
                            </FormControl>
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    ) : (
                      assessment.title
                    )}
                  </TableCell>
                  <TableCell className="py-2 text-center">
                    {editView === 'title' ? (
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          mode="icon"
                          disabled={form.formState.isSubmitting}
                          onClick={async () => {
                            const isValid = await form.trigger('title');
                            if (isValid) handleSaveField('title');
                          }}
                        >
                          <Check size={16} className="text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <AuthorityGuard forbidRoles={["Auditor"]}>
                        <Button variant="ghost" mode="icon" onClick={() => setEditView('title')} className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      </AuthorityGuard>
                    )}
                  </TableCell>
                </TableRow>

                {/* Date */}
                <TableRow className="group">
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    Date
                  </TableCell>
                  <TableCell className="py-3 text-secondary-foreground text-sm font-normal">
                    {editView === 'date' ? (
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : form.getValues("date") ? (
                      formatDate(form.getValues("date"))
                    ) : assessment?.createdAt ? (
                      formatDate(assessment.createdAt)
                    ) : null}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    {editView === 'date' ? (
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={() => handleSaveField('date')}
                        >
                          <Check size={16} className="text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <AuthorityGuard forbidRoles={["Auditor"]}>
                        <Button variant="ghost" mode="icon" onClick={() => setEditView('date')} className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      </AuthorityGuard>
                    )}
                  </TableCell>
                </TableRow>

                {/* Category */}
                <TableRow className="group">
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    Category
                  </TableCell>
                  <TableCell className="py-3 text-secondary-foreground text-sm font-normal">
                    {editView === 'category' ? (
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <CustomSelect
                                options={CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
                                value={field.value}
                                onChange={(opt) => field.onChange(opt.value)}
                                placeholder="Select Category"
                                enableSearch={true}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      assessment?.category
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    {editView === 'category' ? (
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={() => handleSaveField('category')}
                        >
                          <Check size={16} className="text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <AuthorityGuard forbidRoles={["Auditor"]}>
                        <Button variant="ghost" mode="icon" onClick={() => setEditView('category')} className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      </AuthorityGuard>
                    )}
                  </TableCell>
                </TableRow>

                {/* Scope */}
                <TableRow className="group">
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    Scope
                  </TableCell>
                  <TableCell className="py-4 text-secondary-foreground text-sm font-normal">
                    {editView === 'scopeString' ? (
                      <FormField
                        control={form.control}
                        name="scopeString"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <textarea
                                className="w-full min-h-[80px] border rounded p-2 bg-transparent text-foreground"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="whitespace-pre-line">
                        {assessment.scopeString || 'No scope defined.'}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    {editView === 'scopeString' ? (
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={() => handleSaveField('scopeString')}
                        >
                          <Check size={16} className="text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <AuthorityGuard forbidRoles={["Auditor"]}>
                        <Button variant="ghost" mode="icon" onClick={() => setEditView('scopeString')} className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      </AuthorityGuard>
                    )}
                  </TableCell>
                </TableRow>

                {/* Default Ticket Assignee */}
                <TableRow className="group">
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    Default Ticket Assignee
                  </TableCell>
                  <TableCell className="py-4 text-secondary-foreground text-sm font-normal">
                    {editView === 'defaultTicketOwner' ? (
                      <FormField
                        control={form.control}
                        name="defaultTicketOwner"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <CustomSelect
                                placeholder="Select assignee"
                                options={[
                                  { label: 'None', value: 'none', user: null },
                                  ...(assessment?.collaborators?.map((m) => ({
                                    label: m.name || m.email,
                                    value: m.email,
                                    user: m,
                                  })) || [])
                                ]}
                                value={field.value?.email || 'none'}
                                onChange={(opt) => field.onChange(opt.user)}
                                onSearchChange={(e) => membersSearch?.(e)}
                                disabled={isSettingAssignee}
                                enableSearch={true}
                                searchPlaceholder="Search Assignee..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      form.getValues("defaultTicketOwner")?.name ||
                      form.getValues("defaultTicketOwner")?.email ||
                      'No assignee selected'
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    {editView === 'defaultTicketOwner' ? (
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={() => handleSaveField('defaultTicketOwner')}
                        >
                          <Check size={16} className="text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <AuthorityGuard forbidRoles={["Auditor"]}>
                        <Button variant="ghost" mode="icon" onClick={() => setEditView('defaultTicketOwner')} className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      </AuthorityGuard>
                    )}
                  </TableCell>
                </TableRow>

                {/* Departments */}
                <TableRow className="group">
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    Departments
                  </TableCell>
                  <TableCell className=" w-full py-4 text-secondary-foreground text-sm font-normal">
                    {editView === 'departmentId' ? (
                      <FormField
                        control={form.control}
                        name="departmentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SelectDepartments
                                selectedDepartments={field.value}
                                showLabel={false}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className=" space-x-1">
                        {(() => {
                          let rawItems = [];
                          if (Array.isArray(assessment?.department)) rawItems = [...assessment.department];
                          else if (assessment?.department) rawItems = [assessment.department];

                          if (Array.isArray(assessment?.departmentId)) rawItems = [...rawItems, ...assessment.departmentId];
                          else if (assessment?.departmentId) rawItems = [...rawItems, assessment.departmentId];

                          if (rawItems.length === 0) {
                            return <p>No Associated Department</p>;
                          }

                          const resolvedDepts = [];
                          const seenIds = new Set();

                          rawItems.forEach(item => {
                            if (!item) return;
                            const isObj = typeof item === 'object';
                            const id = isObj ? (item._id || item.id) : item;

                            if (!id || seenIds.has(id)) return;
                            seenIds.add(id);

                            const match = departmentOptions.find(d => d._id === id || d.id === id);
                            const name = match?.name || match?.label || (isObj && item.name ? item.name : 'Unknown Department');

                            resolvedDepts.push({ id, name });
                          });

                          if (resolvedDepts.length === 0) {
                            return <p>No Associated Department</p>;
                          }

                          return resolvedDepts.map((d) => (
                            <Badge key={d.id} variant="secondary">
                              {d.name}
                            </Badge>
                          ));
                        })()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    {editView === 'departmentId' ? (
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => handleSaveField('departmentId')}
                          variant="ghost"
                          mode="icon"
                          disabled={isUpdatingAssignment}
                        >
                          <Check size={16} className="text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <AuthorityGuard forbidRoles={["Auditor"]}>
                        <Button
                          onClick={() => setEditView('departmentId')}
                          variant="ghost"
                          mode="icon"
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        >
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      </AuthorityGuard>
                    )}
                  </TableCell>
                </TableRow>

                {/* Business unit */}
                <TableRow className="group">
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    Business unit
                  </TableCell>
                  <TableCell className=" w-full py-4 text-secondary-foreground text-sm font-normal">
                    {editView === 'businessUnitIds' ? (
                      <FormField
                        control={form.control}
                        name="businessUnitIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SingleBusinessUnitSelector
                                onChange={(e) => field.onChange(e ? (Array.isArray(e) ? e.map(i => i.id || i) : [e.id || e]) : [])}
                                showLabel={false}
                                value={field.value?.[0]}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      assessment.businessUnits?.[0]?.name ||
                      'No Associated Business Unit'
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    {editView === 'businessUnitIds' ? (
                      <div className="flex items-center gap-1">
                        <ButtonWithConfirm
                          variant="ghost"
                          mode="icon"
                          dialog={
                            <p className="text-sm">
                              Are you sure you want to update, It will change business
                              unit of all vulns in the assessment?
                            </p>
                          }
                          disabled={isUpdatingAssignment}
                          confirm={true}
                          confirmOnInput={assessment?.title || 'CONFIRM'}
                          confirmButton={<Button variant="primary">Proceed</Button>}
                          cancelButton={<Button variant="outline">Cancel</Button>}
                          onConfirm={() => handleSaveField('businessUnitIds')}
                        >
                          <Check size={16} className="text-blue-500" />
                        </ButtonWithConfirm>
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <AuthorityGuard forbidRoles={["Auditor"]}>
                        <Button variant="ghost" mode="icon" onClick={() => setEditView('businessUnitIds')} className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      </AuthorityGuard>
                    )}
                  </TableCell>
                </TableRow>
                {/* Vendor */}
                <TableRow className="group">
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    Vendor
                  </TableCell>
                  <TableCell className=" w-full py-4 text-secondary-foreground text-sm font-normal">
                    {editView === 'vendorId' ? (
                      <FormField
                        control={form.control}
                        name="vendorId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SingleVendorSelector
                                onChange={field.onChange}
                                showLabel={false}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        {assessment.vendorId?.logo_url || assessment.vendor?.logo_url && <img
                          src={assessment.vendorId?.logo_url || assessment.vendor?.logo_url || 'https://suite.snapsec.co/media/logos/snapsec.svg'}
                          alt={assessment.vendorId?.name || assessment.vendor?.name || ''}
                          className="size-6 object-contain"
                        />}
                        <span>{assessment.vendorId?.name || assessment.vendor?.name || 'No Vendor Assigned'}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    {editView === 'vendorId' ? (
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => handleSaveField('vendorId')}
                          variant="ghost"
                          mode="icon"
                        >
                          <Check size={16} className="text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <AuthorityGuard forbidRoles={["Auditor"]}>
                        <Button
                          onClick={() => setEditView('vendorId')}
                          variant="ghost"
                          mode="icon"
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        >
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      </AuthorityGuard>
                    )}
                  </TableCell>
                </TableRow>
                {/* Vulnerability Source */}
                <TableRow className="group">
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    Vulnerability Source
                  </TableCell>
                  <TableCell className=" w-full py-4 text-secondary-foreground text-sm font-normal">
                    {editView === 'vulnSource' ? (
                      <FormField
                        control={form.control}
                        name="vulnSource"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SingleVulnSourceSelector
                                onChange={field.onChange}
                                showLabel={false}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      assessment.vulnSource?.name ||
                      'No Associated Vulnerability Source'
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-secondary-foreground font-normal">
                    {editView === 'vulnSource' ? (
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => handleSaveField('vulnSource')}
                          variant="ghost"
                          mode="icon"
                        >
                          <Check size={16} className="text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          mode="icon"
                          onClick={handleCancelEdit}
                        >
                          <X size={16} className="text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <AuthorityGuard forbidRoles={["Auditor"]}>
                        <Button
                          onClick={() => setEditView('vulnSource')}
                          variant="ghost"
                          mode="icon"
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        >
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      </AuthorityGuard>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export { BasicEdit };

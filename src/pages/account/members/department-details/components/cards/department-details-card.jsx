import { useEffect, useState } from "react";
import { useAuth } from "@/auth/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, SquarePen, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUpdateDepartmentMutation } from "@/services/auth/departmentsApi";
import { useGetOrgMembersQuery } from "@/services/auth/orgApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Profile } from "@/components/custom/profile";
import Select from "@/components/custom/select";
import DeleteDepartment from "../actions/delete-department";
import { departmentSchema } from "./schemas/department-schema";
import AuthorityGuard from "@/components/custom/authority-guard/AuthorityGuard";


const DepartmentDetailsCard = ({ data, isLoading }) => {
  const { user } = useAuth();
  const isMember =
    user?.role?.toLowerCase() === 'member' ||
    user?.role?.toLowerCase() === 'developer';

  // --- Inline edit control ---
  const [editField, setEditField] = useState(null);

  // --- Fetch members from org API ---
  const [search, setSearch] = useState('');
  const {
    data: orgMembersData,
    isLoading: isMembersLoading,
    isFetching: isFetchingMembers,
  } = useGetOrgMembersQuery({ search });
  const [memberOptions, setMemberOptions] = useState([]);

  useEffect(() => {
    if (orgMembersData?.data?.members) {
      const formatted = orgMembersData.data.members.map((m) => ({
        id: m.userId,
        label: m.name || m.email,
        value: { id: m.userId, name: m.name, email: m.email },
      }));

      const options = [{ id: 'none', label: 'None', value: 'none' }];

      if (
        data?.departmentLead?.id &&
        !formatted.some((m) => m.id === data.departmentLead.id)
      ) {
        options.push({
          id: data.departmentLead.id,
          label: data.departmentLead.name || data.departmentLead.email,
          value: {
            id: data.departmentLead.id,
            name: data.departmentLead.name,
            email: data.departmentLead.email,
          },
        });
      }

      setMemberOptions([...options, ...formatted]);
    }
  }, [orgMembersData, data?.departmentLead]);

  // --- Form Initialization ---
  const form = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: data?.name || '',
      description: data?.description || '',
      departmentLead: data?.departmentLead || null,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || '',
        description: data.description || '',
        departmentLead: data.departmentLead || null,
      });
    }
  }, [data, form]);

  const name = form.watch('name') || '';
  const description = form.watch('description') || '';

  // --- Department update mutation ---
  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();

  const startEdit = (field) => {
    setEditField(field);
  };

  const cancelEdit = () => {
    setEditField(null);
    form.reset({
      name: data?.name || '',
      description: data?.description || '',
      departmentLead: data?.departmentLead || null,
    });
  };

  const handleSave = async () => {
    // Validate ONLY the field currently being edited, not the whole form.
    // This avoids Zod failing on other fields whose DB values may exceed schema limits.
    const isValid = await form.trigger(editField);
    if (!isValid) return;

    const values = form.getValues();
    let payload = {};

    if (editField === 'name') payload.name = values.name;
    if (editField === 'description') payload.description = values.description;
    if (editField === 'departmentLead')
      payload.departmentLead = values.departmentLead === 'none' ? null : values.departmentLead;

    toast.promise(
      updateDepartment({
        departmentId: data?._id,
        payload,
      }),
      {
        loading: 'Updating department...',
        success: 'Updated successfully!',
        error: 'Failed to update department',
      },
    );

    setEditField(null);
  };

  if (isLoading) {
    return (
      <Card className="min-w-full">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </CardHeader>
        <CardContent className="card-table pb-3 p-0">
          <Table className="align-middle text-sm">
            <TableBody>
              <TableRow>
                <TableCell className="py-6 min-w-32 text-secondary-foreground font-medium">
                  Department Name <span className="text-destructive">*</span>
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-5 w-48" />
                </TableCell>
                <TableCell className="text-center w-16">
                  <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="py-6 min-w-32 text-secondary-foreground font-medium">
                  Description <span className="text-destructive">*</span>
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-5 w-3/4" />
                </TableCell>
                <TableCell className="text-center w-16">
                  <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="py-6 min-w-32 text-secondary-foreground font-medium">
                  Department Lead
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center w-16">
                  <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>Department Details</CardTitle>
        {!isMember && (
          <AuthorityGuard forbidRoles={['Auditor']}>
            <DeleteDepartment departmentId={data?._id} />
          </AuthorityGuard>
        )}
      </CardHeader>
      <CardContent className="card-table pb-3 p-0">
        <Form {...form}>
          <Table className="align-middle text-sm">
            <TableBody>
              {/* ---------------------------
                   Department Name
              ---------------------------- */}
              <TableRow>
                <TableCell className="py-6 text-secondary-foreground">
                  Department Name <span className="text-destructive">*</span>
                </TableCell>

                <TableCell className="py-2">
                  {editField === 'name' ? (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col gap-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <span
                              className={cn(
                                'text-[10px] font-normal text-right',
                                name.length > 20
                                  ? 'text-destructive'
                                  : 'text-muted-foreground',
                              )}
                            >
                              {name.length}/20
                            </span>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  ) : (
                    data?.name
                  )}
                </TableCell>

                {!isMember && (
                  <AuthorityGuard forbidRoles={['Auditor']}>
                    <TableCell className="text-center">
                      {editField === 'name' ? (
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            onClick={handleSave}
                            disabled={isUpdating}
                          >
                            <Check size={16} className="text-green-600" />
                          </Button>
                          <Button variant="ghost" onClick={cancelEdit}>
                            <X size={16} className="text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" onClick={() => startEdit('name')}>
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      )}
                    </TableCell>
                  </AuthorityGuard>
                )}
              </TableRow>

              {/* ---------------------------
                   Description
              ---------------------------- */}
              <TableRow>
                <TableCell className="py-6 text-secondary-foreground">
                  Description <span className="text-destructive">*</span>
                </TableCell>

                <TableCell className="py-2">
                  {editField === 'description' ? (
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col gap-1">
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <span
                              className={cn(
                                'text-[10px] font-normal text-right',
                                description.length > 40
                                  ? 'text-destructive'
                                  : 'text-muted-foreground',
                              )}
                            >
                              {description.length}/40
                            </span>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  ) : (
                    data?.description || 'N/A'
                  )}
                </TableCell>

                {!isMember && (
                  <AuthorityGuard forbidRoles={['Auditor']}>
                    <TableCell className="text-center">
                      {editField === 'description' ? (
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            onClick={handleSave}
                            disabled={isUpdating}
                          >
                            <Check size={16} className="text-green-600" />
                          </Button>
                          <Button variant="ghost" onClick={cancelEdit}>
                            <X size={16} className="text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={() => startEdit('description')}
                        >
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      )}
                    </TableCell>
                  </AuthorityGuard>
                )}
              </TableRow>

              {/* ---------------------------
                   Department Lead
              ---------------------------- */}
              <TableRow>
                <TableCell className="py-6 min-w-32 text-secondary-foreground">
                  Department Lead
                </TableCell>

                <TableCell className="py-2">
                  {editField === 'departmentLead' ? (
                    <FormField
                      control={form.control}
                      name="departmentLead"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              placeholder="Select Department Lead"
                              options={memberOptions}
                              onChange={(option) =>
                                field.onChange(option.value)
                              }
                              onSearchChange={setSearch}
                              isSearching={isMembersLoading || isFetchingMembers}
                              value={field.value?.id || 'none'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : data?.departmentLead ? (
                    <Profile
                      email={data?.departmentLead?.email}
                      name={data?.departmentLead?.name}
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>

                {!isMember && (
                  <AuthorityGuard forbidRoles={['Auditor']}>
                    <TableCell className="text-center">
                      {editField === 'departmentLead' ? (
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            onClick={handleSave}
                            disabled={isUpdating}
                          >
                            <Check size={16} className="text-green-600" />
                          </Button>
                          <Button variant="ghost" onClick={cancelEdit}>
                            <X size={16} className="text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={() => startEdit('departmentLead')}
                        >
                          <SquarePen size={16} className="text-blue-500" />
                        </Button>
                      )}
                    </TableCell>
                  </AuthorityGuard>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </Form>
      </CardContent>
    </Card>
  );
};

export { DepartmentDetailsCard };
import React, { useState } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Select from '@/components/custom/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const roleTypeOptions = [
    { label: 'Default role', value: 'default' },
    { label: 'Remote role', value: 'remote' },
    { label: 'Contract role', value: 'contract' },
    { label: 'Admin role', value: 'admin' },
];

const permissionCategories = [
    {
        id: 'users',
        title: 'Users',
        permissions: [
            { id: 'view_users', label: 'View Users' },
            { id: 'edit_users', label: 'Edit Users' },
            { id: 'delete_users', label: 'Delete Users' },
            { id: 'invite_users', label: 'Invite Users' },
        ],
    },
    {
        id: 'projects',
        title: 'Projects',
        permissions: [
            { id: 'view_projects', label: 'View Projects' },
            { id: 'create_projects', label: 'Create Projects' },
            { id: 'edit_projects', label: 'Edit Projects' },
            { id: 'delete_projects', label: 'Delete Projects' },
        ],
    },
    {
        id: 'settings',
        title: 'Settings',
        permissions: [
            { id: 'view_settings', label: 'View Settings' },
            { id: 'edit_settings', label: 'Edit Settings' },
            { id: 'manage_billing', label: 'Manage Billing' },
            { id: 'manage_integrations', label: 'Manage Integrations' },
        ],
    },
    {
        id: 'reports',
        title: 'Reports',
        permissions: [
            { id: 'view_reports', label: 'View Reports' },
            { id: 'export_reports', label: 'Export Reports' },
            { id: 'schedule_reports', label: 'Schedule Reports' },
        ],
    },
];

const NewRoleModal = ({ open, setOpen, trigger }) => {
    const [activeTab, setActiveTab] = useState('details');
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const togglePermission = (id) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const getCategorySelectedCount = (categoryId) => {
        const category = permissionCategories.find((c) => c.id === categoryId);
        return category.permissions.filter((p) => selectedPermissions.includes(p.id))
            .length;
    };

    return (
        <Modal
            open={open}
            setOpen={setOpen}
            trigger={trigger}
            className="max-w-xl"
            title={
                <div className="flex items-center gap-4 text-left">
                    <div
                        className={cn(
                            'p-2.5 rounded-xl shrink-0 bg-accent'
                        )}
                    >
                        {activeTab === 'details' ? (
                            <Eye className="size-5" />
                        ) : (
                            <ShieldCheck className="size-5" />
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xl font-semibold leading-none text-foreground">
                            Create New Role
                        </span>
                        <span className="text-sm font-normal text-muted-foreground">
                            Define a new team role and its permissions
                        </span>
                    </div>
                </div>
            }
            footer={
                <div className="flex items-center justify-end gap-3">
                    {activeTab === 'permissions' && (
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                            {selectedPermissions.length} permissions selected
                        </span>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="border-none hover:bg-accent"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setOpen(false);
                        }}
                        className="px-6"
                    >
                        Create Role
                    </Button>
                </div>
            }
        >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList variant="line" className="w-full justify-start mb-6">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="permissions">
                        Permissions
                        {selectedPermissions.length > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded-full border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                                {selectedPermissions.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="role-name" className="text-sm font-medium">
                            Role Name
                        </Label>
                        <Input id="role-name" placeholder="Enter role name" className="h-11" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role-type" className="text-sm font-medium">
                            Role Type
                        </Label>
                        <Select
                            options={roleTypeOptions}
                            defaultValue="contract"
                            placeholder="Select role type"
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the role's responsibilities"
                            rows={4}
                            className="resize-none"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                    <div className="max-h-[400px] overflow-y-auto pr-2 -mr-2 space-y-4">
                        {permissionCategories.map((category) => (
                            <div
                                key={category.id}
                                className="border border-border rounded-xl overflow-hidden"
                            >
                                <div className="bg-muted/30 px-4 py-3 border-b flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Checkbox
                                            id={`cat-${category.id}`}
                                            checked={category.permissions.every((p) =>
                                                selectedPermissions.includes(p.id)
                                            )}
                                            onCheckedChange={(checked) => {
                                                const ids = category.permissions.map((p) => p.id);
                                                if (checked) {
                                                    setSelectedPermissions((prev) => [
                                                        ...new Set([...prev, ...ids]),
                                                    ]);
                                                } else {
                                                    setSelectedPermissions((prev) =>
                                                        prev.filter((p) => !ids.includes(p))
                                                    );
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor={`cat-${category.id}`}
                                            className="text-sm font-semibold cursor-pointer"
                                        >
                                            {category.title}
                                        </Label>
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground bg-background border px-2 py-0.5 rounded-full">
                                        {getCategorySelectedCount(category.id)}/{category.permissions.length}
                                    </span>
                                </div>
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                    {category.permissions.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="flex items-center gap-2.5"
                                        >
                                            <Checkbox
                                                id={permission.id}
                                                checked={selectedPermissions.includes(permission.id)}
                                                onCheckedChange={() => togglePermission(permission.id)}
                                            />
                                            <Label
                                                htmlFor={permission.id}
                                                className="text-sm font-normal text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                                            >
                                                {permission.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </Modal>
    );
};

export default NewRoleModal;

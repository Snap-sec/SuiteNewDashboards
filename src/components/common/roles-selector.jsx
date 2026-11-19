import React from 'react';
import { useLazySupportedRolesQuery } from '@/services/auth/authApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

function RolesSelector({
  value,
  onValueChange,
  placeholder = 'Select Role...',
  disabled,
}) {
  const [trigger, { data: roles, isLoading }] = useLazySupportedRolesQuery();

  const handleOpenChange = (open) => {
    if (open && !roles) {
      trigger();
    }
  };

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      onOpenChange={handleOpenChange}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <div className="p-2 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          roles?.data?.map((role) => (
            <SelectItem key={role.role} value={role.role}>
              {role.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export default RolesSelector;

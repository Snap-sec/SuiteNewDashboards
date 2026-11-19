'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandCheck, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Profile } from './profile';
import { Skeleton } from '../ui/skeleton';


export default function SelectWithAvatar({
  users = [],
  value: externalValue,           // <-- NEW controlled value from parent
  onChange,                       // <-- Return updated array or id
  searchField = 'name',
  searchFields = [],
  placeholder = 'Select a user...',
  searchPlaceholder,
  emptyMessage = 'No users found.',
  icon,
  onSearchChange,
  multiple = false,
  isLoading,
  valueKey = '_id',
}) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  // LOCAL STATE mirrors external value
  const [value, setValue] = React.useState(
    externalValue || (multiple ? [] : '')
  );

  // KEEP STATE IN SYNC WHEN PARENT UPDATES
  React.useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);


  // For single-select
  const selectedUser =
    !multiple && users.find((user) => user[valueKey] === value);

  // For multi-select
  const selectedUsers =
    multiple && users.filter((user) => value.includes(user[valueKey]));


  // FILTER LOGIC
  const filteredUsers = React.useMemo(() => {
    if (!searchValue) return users;

    return users.filter((user) => {
      if (searchFields.length > 0) {
        return searchFields.some((field) =>
          user[field]?.toString().toLowerCase().includes(searchValue.toLowerCase())
        );
      }
      const fieldValue = user[searchField]?.toLowerCase() || '';
      return fieldValue.includes(searchValue.toLowerCase());
    });
  }, [users, searchValue, searchField, searchFields]);


  const handleSearchChange = (search) => {
    setSearchValue(search);
    onSearchChange?.(search);
  };


  const getSearchPlaceholder = () => {
    if (searchPlaceholder) return searchPlaceholder;
    if (searchFields.length > 0) return `Search by ${searchFields.join(', ')}...`;
    return `Search by ${searchField}...`;
  };


  // TOGGLE SELECTION LOGIC
  const toggleSelect = (id) => {
    if (multiple) {
      setValue((prev) => {
        const exists = prev.includes(id);
        const newValue = exists
          ? prev.filter((v) => v !== id)
          : [...prev, id];

        onChange?.(newValue); // return array
        return newValue;
      });
    } else {
      setValue(id);
      onChange?.(id);
      setOpen(false);
    }
  };


  return (
    <Popover open={open} onOpenChange={setOpen} className="w-full">
      <PopoverTrigger className="w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full flex items-center gap-2"
        >
          {/* SINGLE SELECT */}
          {!multiple && selectedUser && (
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <Profile email={selectedUser.email} size={18} />
              </Avatar>
              <span className="font-medium">{selectedUser.name}</span>
            </div>
          )}

          {/* MULTI-SELECT PREVIEW */}
          {multiple && selectedUsers.length > 0 && (
            <div className="flex -space-x-2 items-center">
              {selectedUsers.slice(0, 3).map((u) => (
                <Avatar key={u._id} className="size-6 ">
                  <Profile email={u.email} size={22} />
                </Avatar>
              ))}
              {selectedUsers.length > 3 && (
                <span className="text-sm text-muted-foreground ml-4">
                  +{selectedUsers.length - 3}
                </span>
              )}
            </div>
          )}

          {/* PLACEHOLDER */}
          {!multiple && !selectedUser && (
            <>
              {icon} <span className=' text-muted-foreground'>{placeholder}</span>
            </>
          )}

          {multiple && selectedUsers.length === 0 && (
            <>
              {icon} <span>{placeholder}</span>
            </>
          )}

          <span className="ml-auto opacity-50">▼</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={getSearchPlaceholder()}
            value={searchValue}
            onValueChange={handleSearchChange}
          />

          <CommandList>
            <div className="max-h-[300px] kt-scrollable-y-auto">
              {!isLoading && <CommandEmpty>{emptyMessage}</CommandEmpty>}

              <CommandGroup>
                {isLoading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Skeleton className="h-7 w-7 rounded-full" />

                    <div className="flex flex-col gap-1 flex-1">
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                  ))
                ) : (
                  filteredUsers.map((user) => {
                    const isSelected = multiple
                      ? value.includes(user[valueKey])
                      : value === user[valueKey];

                    return (
                      <CommandItem
                        key={user[valueKey]}
                        value={user.name + user.email + user[valueKey]} // Used for filtering internally by Command component
                        onSelect={() => toggleSelect(user[valueKey])}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Profile email={user.email} size={28} />

                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-muted-foreground text-sm">
                              {user.department?.name || user.role || user.email}
                            </span>
                          </div>

                          <CommandCheck
                            className={`ml-auto transition ${
                              isSelected ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </div>
                      </CommandItem>
                    );
                  })
                )}
              </CommandGroup>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
import React, { useState } from 'react';
import { Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';

export default function VendorActionMenu({
  vendor,
  onMarkAsDefault,
  setEditVendor,
  setFormOpen,
  setDetailVendor,
  setDetailOpen,
  setDeleteVendor,
  setDeleteOpen,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-center">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 hover:bg-muted"
          >
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          {/* <DropdownMenuItem 
            onClick={() => {
              setDetailVendor(vendor);
              setDetailOpen(true);
            }} 
            className="gap-2 cursor-pointer"
          >
            View Profile
          </DropdownMenuItem> */}

          {!vendor?.isDefault && (
            <>
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <ButtonWithConfirm
                  variant="ghost"
                  confirm={true}
                  disabled={vendor?.isDefault}
                  className="w-full justify-start cursor-pointer px-2 py-1.5 text-sm font-normal"
                  dialog={
                    <p className="text-sm">
                      Are you sure you want to mark{' '}
                      <span className="font-bold text-foreground">
                        "{vendor?.name}"
                      </span>{' '}
                      as the default service vendor?
                      <br />
                      <span className="text-muted-foreground mt-1 inline-block text-xs">
                        This will replace the current default vendor.
                      </span>
                    </p>
                  }
                  onConfirm={() => {
                    onMarkAsDefault(vendor.id || vendor._id);
                    setOpen(false);
                  }}
                >
                  Mark as Default
                </ButtonWithConfirm>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem
            onClick={() => {
              setEditVendor(vendor);
              setFormOpen(true);
            }}
            className="gap-2 cursor-pointer"
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setDeleteVendor(vendor);
              setDeleteOpen(true);
            }}
            className="gap-2 cursor-pointer text-destructive"
            variant="destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

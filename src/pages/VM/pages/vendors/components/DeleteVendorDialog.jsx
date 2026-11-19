import React from 'react';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DeleteVendorDialog({ open, setOpen, vendor, onConfirm }) {
  if (!vendor) return null;

  return (
    <ConfirmDialog
      open={open}
      setOpen={setOpen}
      onConfirm={() => {
        onConfirm(vendor._id || vendor.id);
        setOpen(false);
      }}
      icon={<Trash2 className="size-5 text-destructive" />}
      dialog={
        <p className="text-sm">
          Are you sure you want to delete{' '}
          <span className="font-bold text-foreground">"{vendor.name}"</span>?
          <br />
          <span className="text-destructive font-medium mt-1 inline-block">
            *NOTE: This action cannot be undone and will remove the service vendor from all report templates.
          </span>
        </p>
      }
      confirmButton={
        <Button variant="destructive" size="md">
          Delete Service Vendor
        </Button>
      }
    />
  );
}

import React from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, CalendarDays, FileText } from 'lucide-react';

function getInitials(name) {
  return name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) : '?';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function VendorDetailDialog({ open, setOpen, vendor }) {
  if (!vendor) return null;

  const contact = vendor.contact_details || {};
  const email = vendor.email || contact.email;
  const phone = vendor.phone || contact.phone;
  const address = vendor.address || contact.address;

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Service Vendor Details"
      className="sm:max-w-md"
      footer={
        <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-6 py-2">
        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={vendor.logo_url} alt={vendor.name} className="rounded-full" />
            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
              {getInitials(vendor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground leading-none">{vendor.name}</h3>
            <Badge
              variant={vendor.is_active ? 'success' : 'secondary'}
              appearance="light"
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0"
            >
              {vendor.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Info List */}
        <div className="grid gap-4">
          {email && <InfoItem icon={Mail} label="Email" value={email} />}
          {phone && <InfoItem icon={Phone} label="Phone" value={phone} />}
          {address && <InfoItem icon={MapPin} label="Address" value={address} />}
          <InfoItem icon={CalendarDays} label="Created On" value={formatDate(vendor.createdAt)} />
        </div>

        {/* Notes/Description */}
        {vendor.description && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Description / Notes</span>
            </div>
            <p className="text-[13px] text-foreground/80 leading-relaxed bg-primary/5 rounded-lg p-3 border border-primary/10 italic">
              "{vendor.description}"
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div >
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="space-y-0.5">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight leading-none">{label}</p>
        <p className="text-sm font-medium text-foreground leading-tight">{value}</p>
      </div>
    </div>
  );
}

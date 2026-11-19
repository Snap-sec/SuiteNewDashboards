import { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardTable,
  CardToolbar,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Building,
  Ellipsis,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  Eye,
} from 'lucide-react';

// ─── Seed Data ──────────────────────────────────────────────────────────────────
const INITIAL_VENDORS = [
  {
    id: '1',
    name: 'CyberGuard Solutions',
    logo: '',
    email: 'reports@cyberguard.io',
    phone: '+1 (415) 555-0142',
    address: '100 Market St, San Francisco, CA 94105',
    description:
      'Enterprise penetration testing and vulnerability assessment firm specializing in cloud-native infrastructure and API security.',
    isActive: true,
    createdAt: '2025-11-02',
  },
  {
    id: '2',
    name: 'RedTeam Intel',
    logo: '',
    email: 'ops@redteamintel.com',
    phone: '+44 20 7946 0958',
    address: '30 Eastcheap, London, EC3M 1HD, UK',
    description:
      'Red team operations and adversary simulation provider with expertise in financial services and critical infrastructure.',
    isActive: true,
    createdAt: '2025-12-14',
  },
  {
    id: '3',
    name: 'ShieldByte Labs',
    logo: '',
    email: 'info@shieldbyte.dev',
    phone: '+49 30 1234 5678',
    address: 'Friedrichstraße 123, 10117 Berlin, Germany',
    description:
      'Application security testing lab providing SAST, DAST, and manual code review services for SaaS platforms.',
    isActive: false,
    createdAt: '2026-01-08',
  },
  {
    id: '4',
    name: 'NetSentinel Group',
    logo: '',
    email: 'contact@netsentinel.co',
    phone: '+971 4 555 8822',
    address: 'DIFC Gate Village, Building 5, Dubai, UAE',
    description:
      'Network security and infrastructure hardening consultancy with regional expertise in Middle East & North Africa markets.',
    isActive: true,
    createdAt: '2026-02-19',
  },
  {
    id: '5',
    name: 'VulnTrack Analytics',
    logo: '',
    email: 'team@vulntrack.ai',
    phone: '+91 80 4567 8901',
    address: 'Prestige Tech Park, Marathahalli, Bangalore 560103',
    description:
      'AI-driven vulnerability intelligence platform providing continuous monitoring, prioritization, and remediation workflows.',
    isActive: true,
    createdAt: '2026-03-05',
  },
  {
    id: '6',
    name: 'Axiom Pentest Co.',
    logo: '',
    email: 'hello@axiompentest.com',
    phone: '+1 (212) 555-0199',
    address: '350 Fifth Avenue, New York, NY 10118',
    description:
      'Boutique penetration testing firm focused on web applications, mobile apps, and thick-client assessments.',
    isActive: false,
    createdAt: '2026-03-22',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  address: '',
  description: '',
  isActive: true,
};

// ─── Vendor Form Dialog ─────────────────────────────────────────────────────────

function VendorFormDialog({ open, onOpenChange, vendor, onSave }) {
  const isEdit = !!vendor;
  const [form, setForm] = useState(vendor ?? { ...EMPTY_FORM });

  const handleOpen = (nextOpen) => {
    if (nextOpen) {
      setForm(vendor ?? { ...EMPTY_FORM });
    }
    onOpenChange(nextOpen);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onOpenChange(false);
  };

  const isValid = form.name.trim().length > 0 && form.email.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the vendor details below.'
              : 'Fill in the details to register a new vendor identity.'}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form id="vendor-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Preview Avatar + Name */}
            <div className="flex items-center gap-3 mb-1">
              <Avatar className="size-11">
                {form.logo ? (
                  <AvatarImage src={form.logo} alt={form.name} />
                ) : (
                  <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                    {form.name ? getInitials(form.name) : '?'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {form.name || 'Vendor Name'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {form.email || 'email@example.com'}
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[0.8125rem]">
                Vendor Name <span className="text-destructive">*</span>
              </Label>
              <Input
                size="md"
                placeholder="e.g. CyberGuard Solutions"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[0.8125rem]">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  size="md"
                  type="email"
                  placeholder="contact@vendor.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[0.8125rem]">Phone</Label>
                <Input
                  size="md"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[0.8125rem]">Address</Label>
              <Input
                size="md"
                placeholder="123 Main Street, City, Country"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[0.8125rem]">Description / Notes</Label>
              <Textarea
                size="md"
                rows={3}
                placeholder="Brief description of the vendor's services..."
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between rounded-md border border-input px-3 py-2.5">
              <div>
                <p className="text-[0.8125rem] font-medium text-foreground">Active Status</p>
                <p className="text-xs text-muted-foreground">
                  Inactive vendors won't appear in report templates.
                </p>
              </div>
              <Switch
                size="sm"
                checked={form.isActive}
                onCheckedChange={(v) => handleChange('isActive', v)}
              />
            </div>
          </form>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" size="md" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            form="vendor-form"
            disabled={!isValid}
          >
            {isEdit ? 'Save Changes' : 'Add Vendor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── View Details Dialog ────────────────────────────────────────────────────────

function VendorDetailDialog({ open, onOpenChange, vendor }) {
  if (!vendor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vendor Details</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-3.5">
              <Avatar className="size-14">
                {vendor.logo ? (
                  <AvatarImage src={vendor.logo} alt={vendor.name} />
                ) : (
                  <AvatarFallback className="text-base font-semibold bg-primary/10 text-primary">
                    {getInitials(vendor.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-base font-semibold text-foreground">{vendor.name}</h3>
                <Badge
                  variant={vendor.isActive ? 'success' : 'secondary'}
                  size="sm"
                  className="mt-1"
                >
                  {vendor.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            {/* Info Grid */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <Mail className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-[0.8125rem] text-foreground">{vendor.email}</p>
                </div>
              </div>
              {vendor.phone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-[0.8125rem] text-foreground">{vendor.phone}</p>
                  </div>
                </div>
              )}
              {vendor.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-[0.8125rem] text-foreground">{vendor.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {vendor.description && (
              <div className="rounded-md bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Notes</p>
                <p className="text-[0.8125rem] text-foreground leading-relaxed">
                  {vendor.description}
                </p>
              </div>
            )}

            {/* Meta */}
            <p className="text-xs text-muted-foreground">
              Created {formatDate(vendor.createdAt)}
            </p>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="md" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation ────────────────────────────────────────────────────────

function DeleteVendorDialog({ open, onOpenChange, vendor, onConfirm }) {
  if (!vendor) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">{vendor.name}</span>? This action
            cannot be undone and will remove the vendor from all report templates.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onConfirm(vendor.id);
              onOpenChange(false);
            }}
          >
            Delete Vendor
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function VendorsPage() {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [detailVendor, setDetailVendor] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteVendor, setDeleteVendor] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Filtered list
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return vendors;
    const q = searchQuery.toLowerCase();
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q),
    );
  }, [vendors, searchQuery]);

  // CRUD handlers
  const handleSave = (formData) => {
    if (editVendor) {
      // Update
      setVendors((prev) =>
        prev.map((v) => (v.id === editVendor.id ? { ...v, ...formData } : v)),
      );
      setEditVendor(null);
    } else {
      // Create
      const newVendor = {
        ...formData,
        id: String(Date.now()),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setVendors((prev) => [newVendor, ...prev]);
    }
  };

  const handleDelete = (id) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const handleToggleActive = (id) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v)),
    );
  };

  const openEdit = (vendor) => {
    setEditVendor(vendor);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditVendor(null);
    setFormOpen(true);
  };

  const openDetail = (vendor) => {
    setDetailVendor(vendor);
    setDetailOpen(true);
  };

  const openDelete = (vendor) => {
    setDeleteVendor(vendor);
    setDeleteOpen(true);
  };

  // Stats
  const activeCount = vendors.filter((v) => v.isActive).length;
  const inactiveCount = vendors.length - activeCount;

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Vendors</h1>
        <p className="text-sm text-muted-foreground">
          Manage the reporting identity layer for generating branded vulnerability reports.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
              <Building className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground tabular-nums">
                {vendors.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Vendors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-green-500/10">
              <div className="size-2.5 rounded-full bg-green-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground tabular-nums">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
              <div className="size-2.5 rounded-full bg-muted-foreground/50" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground tabular-nums">
                {inactiveCount}
              </p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Vendor Table Card ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All Vendors</CardTitle>
          <CardToolbar>
            <InputWrapper size="sm" className="w-56">
              <Search className="size-4" />
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputWrapper>
            <Button variant="primary" size="sm" className="gap-1.5" onClick={openCreate}>
              <Plus size={15} />
              Add Vendor
            </Button>
          </CardToolbar>
        </CardHeader>

        <CardTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-64">Vendor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Address</TableHead>
                <TableHead className="text-center w-28">Status</TableHead>
                <TableHead className="text-center w-32">Created</TableHead>
                <TableHead className="text-center w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Building className="size-8 opacity-30" />
                      <p className="text-sm">
                        {searchQuery ? 'No vendors match your search.' : 'No vendors yet.'}
                      </p>
                      {!searchQuery && (
                        <Button variant="outline" size="sm" onClick={openCreate}>
                          Add your first vendor
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((vendor) => (
                  <TableRow key={vendor.id}>
                    {/* Vendor */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          {vendor.logo ? (
                            <AvatarImage src={vendor.logo} alt={vendor.name} />
                          ) : (
                            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                              {getInitials(vendor.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-[0.8125rem] font-medium text-foreground truncate">
                            {vendor.name}
                          </p>
                          {vendor.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                              {vendor.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[0.8125rem] text-foreground">{vendor.email}</span>
                        {vendor.phone && (
                          <span className="text-xs text-muted-foreground">{vendor.phone}</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Address */}
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-[0.8125rem] text-muted-foreground line-clamp-1">
                        {vendor.address || '—'}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          size="sm"
                          checked={vendor.isActive}
                          onCheckedChange={() => handleToggleActive(vendor.id)}
                        />
                        <Badge
                          variant={vendor.isActive ? 'success' : 'secondary'}
                          size="sm"
                          className="min-w-[60px] justify-center"
                        >
                          {vendor.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Created */}
                    <TableCell className="text-center">
                      <span className="text-[0.8125rem] text-muted-foreground tabular-nums">
                        {formatDate(vendor.createdAt)}
                      </span>
                    </TableCell>

                    {/* Actions — 3-dot menu */}
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="size-7 p-0">
                            <Ellipsis className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[160px]">
                          <DropdownMenuItem onClick={() => openDetail(vendor)}>
                            <Eye className="size-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(vendor)}>
                            <Pencil className="size-4" />
                            Edit Vendor
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => openDelete(vendor)}
                          >
                            <Trash2 className="size-4" />
                            Delete Vendor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardTable>
      </Card>

      {/* ── Dialogs ── */}
      <VendorFormDialog
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditVendor(null);
        }}
        vendor={editVendor}
        onSave={handleSave}
      />

      <VendorDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        vendor={detailVendor}
      />

      <DeleteVendorDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        vendor={deleteVendor}
        onConfirm={handleDelete}
      />
    </div>
  );
}

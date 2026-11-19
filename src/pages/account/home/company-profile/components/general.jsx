import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Check, Copy, SquarePen } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '../../../../../components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

const GeneralInfoSkeleton = () => {
  return (
    <Card className="min-w-full">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-9 rounded-full" />
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="kt-scrollable-x-auto pb-3 p-0">
        <Table className="align-middle text-sm">
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {/* Label */}
                <TableCell className="min-w-56">
                  <Skeleton className="h-4 w-32" />
                </TableCell>

                {/* Value */}
                <TableCell className="min-w-48 w-full">
                  <Skeleton className="h-4 w-full max-" />
                </TableCell>

                {/* Action */}
                <TableCell className="text-center">
                  <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const GeneralInfo = ({ generalInfo = {}, companyDetails = {}, isLoading, form, setForm, handleSaveCompanyDetails }) => {
  const { user } = useAuth();
  const isMember = user?.role?.toLowerCase() === 'member';
  const [editField, setEditField] = useState(null);
  const [websiteError, setWebsiteError] = useState('');

  const isInitialized = useRef(false);

  // Prefill general info feilds only on initial data load
  useEffect(() => {
    if ((generalInfo || companyDetails) && !isInitialized.current) {
      setForm({
        companyName: generalInfo?.name || companyDetails?.name || '',
        website: generalInfo?.website || companyDetails?.website || '',
      });
      // Mark as initialized once we receive valid data from the server
      isInitialized.current = true;
    }
  }, [generalInfo, companyDetails]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (key === 'website') {
      const websiteRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
      const websiteVal = value?.trim();
      
      if (websiteVal && !websiteRegex.test(websiteVal)) {
        setWebsiteError('Please enter a valid website URL');
      } else {
        setWebsiteError('');
      }
    }
  };

  const toggleEdit = (field, isSaving = false) => {
    if (isSaving && handleSaveCompanyDetails) {
      handleSaveCompanyDetails();
    }
    setEditField((prev) => (prev === field ? null : field));
  };

  if (isLoading) {
    return <GeneralInfoSkeleton />;
  }

  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>General Info</CardTitle>

      </CardHeader>

      <CardContent className="kt-scrollable-x-auto pb-3 p-0">
        <Table className="align-middle text-sm text-muted-foreground">
          <TableBody>
            {/* Company Name */}
            <TableRow>
              <TableCell className="min-w-56 text-secondary-foreground">
                Company Name
              </TableCell>
              <TableCell className="min-w-48 w-full text-foreground">
                {editField === 'companyName' ? (
                  <Input
                    value={form?.companyName || ''}
                    onChange={(e) =>
                      handleChange('companyName', e.target.value)
                    }
                    autoFocus
                  />
                ) : (
                  form?.companyName
                )}
              </TableCell>
              {!isMember && (
                <AuthorityGuard forbidRoles={['Auditor']}>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      mode="icon"
                      onClick={() => toggleEdit('companyName', editField === 'companyName')}
                    >
                      {editField === 'companyName' ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <SquarePen size={16} className="text-blue-500" />
                      )}
                    </Button>
                  </TableCell>
                </AuthorityGuard>
              )}
            </TableRow>

            {/* Phone */}
            {/* <TableRow>
              <TableCell className="text-secondary-foreground">
                Phone number
              </TableCell>
              <TableCell className="text-foreground">
                {editField === 'phone' ? (
                  <Input
                    value={form?.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                ) : (
                  form?.phone
                )}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  mode="icon"
                  onClick={() => toggleEdit('phone')}
                >
                  {editField === 'phone' ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <SquarePen size={16} className="text-blue-500" />
                  )}
                </Button>
              </TableCell>
            </TableRow> */}

            {/* VAT */}
            {/* <TableRow>
              <TableCell className="text-secondary-foreground">
                VAT number
              </TableCell>
              <TableCell className="text-foreground">
                {editField === 'vat' ? (
                  <Input
                    value={form?.vat}
                    onChange={(e) => handleChange('vat', e.target.value)}
                    placeholder="Enter VAT number"
                  />
                ) : form?.vat ? (
                  form?.vat
                ) : (
                  <Badge size="md" variant="destructive" appearance="outline">
                    Missing Details
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-center">
                {editField === 'vat' ? (
                  <Button
                    variant="ghost"
                    mode="icon"
                    onClick={() => toggleEdit('vat')}
                  >
                    <Check size={16} className="text-green-500" />
                  </Button>
                ) : (
                  <Button
                    mode="link"
                    underlined="dashed"
                    onClick={() => toggleEdit('vat')}
                  >
                    Add
                  </Button>
                )}
              </TableCell>
            </TableRow> */}

            {/* Registration */}
            {/* <TableRow>
              <TableCell className="text-secondary-foreground">
                Registration number
              </TableCell>
              <TableCell className="text-foreground">
                {editField === 'registration' ? (
                  <Input
                    value={form?.registration}
                    onChange={(e) =>
                      handleChange('registration', e.target.value)
                    }
                  />
                ) : (
                  form?.registration
                )}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  mode="icon"
                  onClick={() => toggleEdit('registration')}
                >
                  {editField === 'registration' ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <SquarePen size={16} className="text-blue-500" />
                  )}
                </Button>
              </TableCell>
            </TableRow> */}

            {/* Remote ID */}
            <TableRow>
              <TableCell className="text-secondary-foreground">
                Company Website
              </TableCell>

              <TableCell className="text-foreground">
                {editField === 'website' ? (
                  <div className="flex flex-col gap-1 w-full">
                    <Input
                      value={form?.website || ''}
                      onChange={(e) => handleChange('website', e.target.value)}
                      autoFocus
                      className={websiteError ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {websiteError && (
                      <span className="text-xs text-destructive">{websiteError}</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {form?.website}
                    {form?.website && (
                      <Button
                        variant="ghost"
                        mode="icon"
                        onClick={() =>
                          navigator.clipboard.writeText(form.website)
                        }
                      >
                        <Copy size={16} />
                      </Button>
                    )}
                  </div>
                )}
              </TableCell>

              {!isMember && (
                <AuthorityGuard forbidRoles={['Auditor']}>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      mode="icon"
                      onClick={() => toggleEdit('website', editField === 'website')}
                      disabled={editField === 'website' && !!websiteError}
                    >
                      {editField === 'website' ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <SquarePen size={16} className="text-blue-500" />
                      )}
                    </Button>
                  </TableCell>
                </AuthorityGuard>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { GeneralInfo };

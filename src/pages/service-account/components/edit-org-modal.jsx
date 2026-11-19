import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useUpdateOrgDetailsMutation } from '@/services/auth/serviceProviderApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/custom/modal';

export default function EditOrgModal({ trigger, orgDetails }) {
    const [open, setOpen] = useState(false);

    const [updateOrg, { isLoading: updatingOrg }] = useUpdateOrgDetailsMutation();

    // Form State
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [companyLogoUrl, setCompanyLogoUrl] = useState("");

    useEffect(() => {
        if (orgDetails) {
            setCompanyName(orgDetails.name || '');
            setCompanyWebsite(orgDetails.website || '');
            setCompanyLogoUrl(orgDetails.logo || '');
        }
    }, [orgDetails, open]);

    const handleClose = () => {
        setOpen(false);
    }

    const handleUpdate = async () => {
        if (!companyName || !companyWebsite) {
            toast.error('Please fill in Company Name and Website');
            return;
        }

        const payload = {
            orgId: orgDetails._id,
            name: companyName,
            website: companyWebsite,
            logo: companyLogoUrl,
        }

        toast.promise(updateOrg({ payload }).unwrap(), {
            loading: 'Updating organization...',
            success: (res) => { handleClose(); return 'Organization updated successfully!'; },
            error: 'Failed to update organization.'
        });
    };

    return (
        <Modal
            open={open}
            setOpen={setOpen}
            trigger={trigger}
            title={<p className="text-lg font-medium px-3 pt-2">Edit Organization</p>}
            // description={<p className="px-2">Update your organization details</p>}
            className="max-w-[500px] w-full p-0 overflow-hidden gap-0"
            footer={
                <div className="flex justify-end p-2 gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        disabled={updatingOrg}
                    >
                        {updatingOrg ? 'Updating...' : 'Update'}
                    </Button>
                </div>
            }
        >
            <div className="px-3 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name <span className="text-destructive">*</span></Label>
                        <Input
                            id="companyName"
                            placeholder="Enter company name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyWebsite">Company Website <span className="text-destructive">*</span></Label>
                        <Input
                            id="companyWebsite"
                            placeholder="Enter company website"
                            value={companyWebsite}
                            onChange={(e) => setCompanyWebsite(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyLogoUrl">Company Logo</Label>
                        <Input
                            id="companyLogoUrl"
                            placeholder="https://example.com/logo.png"
                            value={companyLogoUrl}
                            onChange={(e) =>
                                setCompanyLogoUrl(e.target.value)
                            }
                        />
                    </div>
                </div>

            </div>
        </Modal>
    );
}

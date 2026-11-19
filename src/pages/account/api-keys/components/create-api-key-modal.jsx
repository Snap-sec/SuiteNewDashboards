import React, { useState } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateApiKeyMutation } from '@/services/auth/apiKeyApi';
import { toast } from 'sonner';

export function CreateApiKeyModal({ open, setOpen }) {
  const [name, setName] = useState('');
  const [createdKey, setCreatedKey] = useState(null);
  const [createApiKey, { isLoading }] = useCreateApiKeyMutation();

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setName('');
      setCreatedKey(null);
    }, 300);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    try {
      const response = await createApiKey({ name }).unwrap();
      if (response && response.data && response.data.api_key) {
        setCreatedKey(response.data.api_key);
      }
      toast.success('API key created successfully');
    } catch (error) {
      toast.error('Failed to create API key');
    }
  };

  const footer = createdKey ? (
    <div className="flex justify-end gap-3 w-full">
      <Button onClick={handleClose}>Close</Button>
    </div>
  ) : (
    <div className="flex justify-end gap-3 w-full">
      <Button variant="outline" onClick={handleClose}>Cancel</Button>
      <Button onClick={handleCreate} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create API Key'}
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      setOpen={handleClose}
      title={createdKey ? "API Key Created" : "Create API Key"}
      description={createdKey ? "Please copy your API key now. You won't be able to see it again." : "Enter a descriptive name for your new API key to help you identify it later."}
      footer={footer}
    >
      {createdKey ? (
        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-2">
            <div className="font-mono text-xs bg-muted p-2 rounded-md border flex-1 break-all whitespace-normal">
              {createdKey}
            </div>
            <Button onClick={() => { navigator.clipboard.writeText(createdKey); toast.success('Copied to clipboard'); }}>Copy</Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Key Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              placeholder="e.g. Production API Key"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

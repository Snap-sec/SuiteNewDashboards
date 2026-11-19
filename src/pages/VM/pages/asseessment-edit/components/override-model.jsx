

import { useEffect, useState } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';


function OverRideModel({ isOpen, setIsOpen, onConfirm, trigger }){

    const [override, setOverride] = useState(false);

    const handleSave = () => {
        onConfirm(override);
        setOverride(false);
        setIsOpen(false);
    };

    return(
        <Modal
            open={isOpen}
            setOpen={setIsOpen}
            title="Override Existing Owners"
            description=""
            trigger={trigger}
            footer={
                <Button 
                    variant="primary" 
                    onClick={handleSave}>
                   <Save /> Save
                </Button>
             }
            >
            <div className="flex items-center space-x-2 mt-4">
                <Switch 
                    id="auto-update" 
                    checked={override}
                    onCheckedChange={setOverride}
                />
                <p className='text-sm'>Enabling this will update and replace the current owner for all tickets in this assessment.</p>
            </div>
        </Modal>
    )
}


export default OverRideModel;
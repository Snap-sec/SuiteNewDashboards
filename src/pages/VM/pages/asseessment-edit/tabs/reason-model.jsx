import { useEffect, useState } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';



function ReasonModel({ onSubmit }) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        onSubmit(reason);
        setIsOpen(false);
        setReason('');
    };

    return(
        <Modal
            open={isOpen}
            setOpen={setIsOpen}
            title="Reason for Pausing"
            description="Please provide a reason for pausing the assessment."
            trigger={<Button variant="outline" onClick={() => setIsOpen(true)}>Pause</Button>}
            footer={
                <Button 
                    variant="outline" 
                    onClick={handleSubmit}
                    disabled={!reason.trim()}
                >
                    Pause
                </Button>
             }
            >
            <div>
                <Textarea 
                    placeholder="Enter reason here..." 
                    rows={4}
                    className="w-full"  
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
            </div>
        </Modal>
    )
}
export default ReasonModel;
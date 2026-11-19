import { Modal } from '@/components/custom/modal';
import { Button } from "@/components/ui/button";
import { Mail, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ModalHeader = ({ children, className = '' }) => (
    <div className={`px-6 pt-6 pb-4 ${className}`}>{children}</div>
);

const ModalBody = ({ children, className = '' }) => (
    <div className={`px-6 pb-6 ${className}`}>{children}</div>
);

const ModalFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 ${className}`}>{children}</div>
);

function SuccessModal({ isOpen, setIsOpen, email }) {
    const navigate = useNavigate();

    return (
    <Modal
        open={isOpen}
        setOpen={() => { navigate('/auth/signin') }}
    >
    
        {/* Custom Header content with Icon */}
        <ModalHeader className="text-center pb-2">
            <div className="mx-auto h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Check your email</h3>
        </ModalHeader>

        <ModalBody className="text-center">
            <p className="text-slate-600 leading-relaxed">
                We've sent login credentials for demo account to <strong className="text-slate-900">{email}</strong>
            </p>
            <p className="mt-2 text-sm text-slate-500">
                Click the link in the email to login and start your demo session.
            </p>
        </ModalBody>

        {/* <ModalFooter> */}
            {/* <Button variant="primary" className="w-full sm:w-full" onClick={() => setShowModal(false)}>
                Open Email Client
            </Button>
            <Button variant="ghost" className="w-full sm:w-full mt-2 sm:mt-0" onClick={() => navigate('/auth/signin')}>
                Close
            </Button> */}
        {/* </ModalFooter> */}
    </Modal>)

}

export default SuccessModal;
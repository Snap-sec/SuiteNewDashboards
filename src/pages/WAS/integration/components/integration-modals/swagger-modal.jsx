import { useEffect, useState } from 'react';
import { Download, Globe, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAddConnectApiSecIntegrationMutation } from '@/services/apisec/integrationApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { useStore } from '../../store';

function SwaggerModal() {
    const { showInstallModal, setShowInstallModal } = useStore();

    const [payload, setPayload] = useState({
        name: 'Swagger Integration',
        description: 'Integration for importing Swagger definitions',
        domain: '',
    });

    const [isOpen, setIsOpen] = useState(false);

    const [addIntegration, { isLoading }] = useAddConnectApiSecIntegrationMutation();

    useEffect(() => {
        let { type, slug } = showInstallModal;

        if (type === 'integration' && slug === 'swagger') setIsOpen(true);
        else setIsOpen(false);
    }, [showInstallModal]);

    const handleInput = (event) => {
        const { name, value } = event.target;
        setPayload((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setIsOpen(false);
        setShowInstallModal({});
    }

    const handleInstall = () => {
        if (!payload.domain) {
            return toast.error('Domain is Required!');
        }

        const apiPayload = {
            title: payload.name,
            name: payload.name,
            description: payload.description,
            config: { url: payload.domain }
        };

        toast
            .promise(addIntegration({ type: 'swagger', payload: apiPayload }).unwrap(), {
                loading: 'Connecting Swagger...',
                success: () => { handleClose(); return 'Swagger connected successfully'; },
                error: 'Failed to connect Swagger',
            })
    };

    return (
        <Modal
            open={isOpen}
            setOpen={handleClose}
            title="Connect Swagger"
            description="Enter your Swagger URL/Domain."
            footer={
                <Button variant="outline" onClick={handleInstall} disabled={isLoading}>
                    <Download /> {isLoading ? 'Connecting...' : 'Connect Now'}
                </Button>
            }
        >
            <div className="flex flex-col gap-3">
                <InputWrapper>
                    <Button
                        size="sm"
                        variant="dim"
                        mode="icon"
                        className="size-5 -ms-0.5"
                    >
                        <User />
                    </Button>
                    <Input
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={payload.name}
                        onChange={handleInput}
                    />
                </InputWrapper>
                <InputWrapper>
                    <Button
                        size="sm"
                        variant="dim"
                        mode="icon"
                        className="size-5 -ms-0.5"
                    >
                        <Globe />
                    </Button>
                    <Input
                        name="domain"
                        type="text"
                        placeholder="Swagger Domain / URL"
                        value={payload.domain}
                        onChange={handleInput}
                    />
                </InputWrapper>
            </div>
        </Modal>
    );
}

export default SwaggerModal;

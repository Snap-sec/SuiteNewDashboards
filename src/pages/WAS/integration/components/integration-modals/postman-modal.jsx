import { useEffect, useState } from 'react';
import { Download, Globe, Key, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAddConnectApiSecIntegrationMutation } from '@/services/apisec/integrationApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { useStore } from '../../store';

function PostmanModal() {
    const { showInstallModal, setShowInstallModal } = useStore();

    const [payload, setPayload] = useState({
        apiKey: "",
        name: '',
        description: 'Integration for importing Postman collections',
    });

    const [isOpen, setIsOpen] = useState(false);

    const [addIntegration, { isLoading }] = useAddConnectApiSecIntegrationMutation();

    useEffect(() => {
        let { type, slug } = showInstallModal;

        if (type === 'integration' && slug === 'postman') setIsOpen(true);
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
        if (!payload.apiKey) {
            return toast.error('API Key is Required!');
        }

        const apiPayload = {
            config: { api_key: payload.apiKey },
            name: payload.name,
            description: payload.description,
            environment: payload.environment,
        };

        toast
            .promise(addIntegration({ type: 'postman', payload: apiPayload }).unwrap(), {
                loading: 'Connecting Postman...',
                success: () => { handleClose(); return 'Postman connected successfully'; },
                error: 'Failed to connect Postman',
            })
    };

    return (
        <Modal
            open={isOpen}
            setOpen={handleClose}
            title="Connect Postman"
            description="Enter your Postman API key to sync items."
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
                        <Key />
                    </Button>
                    <Input
                        name="apiKey"
                        type="text"
                        placeholder="Api Key"
                        value={payload.apiKey}
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
            </div>
        </Modal>
    );
}

export default PostmanModal;

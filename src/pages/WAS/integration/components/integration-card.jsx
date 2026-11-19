import { LogOut, SquareDashedMousePointer, Download, ClockPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from "@/components/custom/button-with-confirmation";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { File } from 'lucide-react';
import { useContext } from 'react';

import { useStore } from '../store';
import { IntegrationContext } from '../context/integration-context';
import { Trash } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';
import { RiProgress1Fill } from '@remixicon/react';

import { Badge } from '@/components/ui/badge';


const Actions = ({ adapter }) => {
    const { handleDeleteAdapter, handleRefreshAdapter, isDeletingAdapter, isRefreshingAdapter } = useContext(IntegrationContext);

    const { setShowInstallModal } = useStore();

    const handleInstallClick = () => {
        // For other adapters, show the modal
        setShowInstallModal({ type: 'integration', slug: adapter.slug || adapter.type });
    };

    if (adapter?.status) {
        return (
            <CardFooter className="w-full flex items-center justify-between">
                <div className=" flex items-center py-3.5 gap-2">
                    <ButtonWithConfirm onConfirm={() => handleDeleteAdapter(adapter.instance_id)} confirm={true} variant="destructive">
                        {
                            isDeletingAdapter ?
                                <>
                                    <RiProgress1Fill /> Deleting...
                                </>
                                :
                                <>
                                    <Trash /> Delete
                                </>
                        }
                    </ButtonWithConfirm>
                    {
                        adapter?.status !== 'failed' &&
                        <ButtonWithConfirm
                            onConfirm={() => handleRefreshAdapter(adapter.instance_id)}
                            confirm={true}
                            variant="outline"
                            disabled={adapter?.status === 'installing' || adapter?.status === 'refreshing' || isRefreshingAdapter}
                        >
                            {
                                isRefreshingAdapter ? <RiProgress1Fill className="animate-spin" /> : <RefreshCcw />
                            }
                            Refresh
                        </ButtonWithConfirm>
                    }
                </div>

            </CardFooter>
        )
    }

    return (
        <CardFooter className="w-full flex justify-between items-center py-3.5">
            {
                !adapter?.supported ?
                    <Button variant="outline">
                        <ClockPlus /> Coming Soon
                    </Button>
                    :
                    adapter?.installable ?
                        <ButtonWithConfirm
                            variant="outline"
                            confirm={false}
                            onConfirm={handleInstallClick}
                            dialog={<p>Are you sure you want to install <b>{adapter.title}</b>?</p>}
                        >
                            <Download /> Install
                        </ButtonWithConfirm>
                        :
                        adapter?.manual_integration_required ?
                            <Button variant="outline" onClick={() => window.open(adapter.docs_url, "_blank")}><File /> Visit Docs</Button>
                            :
                            ''
            }
        </CardFooter>
    )
}


const IntegrationCard = ({ adapter }) => {

    const { logo, path, title, description } = adapter;

    const getStatusConfig = (status) => {
        switch (status) {
            case 'installing':
                return { variant: 'info', label: 'Installing' };
            case 'refreshing':
                return { variant: 'warning', label: 'Refreshing' };
            case 'failed':
                return { variant: 'destructive', label: 'Failed' };
            case 'installed':
                return { variant: 'success', label: 'Installed' };
            default:
                return null;
        }
    };

    const statusConfig = getStatusConfig(adapter?.status);

    return (
        <Card>
            <CardContent className="p-5 lg:p-7.5">
                <div className="flex items-center justify-between mb-3 lg:mb-5">
                    <div className="flex items-center justify-center">
                        <img
                            src={logo}
                            className="h-11 shrink-0"
                            alt="image"
                        />
                    </div>
                    <div>
                        {
                            statusConfig &&
                            <Badge variant={statusConfig.variant} appearance="outline">{statusConfig.label}</Badge>
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-1 lg:gap-2.5">
                    <Link
                        to={path || '#'}
                        className="text-base font-medium text-mono hover:text-primary-active"
                    >
                        {title}
                    </Link>
                    <span className="text-sm text-secondary-foreground">
                        {description}
                    </span>
                </div>
            </CardContent>
            <Actions adapter={adapter} />
        </Card>
    );
};

export { IntegrationCard };

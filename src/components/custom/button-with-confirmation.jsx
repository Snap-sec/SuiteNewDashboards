import { useEffect, useState, useCallback } from 'react';
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CircleAlert, CircleCheck, Info, Key, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Input, InputWrapper } from '@/components/ui/input';
import { copyToClipboard } from '@/lib/helpers';


/**
 * Variant config map for confirmation dialogs.
 * Each variant defines: icon, icon container classes, default title, and confirm button variant.
 *
 * Supported variants: "destructive" | "success" | "warning" | "info" | "default"
 */
const CONFIRM_VARIANTS = {
    destructive: {
        icon: <AlertTriangle className="size-5" />,
        containerClass: 'bg-destructive/10 text-destructive',
        title: 'Are you sure?',
        buttonVariant: 'destructive',
        buttonLabel: 'Confirm',
    },
    success: {
        icon: <CircleCheck className="size-5" />,
        containerClass: 'bg-green-500/10 text-green-600',
        title: 'Confirm Action',
        buttonVariant: 'primary',
        buttonLabel: 'Confirm',
    },
    warning: {
        icon: <CircleAlert className="size-5" />,
        containerClass: 'bg-amber-500/10 text-amber-600',
        title: 'Are you sure?',
        buttonVariant: 'primary',
        buttonLabel: 'Confirm',
    },
    info: {
        icon: <Info className="size-5" />,
        containerClass: 'bg-blue-500/10 text-blue-600',
        title: 'Confirm Action',
        buttonVariant: 'primary',
        buttonLabel: 'Confirm',
    },
    default: {
        icon: <AlertTriangle className="size-5" />,
        containerClass: 'bg-destructive/10 text-destructive',
        title: 'Are you sure?',
        buttonVariant: 'primary',
        buttonLabel: 'Confirm',
    },
};

function getVariantConfig(variant) {
    return CONFIRM_VARIANTS[variant] || CONFIRM_VARIANTS.default;
}


function ConfirmDialog({ open, setOpen, onConfirm, confirmButton, dialog, cancelButton, icon, variant = 'default', title }) {
    const config = getVariantConfig(variant);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-start gap-3">
                        <div className={`${config.containerClass} rounded-full flex size-10 shrink-0 items-center justify-center`}>
                            {icon ?? config.icon}
                        </div>
                        <div className="flex flex-col gap-1 text-left">
                            <DialogTitle>{title ?? config.title}</DialogTitle>
                            <DialogDescription>
                                {dialog ?? (
                                    <span>
                                        This action requires confirmation, click confirm to proceed.
                                    </span>
                                )}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter className="-mx-6 -mb-6 mt-6 px-6 py-4 bg-muted/50 border-t sm:justify-end gap-3">
                    <DialogClose asChild>
                        <div onClick={() => setOpen(false)}>
                            {cancelButton || <Button variant="outline">Cancel</Button>}
                        </div>
                    </DialogClose>
                    <div onClick={() => onConfirm()}>
                        {confirmButton || <Button variant={config.buttonVariant}>{config.buttonLabel}</Button>}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}



function ConfirmDialogWithInput({ open, setOpen, confirmInput,showCopyIcon=false, onConfirm, dialog, confirmButton, cancelButton, icon, variant = 'default', title }) {
    const [userInput, setUserInput] = useState('');
    const config = getVariantConfig(variant);

    useEffect(() => {
        if (!open) {
            setUserInput('');
        }
    }, [open]);

    const handleConfirm = () => {
        if (confirmInput == userInput) {
            onConfirm();
            setOpen(false);
        } else {
            toast.error('Confirmation text does not match.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <div className="flex items-start gap-3">
                        <div className={`${config.containerClass} rounded-full flex size-10 shrink-0 items-center justify-center`}>
                            {icon ?? config.icon}
                        </div>
                        <div className="flex flex-col gap-1 text-left">
                            <DialogTitle>{title ?? 'Extra Confirmation Required'}</DialogTitle>
                            <DialogDescription>
                                {dialog ?? (
                                    <span>
                                        This action requires confirmation, click confirm to proceed.
                                    </span>
                                )}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <DialogBody className="mt-4">
                    <div className="w-full flex flex-col items-center justify-center gap-4">
                        <div className="w-full text-left">
                            <p className="text-xs mb-1.5 text-muted-foreground">Enter this below</p>
                            <div className="flex items-center w-full bg-accent rounded-lg p-2">
                                <span className="w-full ml-1 text-sm">
                                    {confirmInput}
                                </span>
                                {showCopyIcon && <Copy
                                    className="cursor-pointer size-4 text-muted-foreground hover:text-primary transition-colors"
                                    onClick={() =>
                                        toast.promise(copyToClipboard(confirmInput), {
                                            success: 'Copied',
                                            error: 'Failed to copy',
                                        })
                                    }
                                />}
                            </div>
                        </div>

                        <InputWrapper>
                            <Key className="size-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder={`Enter "${confirmInput}" to confirm`}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                            />
                        </InputWrapper>
                    </div>
                </DialogBody>
                <DialogFooter className="-mx-6 -mb-6 mt-6 px-6 py-4 bg-muted/50 border-t sm:justify-end gap-3">
                    <DialogClose asChild>
                        <div onClick={() => setOpen(false)}>
                            {cancelButton || <Button variant="outline">Cancel</Button>}
                        </div>
                    </DialogClose>
                    <div onClick={() => handleConfirm()}>
                        {confirmButton || (
                            <Button disabled={userInput !== confirmInput} variant={config.buttonVariant}>
                                Confirm
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}



function ButtonWithConfirm({ children, confirm,showCopyIcon, confirmWithInput, disabled, confirmOnInput, dialog, onConfirm, confirmButton, cancelButton, onClick, confirmVariant = 'default', confirmTitle, ...props }) {

    const [isOpen, setIsOpen] = useState(false);

    // Always ensure modal closes when confirm is performed
    const handleConfirm = useCallback(async (...args) => {
        if (onConfirm) {
            await onConfirm(...args); // support async confirm handlers
        }
        setIsOpen(false); // close the modal
    }, [onConfirm]);

    // set callback either to open modal or run confirm directly
    const callback = useCallback(() => {
        if (confirm) {
            setIsOpen(true);
        } else if (onConfirm) {
            onConfirm();
        }
    }, [confirm, onConfirm]);


    return (
        <div>
            <Button {...props} onClick={callback} disabled={disabled}>
                {children}
            </Button>
            <ConfirmDialog open={isOpen && !confirmWithInput} setOpen={setIsOpen} onConfirm={handleConfirm} confirmButton={confirmButton} cancelButton={cancelButton} dialog={dialog} variant={confirmVariant} title={confirmTitle} />
            <ConfirmDialogWithInput showCopyIcon={showCopyIcon} open={isOpen && confirmWithInput} setOpen={setIsOpen} onConfirm={handleConfirm} confirmInput={confirmOnInput} confirmButton={confirmButton} cancelButton={cancelButton} dialog={dialog} variant={confirmVariant} title={confirmTitle} />
        </div>
    )
}


export { ButtonWithConfirm, ConfirmDialog, ConfirmDialogWithInput };
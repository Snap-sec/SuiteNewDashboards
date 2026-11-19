import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Modal({
  title,
  description,
  trigger,
  children,
  footer,
  open,
  setOpen,
  className = 'sm:max-w-md',
  icon,
  hideCloseIcon = false,
  preventAutofocus = true,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && setOpen !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (val) =>
    isControlled ? setOpen(val) : setInternalOpen(val);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={handleOpenChange}
      onPointerDownOutside={e => e.preventDefault()}
      onEscapeKeyDown={e => e.preventDefault()}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent 
        className={className} 
        close={!hideCloseIcon}
        onOpenAutoFocus={(e) => {
          if (preventAutofocus) {
            e.preventDefault();
          }
        }}
      >
        {icon && (
          <div className='flex justify-center mb-'>
            <div className="overflow-hidden rounded-lg p-3">
              {icon}
            </div>
          </div>
        )}
        {(title || description) && (
          <DialogHeader className="relative text-center">
            {title && <DialogTitle className={icon ? "text-center" : ""}>{title}</DialogTitle>}
            {description && <DialogDescription className={icon ? "text-center" : ""}>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <DialogBody>{children}</DialogBody>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}


export { Modal };
export default Modal;

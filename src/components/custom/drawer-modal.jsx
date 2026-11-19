import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function DrawerModal({
  trigger,
  title = '',
  children,
  footer = null,
  className = '',
  contentClassName = '',
  direction = '',
  width,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalIsOpen;
  const setIsOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalIsOpen;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent
        side={direction === 'end' ? 'right' : (direction || 'right')}
        className={cn(
          "h-[calc(100vh-40px)] m-5 rounded-lg border flex flex-col bg-background p-0 shadow-xl sm:max-w-none fixed top-0 right-0",
          width ? `w-${width}` : "w-[400px]",
          className
        )}
      >
        <SheetHeader className="shrink-0 border-b border-border">
          <SheetTitle className="p-4">{title}</SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-hidden p-0">
          <div className={cn("h-full", contentClassName)}>
            {typeof children === 'function' ? children({ isOpen }) : children}
          </div>
        </SheetBody>

        {footer && (
          <SheetFooter className="shrink-0 border-t border-border w-full p-2 bg-background">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function DetailedHoverPopover({
  popoverTitle = '',
  buttonText,
  popoverContent = null,
  position = 'top',
  trigger = 'hover',
  showBadge = true,
  width,
  height,
  zIndex = 'z-[9999]'
}) {
  const [open, setOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ side: position, align: 'center' });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 16; // Standard gap for popovers

    let newSide = position;
    let newAlign = 'center';

    // Check if there's enough space in the preferred direction
    if (position === 'top' && triggerRect.top < 200) {
      newSide = 'bottom';
    } else if (position === 'bottom' && triggerRect.bottom + 200 > viewportHeight) {
      newSide = 'top';
    } else if (position === 'left' && triggerRect.left < 300) {
      newSide = 'right';
    } else if (position === 'right' && triggerRect.right + 300 > viewportWidth) {
      newSide = 'left';
    }

    // Adjust alignment based on position relative to viewport edges
    if (newSide === 'top' || newSide === 'bottom') {
      if (triggerRect.left < 150) {
        newAlign = 'start';
      } else if (triggerRect.right > viewportWidth - 150) {
        newAlign = 'end';
      }
    } else if (newSide === 'left' || newSide === 'right') {
      if (triggerRect.top < 100) {
        newAlign = 'start';
      } else if (triggerRect.bottom > viewportHeight - 100) {
        newAlign = 'end';
      }
    }

    setPopoverPosition({ side: newSide, align: newAlign });
  };

  useEffect(() => {
    if (open) {
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition);
    }

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [open, position]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setOpen(true);
    }
  };

  const handleMouseLeave = (e) => {
    if (trigger === 'hover') {
      // Small delay to prevent flickering when moving between trigger and content
      setTimeout(() => {
        const triggerElement = triggerRef.current;
        const popoverElement = document.querySelector('[data-radix-popper-content-wrapper]');

        if (triggerElement && popoverElement) {
          const isHoveringTrigger = triggerElement.matches(':hover');
          const isHoveringPopover = popoverElement.matches(':hover');

          if (!isHoveringTrigger && !isHoveringPopover) {
            setOpen(false);
          }
        }
      }, 100);
    }
  };

  // Resolve content — supports both static JSX and a render-function (close) => JSX
  const resolvedContent =
    typeof popoverContent === 'function'
      ? popoverContent(() => setOpen(false))
      : popoverContent;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {showBadge ? (
            <Badge
              variant="default"
              appearance="outline"
              onClick={() => trigger === 'click' && setOpen(!open)}
              className="cursor-pointer px-2 py-0 text-[9px]"
              size="sm"
            >
              {buttonText}
            </Badge>
          ) :
            <div className="w-full">{buttonText}</div>
          }

        </div>
      </PopoverTrigger>

      <PopoverContent
        ref={popoverRef}
        className={`${width ? width : 'max-w-[300px]'} text-sm space-y-2 p-0 bg-background border shadow-lg ${zIndex}`}
        side={popoverPosition.side}
        align={popoverPosition.align}
        sideOffset={8}
        alignOffset={0}
        avoidCollisions={true}
        collisionPadding={16}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // Close popover when a child interaction (e.g. opening a dialog) starts
        onPointerDownOutside={() => setOpen(false)}
      >
        {/* Title */}
        {popoverTitle && (
          <p className="font-medium border-b p-2">{popoverTitle}</p>
        )}

        {/* Content */}
        <div className={`${height ? height : 'max-h-[250px]'} overflow-y-auto p-2`}>
          {resolvedContent}
        </div>
      </PopoverContent>
    </Popover>
  );
}


export default DetailedHoverPopover;


import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ChevronDownIcon, RefreshCcw } from "lucide-react";

function FloatingCard({
  children,
  updateButton,
  position = "bottom-center",
  className = "",
}) {

  const getPositionClasses = () => {
    const isSticky = position === 'sticky-bottom';
    const baseClasses = `${isSticky ? 'sticky' : 'fixed'} z-10`;

    switch (position) {
      case 'bottom-left':
        return `${baseClasses} bottom-6 left-6`;
      case 'bottom-center':
        return `${baseClasses} bottom-6 left-1/2 transform -translate-x-1/2`;
      case 'bottom-right':
        return `${baseClasses} bottom-6 right-6`;
      case 'sticky-bottom':
        return `${baseClasses} bottom-0 left-0 right-0 w-full`;
      case 'top-left':
        return `${baseClasses} top-6 left-6`;
      case 'top-center':
        return `${baseClasses} top-6 left-1/2 transform -translate-x-1/2`;
      case 'top-right':
        return `${baseClasses} top-6 right-6`;
      default:
        return `${baseClasses} bottom-6 left-1/2 transform -translate-x-1/2`;
    }
  };



  return (
    <Card
      className={`
        ${getPositionClasses()} 
        ${position === 'sticky-bottom' ? 'w-full mt-2 max-w-full rounded-none border-t border-x-0 ml-0' : 'w-auto min-w-[75vw] max-w-[75vw] bg-accent rounded-lg shadow-lg ml-28'}
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-4 p-3">
        <div className="relative flex items-center gap-4 flex-1">
          {children && <div className="flex items-center gap-2 w-full">{children}</div>}
        </div>

        {updateButton && (
          <div className="flex items-center border-l border-gray-200 dark:border-gray-600 pl-4">
            <Button
              variant="primary"
              onClick={updateButton.onClick}
              disabled={updateButton.disabled}
              className="flex items-center gap-2"
            >
              {updateButton.icon || <RefreshCcw className="w-4 h-4" />}
              {updateButton.text}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default FloatingCard;

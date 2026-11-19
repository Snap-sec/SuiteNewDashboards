import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function CustomTooltip({ children, text, isTooltipTextHidden = false, ...props }) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen} >
      <TooltipTrigger
        asChild
        tabIndex={-1}
        {...props}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </TooltipTrigger>
      {open && <TooltipContent className={isTooltipTextHidden && "hidden"}>{text}</TooltipContent>}
    </Tooltip>
  );
}

CustomTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};

export { CustomTooltip };

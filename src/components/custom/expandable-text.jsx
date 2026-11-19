import { useState } from 'react';
import { cn } from '@/lib/utils';

export const ExpandableText = ({ text, maxChars = 130, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  if (text.length <= maxChars) {
    return <p className={cn(className)}>{text}</p>;
  }

  return (
    <p className={cn(className)}>
      {isExpanded ? text : `${text.substring(0, maxChars)}`}
      <span
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="cursor-pointer hover:underline font-bold ml-1"
      >
        {isExpanded ? ' show less' : '...'}
      </span>
    </p>
  );
};

export default ExpandableText;

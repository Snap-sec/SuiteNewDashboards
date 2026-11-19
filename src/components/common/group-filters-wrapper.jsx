import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FilterGroupWithShowMore = ({ children, visibleCount = 3 }) => {
  const [expanded, setExpanded] = useState(false);

  const items = Array.isArray(children) ? children : [children];
  const visibleItems = expanded ? items : items.slice(0, visibleCount);
  const hiddenCount = items.length - visibleCount;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {visibleItems.map((child, i) => (
        <div key={i}>{child}</div>
      ))}

      {!expanded && hiddenCount > 0 && (
        <Button size="sm" variant="outline" onClick={() => setExpanded(true)}>
         <ChevronDown className=' text-primary'/> {hiddenCount} More
        </Button>
      )}

      {expanded && items.length > visibleCount && (
        <Button size="sm" variant="ghost" onClick={() => setExpanded(false)}>
         <ChevronUp className=' text-primary' /> Show less
        </Button>
      )}
    </div>
  );
};

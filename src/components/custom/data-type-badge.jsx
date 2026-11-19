import { Badge } from '@/components/ui/badge';
import { Calendar, Hash, List, ToggleLeft, Type, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export const getDataTypeIcon = (id) => {
  const map = {
    text: Type,
    number: Hash,
    boolean: ToggleLeft,
    date: Calendar,
    dropdown: List,
    multiselect: CheckSquare,
    select: List,
  };
  return map[id] || Type;
};

const DataTypeBadge = ({ type, label, className }) => {
  const TypeIcon = getDataTypeIcon(type);
  const displayLabel = label || type;

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1.5 font-normal px-2 py-0.5 w-fit", className)}>
      <TypeIcon className="size-3.5 text-muted-foreground" />
      {displayLabel}
    </Badge>
  );
};

export default DataTypeBadge;

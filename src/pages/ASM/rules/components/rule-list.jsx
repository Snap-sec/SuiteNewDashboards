import { useEffect, useState } from 'react';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useUpdateAsmRulePriorityMutation } from '@/services/asm/ruleApi';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationView from '@/components/custom/pagination';
import RuleItem from './rule-item';

function RuleList({
  data,
  isExecutingRuleSet,
  loading,
  pagination,
  onPaginationChange = () => { },
}) {
  const [items, setItems] = useState(data?.results || []);

  const [updateRulePriority] = useUpdateAsmRulePriorityMutation();

  useEffect(() => {
    if (data?.results) {
      // console.log("Updating items with new rules", data.results);
      setItems(data.results);
    }
  }, [data?.results]);

  const updatePriority = (ruleId, priority) => {
    // toast.promise(
    updateRulePriority({ ruleId: ruleId, priority: priority }).unwrap();
    //   {
    //     loading: "Updating Priority",
    //     error: "Failed to update priority",
    //     success: "Priority updated",
    //   }
    // );
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i._id === active.id);
    const newIndex = items.findIndex((i) => i._id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    updatePriority(active.id, newIndex + 1);
    updatePriority(over.id, oldIndex + 1);
  };

  const total = items.length;
  const priorities = Array.from({ length: total + 1 }, (_, index) => ({
    label: index + 1,
    value: index + 1,
  }));

  return (
    <div className="w-full flex flex-col gap-4">
      {loading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-[70px]" />
        ))
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i._id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item, index) => (
              <RuleItem
                key={item._id}
                rule={item}
                priorities={priorities}
                index={index}
                isExecutingRuleSet={isExecutingRuleSet}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      <PaginationView
        currentPage={data?.page}
        totalPages={data?.totalPages || 1}
        onPageChange={(newPage) => {
          onPaginationChange((prev) => ({
            ...prev,
            pageIndex: newPage - 1,
          }));
        }}
        className="flex justify-end w-full"
      />
    </div>
  );
}

export default RuleList;

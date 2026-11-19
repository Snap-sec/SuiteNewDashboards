import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditSkillModal from '../../skills/components/EditSkillModal';

export default function SkillDetailsHeader({
  skill,
  title = 'Skill Details',
  description = '',
  onUpdateSkill,
  isUpdatingSkill = false,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentSkill = skill || {
    id: skill?._id || skill?.id,
    name: title,
    description: description,
  };

  return (
    <>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl lg:text-2xl font-semibold text-mono tracking-tight text-foreground">
              {title}
            </h2>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setIsEditModalOpen(true)}
              title="Edit skill"
            >
              <Edit className="size-3.5" />
            </Button>
          </div>
          {description ? (
            <p className="text-sm text-secondary-foreground max-w-3xl">
              {description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/70 italic max-w-3xl">
              No description provided. Click edit to add a description.
            </p>
          )}
        </div>
      </div>

      <EditSkillModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        skill={currentSkill}
        onUpdateSkill={onUpdateSkill}
        isLoading={isUpdatingSkill}
      />
    </>
  );
}

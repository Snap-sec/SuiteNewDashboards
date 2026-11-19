import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Plus } from 'lucide-react';

export default function AssignedSkillsCard({
  skills = [],
  onRemoveSkill,
  onOpenAddSkillsModal,
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center w-full justify-between gap-2">
          <CardTitle>
            Assigned Skills & Capabilities
          </CardTitle>
          {onOpenAddSkillsModal && skills.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenAddSkillsModal}
              className="gap-1.5 h-8 text-2sm"
            >
              <Plus className="size-3.5" />
              Add Skills
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.map((skill) => {
              const SkillIcon = skill.icon || Sparkles;
              return (
                <div
                  key={skill.id}
                  className="border border-border rounded-xl p-3 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <SkillIcon className="size-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-2sm font-semibold text-foreground truncate">
                        {skill.name}
                      </span>
                      <span className="text-2xs text-muted-foreground truncate">
                        {skill.desc}
                      </span>
                    </div>
                  </div>

                  {onRemoveSkill && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => onRemoveSkill(skill.id)}
                    >
                      <X className="size-3.5" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Sparkles className="size-7 stroke-1 opacity-40" />
            <p className="text-2sm">No skills assigned to this agent yet.</p>
            {onOpenAddSkillsModal && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenAddSkillsModal}
                className="gap-1.5 mt-1"
              >
                <Plus className="size-3.5" />
                Add Skills
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

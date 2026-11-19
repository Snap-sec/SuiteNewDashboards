import { useState } from 'react';
import { Edit, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateThreatDetailsByIdMutation } from '../../../../../services/tm/threatApi';

function ExplinationCard({
  threatId,
  title,
  summary,
  updateField,
  allowEditing = false,
  threat,
}) {
  const [editing, setEditing] = useState(false);

  const [value, setValue] = useState(
    (threat && threat[updateField]) || summary,
  );

  const [updateThreat, { isLoading: isUpdatingThreat }] =
    useUpdateThreatDetailsByIdMutation();

  const handleUpdate = () => {
    let parsedValue = value;

    if (
      (updateField == 'mitigations' || updateField == 'references') &&
      !Array.isArray(parsedValue)
    ) {
      parsedValue = value?.split(',');
    }

    toast.promise(
      updateThreat({
        threatId,
        updates: { [updateField]: parsedValue },
      }).unwrap(),
      {
        loading: `Updating threat ${updateField == 'mitigations' ? 'mitigations' : updateField == 'explaination' ? 'explaination' : 'references'}`,
        error: `Failed to update threat ${updateField == 'mitigations' ? 'mitigations' : updateField == 'explaination' ? 'explaination' : 'references'}`,
        success: (res) => {
          setEditing(false);
          return `Threat ${updateField == 'mitigations' ? 'mitigations' : updateField == 'explaination' ? 'explaination' : 'references'} updated`;
        },
      },
    );
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 lg:gap-7.5">
        <div className="w-full flex flex-col items-start gap-2.5">
          <div className="w-full text-base font-semibold text-mono hover:text-primary">
            <div className="w-full flex items-center justify-between">
              <span>{title}</span>
              {editing && allowEditing ? (
                <Button
                  disabled={isUpdatingThreat}
                  variant="ghost"
                  onClick={() => handleUpdate()}
                >
                  <Save />
                </Button>
              ) : allowEditing ? (
                <Button
                  disabled={isUpdatingThreat}
                  variant="ghost"
                  onClick={() => setEditing(true)}
                >
                  <Edit />
                </Button>
              ) : (
                ''
              )}
            </div>
          </div>
          {editing && allowEditing ? (
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          ) : (
            <p className="text-sm text-secondary-foreground">{summary}</p>
          )}
        </div>
        <span className="hidden not-last:block not-last:border-b border-b-border"></span>
      </CardContent>
    </Card>
  );
}

export default ExplinationCard;

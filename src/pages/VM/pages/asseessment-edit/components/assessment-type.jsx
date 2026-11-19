import { useId } from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/auth/context/auth-context';

const items = [
  {
    id: 1,
    title: 'Black Box',
    value: "blackBox",
    description: 'Invite selected people via email.',
    checked: false,
  },
  {
    id: 2,
    title: 'Grey Box',
    value: "greyBox",
    description: 'Create a pubic link for your report.',
    checked: false,
  },
  {
    id: 3,
    title: 'White Box',
    value: "whiteBox",
    description: 'Reports will be visible only for everyone.',
    checked: false,
  },
];

const AssessmentType = ({ assessment={}, limit, className, onUpdate }) => {
  const { user } = useAuth();

  const id1 = useId();
  const [options, setOptions] = useState(items?.map(i => {
    if (i.value == assessment.type) {
      return { ...i, checked: true };
    }
    else {
      return { ...i }
    }
  }));

  const handleCheck = (id, check) => {
    let newOptions = options.map(op => {
      if (op.id == id) {
        return {
          ...op,
          checked: check
        }
      }

      return {
        ...op,
        checked: false
      }
    });

    setOptions(newOptions);

    // update the assessment
    onUpdate({ type: options.find(op => op.id == id)?.value })
  }

  const renderItem = (item, index) => {
    return (
      <CardContent key={index} className="border-b border-border">
        <RadioGroup
          defaultValue="intermediate"
          className="flex items-center justify-between gap-2.5"
        >
          <div className="flex items-center w-full justify-between space-x-2"  onClick={() => { if (!item.checked) handleCheck(item.id, true) }}>
            <Label
              htmlFor={id1}
              variant="secondary"
              className="flex flex-col justify-center gap-1.5"
            >
              <span className="leading-none font-medium text-sm text-mono">
                {item.title}
              </span>
              <span className="text-sm text-secondary-foreground">
                {item.description}
              </span>
            </Label>
            <RadioGroupItem disabled={user.role === "Auditor"} id={id1} value="beginner" checked={item.checked}  />
          </div>
        </RadioGroup>
      </CardContent>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Assessment Type</CardTitle>
      </CardHeader>
      {options.map((item, index) => {
        if (limit === undefined || index < limit) {
          return renderItem(item, index);
        }
        return null;
      })}
    </Card>
  );
};

export { AssessmentType };

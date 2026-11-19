import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConditionGroup from './condition-group';

export const RuleConditionsForm = ({
  control,
  schema,
  watch,
  setValue,
}) => {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Matching Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <ConditionGroup
          control={control}
          name="conditions"
          schema={schema}
          watch={watch}
          setValue={setValue}
          isRoot={true}
        />
      </CardContent>
    </Card>
  );
};

export default RuleConditionsForm;

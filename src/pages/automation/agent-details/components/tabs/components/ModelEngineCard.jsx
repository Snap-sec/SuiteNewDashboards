import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Select from '@/components/custom/select';

export default function ModelEngineCard({
  model,
  setModel,
  modelOptions = [],
  temperature,
  setTemperature,
  maxSteps,
  setMaxSteps,
  handleDiscard,
  isUpdating,
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Model Engine
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Foundation LLM Select */}
        <div className="space-y-1.5">
          <Label className="text-2sm font-medium text-foreground">
            Foundation LLM
          </Label>
          <Select
            value={model}
            options={modelOptions}
            onChange={(opt) => {
              const chosen =
                typeof opt === 'object' && opt !== null
                  ? opt.value || opt.id
                  : opt;
              setModel(chosen || '');
            }}
            allowCustomValue={true}
            placeholder="Select foundation model..."
            className="w-full text-sm"
          />
        </div>

        {/* Temperature Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-2sm font-medium text-foreground">
              Temperature
            </Label>
            <span className="text-sm font-semibold text-foreground">
              {temperature.toFixed(1)}
            </span>
          </div>
          <Slider
            value={[temperature]}
            min={0}
            max={1}
            step={0.05}
            onValueChange={([val]) => setTemperature(val)}
            className="w-full"
          />
          <p className="text-2xs text-muted-foreground">
            Deterministic output prioritized for compliance and auditing.
          </p>
        </div>

        {/* Max Context Steps Slider */}
        {/* <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-2sm font-medium text-foreground">
              Max Context Steps
            </Label>
            <span className="text-sm font-semibold text-foreground">
              {maxSteps}
            </span>
          </div>
          <Slider
            value={[maxSteps]}
            min={5}
            max={50}
            step={1}
            onValueChange={([val]) => setMaxSteps(val)}
            className="w-full"
          />
          <p className="text-2xs text-muted-foreground">
            Ceiling on Chain-of-Thought loop iterations.
          </p>
        </div> */}

        {/* Actions: Discard & Save */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleDiscard}
          >
            Discard
          </Button>
          <Button
            type="submit"
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

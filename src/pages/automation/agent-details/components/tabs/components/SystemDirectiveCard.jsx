import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function SystemDirectiveCard({
  prompt,
  setPrompt,
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          System Directive & Persona
        </CardTitle>
      </CardHeader>

      <CardContent className="p-2">
        <Textarea
          rows={11}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter system prompt and agent persona..."
          className="font-mono text-sm leading-relaxed bg-muted/20 border-border resize-y min-h-[225px]"
        />

        {/* Subfooter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-2sm text-muted-foreground pt-1">
          <span className="font-mono text-2xs">
            Variables available:{' '}
            <span className="text-foreground">{'{{repo.name}}'}</span>,{' '}
            <span className="text-foreground">{'{{pr.number}}'}</span>,{' '}
            <span className="text-foreground">{'{{branch.base}}'}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

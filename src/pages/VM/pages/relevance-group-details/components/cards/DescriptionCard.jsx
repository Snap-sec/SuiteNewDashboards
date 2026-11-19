import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function DescriptionCard({ description }) {
  return (
    <Card className="shadow-xs border-border">
      <CardHeader className="flex flex-row items-center justify-start gap-2.5 space-y-0 py-4">
        <FileText size={18} className="text-muted-foreground" />
        <CardTitle className="text-base text-foreground">
          Group Description
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {description ? (
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No description provided.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

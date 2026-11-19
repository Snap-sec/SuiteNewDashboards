import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function ScaPlaceholderPage({ title, description }) {
  return (
    <div className="px-6 py-6 flex flex-col gap-6">
      <Helmet>
        <title>SAST | {title}</title>
      </Helmet>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <Card className="min-h-[350px] flex items-center justify-center border-dashed">
        <CardContent className="flex flex-col items-center justify-center text-center p-8">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Construction className="size-6" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">{title} Module</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            This sub-page has been structured and routed. Component logic can be integrated here next.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

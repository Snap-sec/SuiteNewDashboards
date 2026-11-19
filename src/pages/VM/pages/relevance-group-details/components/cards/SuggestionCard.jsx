
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SuggestionCard({ suggestion }) {
  return (
    <Card className="shadow-xs ">
      <CardHeader className="flex flex-row items-center justify-start gap-2.5 space-y-0 py-4">
        <CardTitle>Recommended Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {suggestion ? (
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {suggestion}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No suggestions available for this group.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

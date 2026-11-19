import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutCard({ about }) {
  return (
    <Card className="shadow-xs border-border">
      <CardHeader className="flex flex-row items-center justify-start gap-2.5 space-y-0 py-4">
        <CardTitle className="">
          About
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {about ? (
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {about}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No detailed "about" information is available for this group.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

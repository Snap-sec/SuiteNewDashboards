import { Zap } from 'lucide-react';
import { Card, CardDescription } from '@/components/ui/card';

function RunImmediatly() {
  return (
    <Card className={' p-2 flex flex-row gap-2'}>
      <Zap />
      <CardDescription>
        This scan will start as soon as possible. The scanner will begin
        processing immediately after creation.
      </CardDescription>
    </Card>
  );
}

export default RunImmediatly;

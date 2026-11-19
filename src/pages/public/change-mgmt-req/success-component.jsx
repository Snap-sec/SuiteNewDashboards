import { Check, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Success() {
  return (
    <div className="flex items-center h-screen justify-center flex-col gap-3 p-4 rounded-md w-full">
      <Check className="text-green-600 h-28 w-28" />
      <span>Change Request created successfully!</span>
      <Button variant="primary" onClick={() => window.location.reload()} className=" mt-5">
        Create Another Request
      </Button>
    </div>
  );
}

export default Success;

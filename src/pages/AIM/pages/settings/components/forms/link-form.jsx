import { useState } from 'react';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LinkForm = ({ title = '', link = '', description = '' }) => {
  const [linkInput, setLinkInput] = useState(link);

  const [copiedLink, setCopiedLink] = useState(null);

  const handleCopy = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(link);
      toast.success('URL Copied');

      setTimeout(() => setCopiedLink(null), 2000); // Reset after 2s
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-5 p-8">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-32">Link</Label>

          <div className="flex flex-col items-start grow gap-5">
            <InputWrapper>
              <Input
                disabled
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
              />

              <Button
                variant="dim"
                mode="icon"
                className="-me-2"
                onClick={() => handleCopy(link)}
              >
                {copiedLink === link ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </Button>
            </InputWrapper>
{/* 
            <Button variant="outline">
              <RefreshCw size={12} />
              Reset Link
            </Button> */}
          </div>
        </div>
        <p className="text-foreground text-sm">{description}</p>
      </CardContent>

      {/* <CardFooter className="justify-center">
        <Button>
          <Link to="#">Invite People</Link>
        </Button>
      </CardFooter> */}
    </Card>
  );
};

export default LinkForm;

import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/helpers';
import { useRefreshJoinLinkMutation } from '@/services/auth/orgApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const InviteWithLink = ({ joinlink }) => {
  const [refresh] = useRefreshJoinLinkMutation();

  const handleCopy = () => {
    copyToClipboard(joinlink?.data?.link);
    toast.success('Copied!');
  };

  const handleRefresh = () => {
    toast.promise(refresh().unwrap(), {
      loading: `${joinlink?.data?.link ? 'Resetting' : 'Generating'} the link...`,
      success: (data) =>
        data?.message ||
        `Link has been ${joinlink?.data?.link ? 'resetted' : 'Generated'}`,
      error: (err) =>
        err?.data?.message ||
        err?.message ||
        `Failed to ${joinlink?.data?.link ? 'reset' : 'Generate'} the link`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Invite with Link</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <>
          {joinlink?.data?.link ? (
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <Label className="flex w-full max-w-32">Link</Label>
              <div className="flex flex-col items-start grow gap-5">
                <InputWrapper>
                  <Input type="text" value={joinlink?.data?.link} readOnly />
                  <Button
                    variant="dim"
                    mode="icon"
                    className="-me-2"
                    onClick={handleCopy}
                  >
                    <Copy size={16} />
                  </Button>
                </InputWrapper>
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw size={12} />{' '}
                  Reset Link
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw size={12} />{' '}
                Generate Link
              </Button>
            </div>
          )}

          <p className="text-sm text-red-600">
            **Security Alert: This Link should only be used by authorized
            personnel. Keep it secure.
          </p>
        </>
      </CardContent>
    </Card>
  );
};

export { InviteWithLink };

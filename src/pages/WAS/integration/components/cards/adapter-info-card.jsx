import { useId, useState } from 'react';
import { LogOut, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useDeleteApisecIntegrationMutation } from '@/services/apisec/integrationApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { timeAgo } from '@/lib/helpers';
import DeleteActvAdapterBtn from './actions/delete-adapter';
import RefreshActvAdapterBtn from './actions/refresh-adapter';

const AdapterInfoCard = ({
  id,
  logo,
  logoUrl,
  path,
  error,
  name, // used name in both adapters and active adapters
  description,
  installed,
  preinstall,
  postinstall,

  // active adapter props
  configName,
  lastRefresh,
  status,
}) => {
  const Id = useId();
  const [deleteIntegration, { isLoading: isDeleting }] =
    useDeleteApisecIntegrationMutation();

  const [keepAssets, setKeepAssets] = useState(false);

  const deleteActvAdapter = () => {
    const integrationId = id;
    toast.promise(deleteIntegration({ integrationId }).unwrap(), {
      loading: 'Deleting an Adapter',
      success: 'Adapter Deleted Successfully',
      error: 'Failed to delete adapter',
    });
  };


const isRecentlyStarted = (lastRefresh) => {
  const now = new Date();
  const refreshDate = new Date(lastRefresh);
  const diffMs = now - refreshDate;
  const diffMinutes = Math.floor(diffMs / 60000);
  // Return true if less than or equal to 1 minute ago
  return diffMinutes < 2; // covers 0 and 1 minute
};

  return (
    <Card>
      <CardContent className="p-5 lg:p-7.5">
        <div className="flex items-center justify-between mb-3 lg:mb-5">
          <div className="flex items-center justify-center">
            <img
              src={logo ? toAbsoluteUrl(`/media/brand-logos/${logo}`) : logoUrl}
              className="h-11 shrink-0"
              alt="image"
            />
          </div>
          <div className="btn btn-sm btn-icon btn-clear btn-light">
            
            { name === 'Mannual' ? (
                <Badge variant="success" appearance="outline">
                  Installed
                </Badge>
              ) : (
                <>
                  {status === 'Installed' && (
                    <Badge variant="success" appearance="outline">
                      Installed
                    </Badge>
                  )}

                  {status === 'Failed' && (
                    <Badge
                      shape="circle"
                      variant="destructive"
                      appearance="outline"
                    >
                      <CustomTooltip text={error || 'No error message available'}>
                        Failed to install
                      </CustomTooltip>
                    </Badge>
                  )}

                  {status === 'InProgress' && isRecentlyStarted(lastRefresh) && (
                    <Badge>Installing...</Badge>
                  )}

                  {status === 'InProgress' && !isRecentlyStarted(lastRefresh) && (
                    <Badge
                      shape="circle"
                      variant="destructive"
                      appearance="outline"
                    >
                      Failed to install
                    </Badge>
                  )}
                </>
              )}

          </div>
        </div>

        <div className="flex flex-col gap-1 lg:gap-2.5">
          {/* <Link
            to={path}
            className="text-base font-medium text-mono hover:text-primary-active"
          >
            
          </Link> */}
          <p className="text-base font-medium text-mono hover:text-primary-active">
              {name}
          </p>
        

          <span className="text-sm text-secondary-foreground">
            {name === "Mannual" ? 
              "Importing assets to AIM manually" 
              :
              description || configName?.slice(0, 50)
            }
          </span>

          {lastRefresh && (
            <span className="text-sm text-secondary-foreground">
              {timeAgo(lastRefresh)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className=" gap-1 lg:gap-3 items-center py-3.5">
        {installed ? postinstall : preinstall}

        <AuthorityGuard roles={['Admin']}>
          {(status == 'Installed' || status == 'Failed') && (
            // <DeleteActvAdapterBtn adapterId={id} deletingAdapterName={name} />
            <ButtonWithConfirm
              disabled={isDeleting}
              // variant="destructive"
              variant="outline"
              confirm={true}
              // confirmWithInput={true}
              // confirmOnInput={`delete-${deletingAdapterName}`}
              onConfirm={() => deleteActvAdapter()}
              confirmButton={<Button variant="primary">Proceed</Button>}
              cancelButton={<Button variant="outline">Cancel</Button>}
              dialog={
                <div className=" flex flex-col items-center">
                  <p>Are you sure want to delete this adapter?</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id={Id}
                      checked={keepAssets}
                      onCheckedChange={(value) => setKeepAssets(!!value)}
                    />
                    <Label htmlFor={Id}>Keep its assets</Label>
                  </div>
                </div>
              }
            >
              <Trash /> Delete
            </ButtonWithConfirm>
          )}
        </AuthorityGuard>
        {(status === 'Installed' || status == 'Failed') && (
          <RefreshActvAdapterBtn adapterId={id} />
        )}
      </CardFooter>
    </Card>
  );
};

export { AdapterInfoCard };

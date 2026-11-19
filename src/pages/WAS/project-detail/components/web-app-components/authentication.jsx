import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { CodeSquare, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/custom/file-upload';
import { CustomTooltip } from '../../../../../components/custom/tooltip';
import { Button } from '../../../../../components/ui/button';
import { Skeleton } from '../../../../../components/ui/skeleton';
import { formatFileSize } from '../../../../../lib/helpers';
import { useUploadProjectAuthScriptMutation } from '../../../../../services/apisec/projectsApi';

const Authentication = forwardRef(function Authentication(
  { data, isLoading },
  ref,
) {
  const { id } = useParams();
  const [uploadPlaywrightAuthScript, { isLoading: isUploadingAuthScript }] =
    useUploadProjectAuthScriptMutation();

  const [authDetectionStr, setAuthDetectionStr] = useState('');
  const [files, setFiles] = useState([]);
  const authDetectionRef = useRef('');

  // Used to conditionally render the file upload component, if file is already upoaded then hide this otherwise show file info
  const [showFileUploadComponent, setShowFileUploadComponent] = useState(true);

  useImperativeHandle(ref, () => ({
    getData: () => ({
      authenticationScript: files,
      authDetectionLogic: authDetectionRef.current,
    }),
  }));

  useEffect(() => {
    authDetectionRef.current = authDetectionStr;
  }, [authDetectionStr]);

  useEffect(() => {
    if (data?.data?.configuration?.auth_success_string) {
      setAuthDetectionStr(data?.data?.configuration?.auth_success_string);
    }

    if (data?.data?.authScript) setShowFileUploadComponent(false);
  }, [data?.data]);

  const handleFilesChange = async (files) => {
    if (!files?.length) return;

    const file = files[0];

    // optional validation
    if (!file.name.endsWith('.js')) {
      toast.error('Please upload a .js file');
      return;
    }

    toast.promise(
      uploadPlaywrightAuthScript({
        file,
        projectId: id,
      }).unwrap(),
      {
        loading: 'Uploading Playwright auth script..',
        success: () => {
          setShowFileUploadComponent(false);
          return 'Auth script uploaded successfully';
        },
        error: 'Error uploading Auth script',
      },
    );
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div>
        <p className="text-sm mb-3">Playwright Authentication Script</p>
        {isLoading && (
          <div className="flex items-center gap-4 p-3 border rounded-lg">
            {/* Icon skeleton */}
            <div className="flex-shrink-0">
              <Skeleton className="w-12 h-12 rounded" />
            </div>

            {/* Text skeletons */}
            <div className="flex-grow min-w-0 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>

            {/* Button skeleton */}
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        )}

        {!isLoading && showFileUploadComponent && (
          <div className=" flex items-center gap-2">
            <FileUpload
              onFilesChange={handleFilesChange}
              disabled={isUploadingAuthScript}
              variant="compact"
            />

            {data?.data?.authScript && (
              <CustomTooltip text={'Cancel Upload again'}>
                <X
                  className=" text-red-500 h-5 w-5 cursor-pointer"
                  onClick={() => setShowFileUploadComponent(false)}
                />
              </CustomTooltip>
            )}
          </div>
        )}

        {/* Show alredy selected js file info */}
        {!isLoading && !showFileUploadComponent && (
          <div className="flex items-center gap-4 p-3 border rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                {<CodeSquare />}
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-medium truncate">
                {data?.data?.authScript?.original_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(data?.data?.authScript?.file_size || 0)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFileUploadComponent(true)}
              // className="text-muted-foreground hover:text-destructive"
            >
              Upload again
            </Button>
          </div>
        )}
      </div>

      {/* <div>
        <p className="text-sm mb-1">Auth Detection Logic (String Match)</p>
        <Input
          type="text"
          value={authDetectionStr}
          placeholder="e.g., 'Logout', 'Welcome', or response text to confirm authentication"
          onChange={(e) => setAuthDetectionStr(e.target.value)}
        />
        <p className="text-xs flex items-center gap-2 font-normal text-muted-foreground">
          String to detect in the response to verify successful authentication
        </p>
      </div> */}
    </div>
  );
});

export default Authentication;

import { useState } from 'react';
import {
  Download,
  Eye,
  Image,
  Music,
  Paperclip,
  Video,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import appConfig from '@/config/appConfig';
import { CustomTooltip } from '@/components/custom/tooltip';

const AttachmentPreview = ({ id, name, type, children }) => {


  console.log('AttachmentPreview props:', { id, name, type });

  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Ensure type is always a valid string before calling `startsWith()`
  const safeType = type || ''; // Fallback to an empty string if `type` is undefined

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return <Image size={18} className="text-blue-500" />;
    if (type?.startsWith('video/')) return <Video size={18} className="text-purple-500" />;
    if (type?.startsWith('audio/')) return <Music size={18} className="text-green-500" />;
    return <Paperclip size={18} className="text-gray-500" />;
  };

  const canPreview = (type) =>
    type?.startsWith('image/') ||
    type?.startsWith('video/') ||
    type?.startsWith('audio/');

  const fileUrl = id ? `${appConfig.BASE_URL}/csm/uploads/${id}` : '';

  const getPreviewContent = () => {
    if (!fileUrl) return null;

    if (canPreview(safeType)) {
      if (safeType.startsWith('image/')) {
        return (
          <img
            src={fileUrl}
            alt={name}
            className="max-w-full max-h-[80vh] object-contain mx-auto"
          />
        );
      }

      if (safeType.includes('pdf')) {
        return <iframe src={fileUrl} className="w-full h-[80vh]" title={name} />;
      }
    }

    return (
      <div className="text-center p-8">
        <div className="mb-4">{getFileIcon(safeType)}</div>
        <p className="text-sm text-muted-foreground">Preview not available for this file type</p>
        <Button asChild className="mt-4">
          <a href={fileUrl} download={name}>
            <Download size={16} className="mr-2" /> Download File
          </a>
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      ) : (
        <CustomTooltip text="Preview Evidence">
          <DialogTrigger asChild>
            <Button variant="ghost" mode="icon">
              <Eye size={10} color="gray" />
            </Button>
          </DialogTrigger>
        </CustomTooltip>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex flex-col gap-4">
          {/* Header section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getFileIcon(safeType)}
              <h3 className="font-medium truncate">{name}</h3>
            </div>

            <div className="flex items-center gap-2">
              {(safeType.startsWith('image/') || safeType.includes('pdf')) && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom((z) => z + 0.1)}
                  >
                    <ZoomIn size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}
                  >
                    <ZoomOut size={16} />
                  </Button>
                </>
              )}

              <Button asChild variant="default" size="sm">
                <a href={fileUrl} download={name}>
                  <Download size={14} className="mr-1" /> Download
                </a>
              </Button>
            </div>
          </div>

          {/* Scalable content */}
          <div
            style={{
              display: 'inline-block',
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.2s ease',
            }}
          >
            {getPreviewContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentPreview;

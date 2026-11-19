import { useState } from 'react';
import {
  Download,
  Eye,
  FileText,
  Image,
  Music,
  Paperclip,
  Video,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import appConfig from '@/config/appConfig';

const AttachmentDetails = ({ id, name = 'Unnamed File', type = '', size = 0 }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image size={22} className="text-blue-500" />;
    if (type.startsWith('video/')) return <Video size={20} className="text-purple-500" />;
    if (type.startsWith('audio/')) return <Music size={20} className="text-green-500" />;
    if (type.includes('pdf')) return <FileText size={20} className="text-red-500" />;
    return <Paperclip size={20} className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const canPreview = (type) =>
    type.startsWith('image/') ||
    type.startsWith('video/') ||
    type.startsWith('audio/') ||
    type.includes('pdf');

  const fileUrl = `${appConfig.BASE_URL}/csm/uploads/${id}`;

  const getPreviewContent = () => {
    if (type.startsWith('image/')) {
      return <img src={fileUrl} alt={name} className="max-w-full max-h-[80vh] object-contain" />;
    }

    if (type.startsWith('video/')) {
      return (
        <video controls className="max-w-full max-h-[80vh]" src={fileUrl}>
          Your browser does not support video playback.
        </video>
      );
    }

    if (type.startsWith('audio/')) {
      return (
        <audio controls className="w-full">
          <source src={fileUrl} type={type} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    if (type.includes('pdf')) {
      return <iframe src={fileUrl} className="w-full h-[80vh]" title={name} />;
    }

    return (
      <div className="text-center p-8">
        <div className="mb-4">{getFileIcon(type)}</div>
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
    <Card className="shadow-none mt-2">
      <CardContent className="lg:py-2">
        <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-2 items-center min-w-0 flex-1">
            {getFileIcon(type)}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{name}</div>
              <div className="text-xs text-muted-foreground">
                {formatFileSize(size)} • {type}
              </div>
            </div>
          </div>

          <div className="flex gap-1 flex-shrink-0">
            {canPreview(type) && (
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger>
                  <Button variant="ghost" size="sm">
                    <Eye size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getFileIcon(type)}
                        <h3 className="font-medium truncate">{name}</h3>
                      </div>
                      {(type.startsWith('image/') || type.includes('pdf')) && (
                        <div className="flex gap-2 pr-10">
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
                        </div>
                      )}
                    </div>

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
            )}

            <Button variant="ghost" size="sm" asChild>
              <a href={fileUrl} download={name}>
                <Download size={16} />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { AttachmentDetails };

import { useState } from 'react';
import {
  FileText,
  Image,
  Music,
  Paperclip,
  Video,
  Download,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

function getMimeType(dataUrl) {
  const match = dataUrl?.match(/^data:(.*?);base64,/);
  return match ? match[1] : '';
}

function getFileIcon(mime) {
  const lowerMime = mime.toLowerCase();

  if (
    lowerMime.startsWith('image/') ||
    ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'].some(ext => lowerMime.includes(ext))
  ) {
    return <Image size={25} className="text-blue-500" />;
  }
  if (lowerMime.startsWith('video/')) {
    return <Video size={16} className="text-purple-500" />;
  }
  if (lowerMime.startsWith('audio/')) {
    return <Music size={16} className="text-green-500" />;
  }
  if (lowerMime.includes('pdf')) {
    return <FileText size={16} className="text-red-500" />;
  }
  return <Paperclip size={16} className="text-gray-500" />;
}

const Base64Attachment = ({ dataUrl, name }) => {
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const mime = getMimeType(dataUrl);
  const isImage = mime?.startsWith('image/');

  // prepare a downloadable object url on demand
  const handleDownload = () => {
    if (!downloadUrl) {
      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
          setTimeout(() => URL.revokeObjectURL(url), 60 * 1000); // cleanup
          const a = document.createElement('a');
          a.href = url;
          a.download = name || 'file';
          a.click();
        });
    } else {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = name || 'file';
      a.click();
    }
  };

  return (
    <Card className="shadow-none mt-2">
      <CardContent className="lg:py-2">
        <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-2 items-center min-w-0 flex-1">
            {getFileIcon(mime)}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">
                {name || 'Unknown'}
              </div>
              <div className="text-xs text-muted-foreground">{mime}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isImage && (
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Eye size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-4">
                  <img
                    src={dataUrl}
                    alt={name}
                    className="max-w-full max-h-[80vh] mx-auto object-contain"
                  />
                </DialogContent>
              </Dialog>
            )}

            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { Base64Attachment };

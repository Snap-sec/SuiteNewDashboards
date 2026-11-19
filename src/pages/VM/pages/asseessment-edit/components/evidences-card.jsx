import {
  DownloadCloud,
  File,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import appConfig from '@/config/appConfig';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AttachmentPreview from '@/components/custom/attachment-preview';
import { CustomTooltip } from '@/components/custom/tooltip';
import { DateFormatter } from '../../../../../components/custom/date-formatter';
import DeleteEvidence from './actions/delete-evidence';
import { formatDateTime } from '../../../../../lib/helpers';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';

const PREVIEWABLE_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
];

const getFileIcon = (type) => {
  if (type === 'application/pdf') return FileText;
  if (type?.includes('word')) return FileText;
  if (type?.includes('sheet') || type?.includes('excel'))
    return FileSpreadsheet;
  if (type === 'image/svg+xml') return ImageIcon;
  return File;
};

const EvidencesCard = ({ attachments = [] }) => {
  const renderItem = (item) => {
    const isPreviewable = PREVIEWABLE_IMAGE_TYPES.includes(item.type);
    const Icon = getFileIcon(item.type);

    const cardContent = (
      <div
        className={cn(
          'w-full h-60 bg-muted flex items-center justify-center relative group',
          isPreviewable && 'cursor-pointer',
        )}
      >
        {isPreviewable ? (
          <img
            src={toAbsoluteUrl(`${appConfig.BASE_URL}/csm/uploads/${item.uid}`)}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Icon className="w-14 h-14 mb-2" />
            <span className="text-xs uppercase tracking-wide">
              {item.type?.split('/')[1] || 'file'}
            </span>
          </div>
        )}
        {isPreviewable && (
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/90 p-2 rounded-full shadow-lg">
              <ImageIcon className="w-6 h-6 text-primary" />
            </div>
          </div>
        )}
      </div>
    );

    return (
      <Card key={item._id} className="border shadow-none overflow-hidden">
        {isPreviewable ? (
          <AttachmentPreview id={item.uid} type={item.type} name={item.name}>
            {cardContent}
          </AttachmentPreview>
        ) : (
          cardContent
        )}

        <div className="px-4 py-3">
          <p className="font-medium text-sm truncate">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.type}</p>
        </div>

        <div className=" flex items-center justify-between p-4 -mt-2">
          <p className="text-xs text-muted-foreground">
            Date: {formatDateTime(item.createdAt)}
          </p>

          <div className="flex items-center gap-1.5">
            <CustomTooltip text="Download Evidence">
              <Button variant="ghost" mode="icon">
                <a
                  href={`${appConfig.BASE_URL}/csm/uploads/${item.uid}`}
                  download={item.name}
                >
                  <DownloadCloud size={18} className=" text-gray-400" />
                </a>
              </Button>
            </CustomTooltip>

            <AuthorityGuard forbidRoles={"Auditor"}>
            {item.origin == 'evidence' && (
              <DeleteEvidence evidenceId={item._id} />
            )}
            </AuthorityGuard>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {attachments.map(renderItem)}
    </div>
  );
};

export { EvidencesCard };

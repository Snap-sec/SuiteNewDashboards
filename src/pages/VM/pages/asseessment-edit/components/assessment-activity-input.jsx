import { useRef, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Paperclip, SendHorizonal, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import MentionsInput from '@/components/custom/mention-input/mention-input';
import { Profile } from '@/components/custom/profile';
import FileIcon from '../../../../../components/custom/file-icon';
import { CustomTooltip } from '../../../../../components/custom/tooltip';
import { useAddVmAssessmentActivityMutation } from '../../../../../services/vm/assessmentsApi';
import {
  useCreateVmAttachmentMetadataMutation,
  useUploadVmAttachmentMutation,
} from '../../../../../services/vm/vulnerabilityApi';

const getFileType = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  const audioTypes = ['mp3', 'wav', 'flac', 'aac', 'ogg'];
  const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz'];
  const codeTypes = [
    'js',
    'jsx',
    'ts',
    'tsx',
    'html',
    'css',
    'py',
    'java',
    'cpp',
    'c',
    'php',
    'rb',
    'go',
  ];

  if (imageTypes.includes(extension)) return 'image';
  if (documentTypes.includes(extension)) return 'document';
  if (videoTypes.includes(extension)) return 'video';
  if (audioTypes.includes(extension)) return 'audio';
  if (archiveTypes.includes(extension)) return 'archive';
  if (codeTypes.includes(extension)) return 'code';

  return 'file'; // default fallback
};

function AssessmentActivityInput({ assessmentId, className = '' }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [mentionsInputKey, setMentionsInputKey] = useState(Date.now());

  const [uploadMetadata] = useCreateVmAttachmentMetadataMutation();
  const [uploadAttachment] = useUploadVmAttachmentMutation();

  const [commentText, setCommentText] = useState('');
  const [mentions, setMentions] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [addActivity, { isLoading }] = useAddVmAssessmentActivityMutation();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachments((prev) => [...prev, ...files]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesUpload = async () => {
    const uploadedAttachments = [];
    if (!attachments || attachments.length === 0) return uploadedAttachments;

    for (let file of attachments) {
      try {
        let metadata = {
          assessmentId,
          originId: assessmentId,
          origin: 'assessment-activity',
          type: file.type,
          name: file.name,
        };

        const response = await uploadMetadata(metadata).unwrap();
        let attachmentId = response?.data?.id;

        if (!attachmentId) {
          toast.error('Error while uploading ' + metadata.name);
          continue;
        }

        uploadedAttachments.push({
          uid: attachmentId,
          type: file.type,
          name: file.name,
          size: file.size,
        });

        const formdata = new FormData();
        formdata.append('file', file);
        uploadAttachment({ id: attachmentId, file: formdata }).unwrap();
      } catch (error) {
        console.log(error);
        continue;
      }
    }

    return uploadedAttachments;
  };

  const handleSend = async () => {
    const cleanedText = commentText
      .replace(/\n{3,}/g, '\n\n')
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim();

    let uploadedAttachments = [];
    try {
      if (attachments.length > 0) {
        uploadedAttachments = await handleFilesUpload();
      }

      toast.promise(
        addActivity({
          assessmentId,
          text: cleanedText,
          attachments: uploadedAttachments,
          mentions: mentions,
        }).unwrap(),
        {
          loading: 'Adding activity',
          success: () => {
            setCommentText('');
            setAttachments([]);
            setMentions([]);
            setMentionsInputKey(Date.now());
            return 'Activity Added';
          },
          error: (err) =>
            err?.data?.data?.[0]?.msg ||
            err?.data?.message ||
            'Failed to add activity',
        },
      );
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  };

  return (
    <div className={`flex flex-col gap-4 px-3 w-full ${className}`}>
      <div className="flex items-center gap-3 bg-secondary/40 border border-border/50 rounded-2xl focus-within:ring-1 focus-within:ring-primary/20 transition-all p-2 pl-3">
        <div className="pb-1">
          <Profile
            email={user.email}
            showName={false}
            name={user.firstName + ' ' + user.lastName}
            size={32}
            showOnHover="name"
          />
        </div>

        <div className="flex-1 pb-1 pt-1">
          <MentionsInput
            key={mentionsInputKey}
            defaultValue={commentText}
            placeholder={`Comment as ${user.name || 'User'}...`}
            onSubmit={(text, mentions) => {
              setCommentText(text);
              setMentions(mentions);
            }}
            maxSuggestions={5}
            onPressEnter={handleSend}
          />
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />

        <div className="flex items-center gap-1 pb-0.5 pr-1">
          <CustomTooltip text="Add Attachment">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleAttachmentClick}
              className="h-8 w-8 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Attach Files"
            >
              <Paperclip size={18} />
            </Button>
          </CustomTooltip>

          <Button
            onClick={handleSend}
            variant="ghost"
            size="icon"
            disabled={
              isLoading || (!commentText.trim() && attachments.length === 0)
            }
            className="h-8 w-8 hover:bg-secondary hover:text-foreground transition-colors"
          >
            <SendHorizonal size={18} />
          </Button>
        </div>
      </div>

      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 ml-[48px]">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="group relative h-12 w-12 border rounded-lg overflow-hidden bg-background/50 flex items-center justify-center border-dashed"
            >
              <FileIcon type={getFileType(file.name)} />
              <button
                onClick={() => removeAttachment(index)}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssessmentActivityInput;

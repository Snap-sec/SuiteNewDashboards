import { useRef, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Paperclip, SendHorizonal, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import MentionsInput from '@/components/custom/mention-input/mention-input';
import { Profile } from '@/components/custom/profile';
import { CustomTooltip } from '@/components/custom/tooltip';
import FileIcon from '@/components/custom/file-icon';

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

function AssetActivityInput({ onSend }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [mentionsInputKey, setMentionsInputKey] = useState(Date.now());
  const [commentText, setCommentText] = useState('');
  const [mentions, setMentions] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSend = async () => {
    if (!commentText.trim() && attachments.length === 0) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (onSend) {
        onSend({
          text: commentText.trim(),
          attachments,
          mentions,
          name: user?.name || 'User',
          date: new Date().toISOString(),
        });
      }
      toast.success('Comment added (Mock)');
      setCommentText('');
      setAttachments([]);
      setMentions([]);
      setMentionsInputKey(Date.now());
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-3 items-start">
        <div className="flex-1 flex flex-col transition-all py-4">
          <div className="flex items-start gap-2">
            <Profile email={user?.email} size={30} className="mt-1" />
            <div className="flex-1">
              <MentionsInput
                key={mentionsInputKey}
                defaultValue={commentText}
                placeholder={`Comment as ${user?.name || 'User'}...`}
                onSubmit={(text, mentions) => {
                  setCommentText(text);
                  setMentions(mentions);
                }}
                maxSuggestions={5}
                onEnter={handleSend}
              />
            </div>

            <Button
              onClick={handleSend}
              variant="ghost"
              size="icon"
              disabled={isLoading || (!commentText.trim() && attachments.length === 0)}
              className="h-9 w-9 hover:bg-secondary rounded-xl hover:text-foreground mt-1 transition-colors shrink-0"
            >
              <SendHorizonal size={20} />
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="*/*"
          />
        </div>
      </div>

      {
        attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 ml-[48px]">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="group relative h-10 w-10 border rounded-lg overflow-hidden bg-background/50 flex items-center justify-center border-dashed"
              >
                <FileIcon type={getFileType(file.name)} />
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )
      }
    </div >
  );
}

export default AssetActivityInput;


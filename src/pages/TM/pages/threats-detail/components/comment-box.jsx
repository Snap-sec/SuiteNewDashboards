import { useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Paperclip, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import MentionsInput from '@/components/custom/mention-input/mention-input';
import { Profile } from '@/components/custom/profile';
import FileIcon from '../../../../../components/custom/file-icon';
import { useAddCommentToThreatMutation } from '../../../../../services/tm/threatApi';


// Helper for file type icon
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
  return 'file';
};

function CommentBox({ threat=[] }) {
  const { user } = useAuth();

  const [text, setText] = useState('');
  const [mentions, setMentions] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const [mentionsInputKey, setMentionsInputKey] = useState(Date.now());

  const [addComment, { isLoading: isAddingComment }] =
    useAddCommentToThreatMutation();

  const handleComment = () => {
    const owner = {
      userId: user._id,
      email: user.email,
      name: user.name || user.firstName + ' ' + user.lastName,
    };

    toast.promise(
      addComment({
        threatId: threat._id,
        comment: { text, mentions, attachments, owner: owner },
      }).unwrap(),
      {
        loading: 'Adding comment',
        error: 'Error Adding comment',
        success: () => {

          setText(''); // Clear the text state
          setMentions([]); // Clear mentions state
          setAttachments([]); // Optional: clear attachments
          setMentionsInputKey(Date.now()); // Trigger MentionsInput remount
          return 'Comment Added Successfully.';
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2 px-3">
      {/* Comment Input Row */}
      <div className="flex items-center gap-2 relative">
        <Profile email={user.email} size={30} />

        <MentionsInput
          key={mentionsInputKey}
          defaultValue={text}
          onSubmit={(text, mentions) => {
            setText(text);
            setMentions(mentions);
          }}
          maxSuggestions={5}
          onEnter={handleComment}
        />

        
        {/* Send button (non-functional) */}
        <Button
          variant="outline"
          type="button"
          disabled={isAddingComment}
          className="h-10 px-3 border rounded bg-transparent flex items-center justify-center"
          onClick={handleComment}
        >
          <Send size={20} />
        </Button>
      </div>

    </div>
  );
}

export default CommentBox;

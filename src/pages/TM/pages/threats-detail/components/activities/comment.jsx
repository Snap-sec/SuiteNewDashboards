import { MessageSquare, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DateFormatter } from "@/components/custom/date-formatter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteThreatCommentMutation } from '../../../../../../services/tm/threatApi';
import { Attachment } from './attachment';
import TimelineItem from './timeline-item';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

import { useAuth } from "@/auth/context/auth-context";


const Comment = ({ activity, text, threatId, attachments, readOnly, onDelete }) => {

  const user = useAuth();

  const [deleteComment, { isLoading, error }] = useDeleteThreatCommentMutation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    deleteComment({
      threatId,
      commentId: activity._id,
    })
     .unwrap()
      .then(() => {
        toast.success("Comment Deleted");
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Failed to delete comment");
      });
  };

  // parse comment text and make links clickable
  let link = '';
  const linkRegex = /(\bhttps?:\/\/[^\s/$.?#].[^\s]*\b)/;

  const match = typeof activity.text === "string" ? activity.text.match(linkRegex) : null;

  if (match?.length) {
      link = match[1];

      link = <a href={link} target="_blank" className="text-primary cursor-pointer">{link}</a>;
  }

  let newCommentText = activity.text;

  if (match?.length) {
    let comment = newCommentText.split(match[1]);
    newCommentText = <span>{comment[0]}{link}{comment[1]}</span>
  }

  return (
    <TimelineItem userId={activity?.owner?.userId} userName={activity?.owner?.name} icon={Rocket} line={true}>
      <div className="flex justify-between gap-4 group relative">
        <div className="flex flex-col">
          <div className="text-sm text-foreground">
            {newCommentText}
          </div>
          <div>
            {activity?.commentType != "text" ?
              activity?.attachments?.map((attachment, index) => {
                return <Attachment key={index} attachment={attachment} />
              }) : ""
            }
          </div>
          <span className="text-xs text-secondary-foreground">
           {activity?.owner?.name} - <DateFormatter date={activity?.createdAt} />
          </span>
        </div>

         <div className="invisible group-hover:visible transition-opacity duration-200">
          {user?._id === activity?.ownerId &&(
            <Button variant="ghost" onClick={() => {
              const hasAttachments = activity?.attachments?.length > 0;
              if (hasAttachments) {
                setShowConfirm(true);
              } else {
                handleDelete();
              }
            }} disabled={isLoading}>
              <Trash2 />
            </Button>
          )}
        
          </div>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone and will permanently delete the associated attachment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TimelineItem>
  );
};

export { Comment };



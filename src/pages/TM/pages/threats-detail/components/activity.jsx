import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Comment } from '../components/activities/comment';
import { StateChange } from './activities/state-change';

const Activity = ({ threat=[] }) => {
  const sortedComments = [...(threat?.comments || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedComments.length ? (
          sortedComments.map((comment) => (
            comment.type === "state_change" ? (
              <StateChange
                key={comment._id || comment.id} // Use unique key
                heading={comment?.text}
                datetime={comment.createdAt}
                title={`State Changed From ` + comment.from + ` to ` + comment.to}
                stateFrom={comment.from}
                stateTo={comment.to}
                ownerId={comment.ownerId}
                name={comment?.owner?.name}
              />
            ) : comment.type === "owner_change" ? (
              <StateChange
                key={comment._id || comment.id} // Use unique key
                heading={comment?.text}
                datetime={comment.createdAt}
                title={`Owner Changed From ` + comment.from?.name + ` to ` + comment.to?.name}
                stateFrom={comment.from?.name}
                stateTo={comment.to?.name}
                ownerId={comment.ownerId}
                name={comment?.owner?.name}
              />
            ) : comment.type === "severity_change" ? (
              <StateChange
                key={comment._id || comment.id} // Use unique key
                heading={comment?.text}
                datetime={comment.createdAt}
                title={`Severity Changed From ` + comment.from + ` to ` + comment.to}
                stateFrom={comment.from}
                stateTo={comment.to}
                ownerId={comment.ownerId}
                name={comment?.owner?.name}
              />
            ) : (
              <Comment
                key={comment._id || comment.id} // Use unique key
                activity={comment}
                text={comment}
                threatId={threat.threatId}
              />
            )
          ))
        ) : (
          <p className="text-[12px] text-center">No Activity</p>
        )}
      </CardContent>
    </Card>
  );
};

export { Activity };

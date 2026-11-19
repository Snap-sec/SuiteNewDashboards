import { ExternalLink, LucideExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Editor from '@/components/custom/Editor';

const SearchCard = ({ title, data, searchQuery, linkTo, assessmentName }) => {
  // Regex to detect blob URLs
  const blobUrlRegex = /blob:http[^\s)"']+/g;
  let editorContent = data?.matchBlock;
  if (editorContent && blobUrlRegex.test(editorContent)) {
    editorContent = 'Screenshot here';
  }
  return (
    <Card>
      <CardHeader className="ps-8">
        <CardTitle>
          <Link
            to={linkTo}
            target="_blank"
            rel="noopener noreferrer"
            className="leading-none font-medium text-sm text-mono hover:text-primary underline flex  gap-1"
          >
            {title}
            <ExternalLink
              size={13.5}
              className="remixicon cursor-pointer text-muted-foreground"
            />{' '}
          </Link>
          {assessmentName && (
            <div style={{ fontSize: '0.75em', color: '#888', marginTop: 10 }}>
              {assessmentName}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Editor defaultValue={editorContent} readOnly={true} />
      </CardContent>
    </Card>
  );
};

export { SearchCard };

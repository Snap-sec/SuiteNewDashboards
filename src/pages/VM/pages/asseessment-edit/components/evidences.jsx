import FileIcon from '@/components/custom/file-icon';
import { Profile } from '@/components/custom/profile';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/helpers';
import {
  DownloadCloud,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import appConfig from '../../../../../config/appConfig';
import DeleteEvidence from './actions/delete-evidence';
import AttachmentPreview from '../../../../../components/custom/attachment-preview';
import { CustomTooltip } from '@/components/custom/tooltip';

const Evidences = ({ attachments }) => {
  const [params] = useSearchParams();

  const renderItem = (table, index) => {
    return (
      <TableRow key={index}>
        <TableCell className="text-sm text-foreground">{index + 1}</TableCell>
        <TableCell className="lg:text-start flex gap-2 items-end">
          <FileIcon type={table.type?.split('/')[0]} />
          {table.name}
        </TableCell>
        <TableCell className="text-sm text-foreground">
          {
            table.owner ?
              <Profile
                email={table.owner?.email}
                name={
                  table.owner?.name
                }
                role={table.owner?.email}
              />
              :
              'No Owner'
          }
        </TableCell>
        <TableCell className="text-sm text-foreground">
          {formatDate(table.createdAt)}
        </TableCell>

        <TableCell className="space-x-1.5 flex items-center">

          <AttachmentPreview id={table.uid} type={table?.type} name={table?.name} />

          <CustomTooltip text="Download Evidence">
            <Button variant="ghost" mode="icon">
              <a href={`${appConfig.BASE_URL}/csm/uploads/${table?.uid}`}>
                <DownloadCloud />
              </a>
            </Button>
          </CustomTooltip>

          <DeleteEvidence evidenceId={table?._id} />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidences</CardTitle>
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent/60">
              <TableHead className="min-w-10 h-10">ID</TableHead>
              <TableHead className="min-w-16 h-10">File Name</TableHead>
              <TableHead className="min-w-16 h-10">Uploaded By</TableHead>
              <TableHead className="min-w-16 h-10">Date</TableHead>
              <TableHead className=" min-w-16 h-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attachments.map((table, index) => {
              return renderItem(table, index);
            })}
          </TableBody>
        </Table>
      </CardContent>
      {/* <CardFooter className="justify-center">
        <Button mode="link" underlined="dashed" asChild>
          <Link to="#">View all Payments</Link>
        </Button>
      </CardFooter> */}
    </Card>
  );
};

export { Evidences };

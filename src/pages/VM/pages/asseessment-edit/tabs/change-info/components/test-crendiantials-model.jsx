import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

function TestCredentialsModel({ visible, onClose, Credentials }) {
  return (
    <Modal
      title="Test Credentials"
      visible={visible}
      onCancel={onClose}
      footer={null}
      trigger={
        <Button className="text-xs" mode="link">
            View Credentials
        </Button>       
      }
      className="max-w-[500px]"
    >
    <Table className="align-middle text-sm ">
      <TableBody>
{/* 
        <TableRow className="border-0">
            <TableCell className="text-sm text-secondary-foreground pb-3 pe-4 lg:pe-8 py-2">
                sdasd
            </TableCell>
            <TableCell className="text-sm text-secondary-foreground pb-3 pe-4 lg:pe-8 py-2">
                
            </TableCell>
        </TableRow> */}


        <pre className=''>
            {Credentials || 'N/A'}
        </pre>


      </TableBody>
    </Table>
    </Modal>
  );
}


export default TestCredentialsModel;
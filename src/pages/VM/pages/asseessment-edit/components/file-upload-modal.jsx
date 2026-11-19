import { useState } from 'react';
import { FileUpIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/custom/file-upload';
import { Modal } from '@/components/custom/modal';
import {
  useCreateVmAttachmentMetadataMutation,
  useUploadVmAttachmentMutation,
} from '../../../../../services/vm/vulnerabilityApi';
import { Spinner } from '../../../../../components/ui/spinners';

function FileUploadModal() {
  const [params] = useSearchParams();

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const [uploadMetadata, { isLoading: isUploadingMetadata }] =
    useCreateVmAttachmentMetadataMutation();
  const [uploadAttachment, { isLoading: isUploadingAttachment }] =
    useUploadVmAttachmentMutation();

  const handleFilesUpload = async () => {
    if (!files?.length) {
      return toast.error('File is required');
    }

    for (let file of files) {
      try {
        let metadata = {
          assessmentId: params.get('assessmentId'),
          name: file.name,
          type: file.type,
          origin: 'evidence',
        };

        const response = await uploadMetadata(metadata).unwrap();
        if (isUploadingMetadata) {
          toast.loading('Uploading Evidence');
        }

        let attachmentId = response?.data?.id;

        const formdata = new FormData();

        formdata.append('file', file);

        // await uploadAttachment({ id: attachmentId, file: formdata });

        toast.promise(
          uploadAttachment({ id: attachmentId, file: formdata }).unwrap(),
          {
            loading: 'Uploading Evidence',
            success: () => {
              setOpen(false);
              setFiles([]);
              return 'Evidence Uploaded Successfully';
            },
            error: 'Error Uploading Evidence',
          },
        );
      } catch (error) {
        continue;
      }
    }
  };

  const handleFilesChange = (files) => {
    setFiles(files);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Upload Evidences"
      description="Upload Evidences for the assessment"
      className="w-[50%]"
      trigger={
        <Button variant="outline">
          <FileUpIcon /> Upload Evidences
        </Button>
      }
    >

      <FileUpload variant="compact" onFilesChange={handleFilesChange} maxFiles={20} />
      <div className="w-full flex items-center justify-end">
        <Button
          disabled={isUploadingMetadata || isUploadingAttachment}
          variant="outline"
          onClick={handleFilesUpload}
        >
          {isUploadingMetadata || isUploadingAttachment
            ? <><Spinner className="animate-spin" /> Uploading</>
            : ' Upload'}
        </Button>
      </div>
    </Modal>
  );
}

export default FileUploadModal;

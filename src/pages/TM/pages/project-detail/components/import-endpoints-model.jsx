import { useState } from "react";
import { Modal } from "@/components/custom/modal";
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/custom/file-upload';
import { useImportEndpointsMutation } from "../../../../../services/tm/projectApi";
import { toast } from "sonner";
import { useParams } from 'react-router-dom';
import { Import  } from 'lucide-react';
import { CustomTooltip } from '@/components/custom/tooltip';

function ImportEndpointsModel(showText) {
  const { projectId } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [importEndpoints, { isLoading }] = useImportEndpointsMutation();

  const handleImport = () => {
    if (!uploadedFiles[0]) {
      toast.error('Please upload a file before importing.');
      return;
    }
    const formdata = new FormData();
    formdata.append("file", uploadedFiles[0]);

    toast.promise(
      importEndpoints({ projectId, channelId: "postman", file: formdata }).unwrap(),
      {
        loading: "Importing Endpoints",
        success: () => {
          setIsOpen(false);
          setUploadedFiles([]);
          return "Endpoints imported Successfully";
        },
        error: "Failed to import endpoints"
      }
    );
  };


  console.log("xxasdasdasda", showText);

  return (
    <div>
      <Modal
        open={isOpen}
        setOpen={setIsOpen}
        title="Import Endpoints"
        description="Import endpoints from a Postman file (.json)."
        className="w-[600px]"
        trigger={
          <CustomTooltip text="Import Endpoints">
            <Button onClick={() => setIsOpen(true)}> <Import  /> {showText?.showText === true ? "Import Endpoints" : null}</Button>
          </CustomTooltip>
        }
        footer={
            <Button onClick={() => handleImport()} variant="outline" size="sm">
              Import Endpoints
            </Button>
        }
      >
        <div className="flex flex-col gap-1 mt-4">
          <p>Upload Attachment</p>
          <FileUpload
            maxFiles={1}
            maxFileSize={10 * 1024 * 1024} // 10MB
            variant="compact"
            onFilesChange={setUploadedFiles}
            acceptedTypes="application/json"
            value={uploadedFiles}
          />
        </div>
      </Modal>
    </div>
  );
}

export default ImportEndpointsModel;

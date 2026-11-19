import { useState } from "react";
import { Modal } from "@/components/custom/modal";
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/custom/file-upload';
import { useImportThreatsMutation } from "../../../../../services/tm/projectApi";
import { toast } from "sonner";
import { useParams } from 'react-router-dom';
import {CustomTooltip} from "@/components/custom/tooltip";
import { Import } from 'lucide-react';
import appConfig from "@/config/appConfig";



function ImportThreatsCSVModel(showText) {
  const { projectId } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [importThreats, { isLoading }] = useImportThreatsMutation();

  const handleImport = () => {
    if (!uploadedFiles[0]) {
      toast.error('Please upload a file before importing.');
      return;
    }
    const formdata = new FormData();
    formdata.append("file", uploadedFiles[0]);

    toast.promise(
      importThreats({ projectId, file: formdata }).unwrap(),
      {
        loading: "Importing Threats",
        success: () => {

          setIsOpen(false);
          setUploadedFiles([]);
          return "Threats imported Successfully";
        },
        error: (err) => { return err?.data?.message || "Failed to import Threats" }
      }
    );
  };

  return (
    <div>
      <Modal
        open={isOpen}
        setOpen={setIsOpen}
        title={<span>Import Threats</span>}
        description={<span>Import threats from a Postman file <a className="text-[12px] text-primary underline" download href={`${appConfig.BASE_URL}/sample/download/threats.sample.csv`}>Download Sample CSV</a> </span>}
        className="w-[600px]"
        trigger={
          <CustomTooltip text="Import Threats from CSV">
            <Button onClick={() => setIsOpen(true)}> {showText?.showText === true ? "Import Threats" : null} <Import /> </Button>
          </CustomTooltip>
        }
        footer={
          <Button onClick={handleImport} disabled={isLoading || !uploadedFiles[0]}>
            {isLoading ? "Importing..." : "Import"}
          </Button>
        }
      >
        <div className="flex flex-col gap-1 mt-4">
          <p>Upload Attachment</p>
          <FileUpload
            maxFiles={1}
            maxFileSize={10 * 1024 * 1024}
            variant="compact"
            onFilesChange={setUploadedFiles}
            acceptedTypes=".csv,text/csv"
            value={uploadedFiles}
          />
        </div>
      </Modal>
    </div>
  );
}

export default ImportThreatsCSVModel;

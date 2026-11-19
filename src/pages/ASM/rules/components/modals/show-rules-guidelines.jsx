import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Editor from '@/components/custom/Editor';
import { Modal } from '@/components/custom/modal';
import { ContentLoader } from '@/components/common/content-loader';

function RulesGuidelinesModal({ trigger }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [markdown, setMarkdown] = useState(null);

  //   Fetch markdown file from public/asstes folder
  useEffect(() => {
    fetch('/assets/asm-rules-guidelines.md') // path relative to public folder
      .then((res) => res.text())
      .then((text) => setMarkdown(text))
      .catch((err) => console.error('Error loading markdown:', err));
  }, []);

  return (
    <Modal
      open={isModalOpen}
      setOpen={setIsModalOpen}
      title="API Engine Rule Guide"
      description="This document explains how to create transformation rules and matching conditions to test API endpoints using YAML files."
      trigger={
        trigger ? (
          <span
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer bg-blue-500 text-white px-2 py-1 rounded"
          >
            {trigger}
          </span>
        ) : (
          <Button
            variant="primary"
            mode="link"
            underline="solid"
            onClick={() => setIsModalOpen(true)}
          >
            Guide
          </Button>
        )
      }
      footer={
        <div className="mt-2 flex justify-end">
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </div>
      }
      className="
          w-[95%] 
          max-w-full 
          sm:w-[90%] 
          md:w-[80%] 
          lg:w-[60%] 
          xl:w-[50%] 
          h-[90vh] 
          overflow-hidden
          flex 
          flex-col
        "
    >
      {/* Markdown Editor */}
      <div className="h-[80vh] overflow-y-scroll">
        {!markdown && <ContentLoader />}

        <Editor className="w-full" readOnly={true} defaultValue={markdown} />
      </div>
    </Modal>
  );
}

export default RulesGuidelinesModal;

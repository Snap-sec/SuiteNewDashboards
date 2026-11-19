import { useState } from 'react';
import { Eye, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';

function PreviewImageModal({ base64Image, trigger }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Modal
      open={isModalOpen}
      setOpen={setIsModalOpen}
      title="Image Preview"
      description="Preview your selected image below."
      trigger={
        trigger ? (
          // Clone the trigger element and attach onClick
          <span
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer bg-gray-500 text-white"
          >
            {trigger}
          </span>
        ) : null
      }
      footer={
        <div className="mt-2 flex justify-end">
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </div>
      }
      className="w-full md:w-1/2 lg:w-1/3"
    >
      {base64Image ? (
        <img
          src={
            base64Image.startsWith('data:')
              ? base64Image
              : `data:image/png;base64,${base64Image}`
          }
          alt="Preview"
          className="w-full max-h-96 object-contain border rounded"
        />
      ) : (
        <p>No image to preview</p>
      )}
    </Modal>
  );
}

export default PreviewImageModal;

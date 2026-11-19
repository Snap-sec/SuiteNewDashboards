import { useMemo } from 'react';
import { Modal } from '@/components/custom/modal';
import { useState } from "react";

import { CircleAlert } from 'lucide-react';


function VulnsHoverModel({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vulnDistirbution = data ? data.vulnerability_stats : {};

  const vulnItems = useMemo(() => {
    if (!vulnDistirbution) return [];
    return [
      { label: 'Critical', number: vulnDistirbution.critical },
      { label: 'High', number: vulnDistirbution.high },
      { label: 'Medium', number: vulnDistirbution.medium },
      { label: 'Low', number: vulnDistirbution.low },
    ];
  }, [vulnDistirbution]);

  return (
    <Modal
      open={isModalOpen}
      setOpen={setIsModalOpen}
      // title="Asset Vulnerabilities"
      // description="Overall Vulnerability on the Asset."
      trigger={
        <CircleAlert />
      }
      className="w-[500px]"
    >
      <div className='flex items-center justify-center'>
        <div className='flex flex-col gap-2 text-center'>
          <p>Total Vulnerabilities</p>
          <h2 className='text-3xl font-semibold text-mono'>
            {vulnDistirbution?.total}
          </h2>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2 mt-2 h-full items-stretch'>
        {vulnItems.map((item, index) => (
          <div key={index}
            className='border border-default py-1 text-center flex flex-col gap-2 rounded-lg'>
            <p>{item.label}</p>
            <h2 className='text-xl font-semibold text-mono'>
              {item.number}
            </h2>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default VulnsHoverModel;

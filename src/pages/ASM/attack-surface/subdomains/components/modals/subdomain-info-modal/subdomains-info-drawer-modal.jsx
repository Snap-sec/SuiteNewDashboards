import DrawerModal from '@/components/custom/drawer-modal';
import AssetDetailsContent from './components/asset-details-content';

const SubdomainsInfoDrawerModal = ({ value, type, trigger }) => {
  return (
    // className="sm:w-fit"
    <DrawerModal direction="right" trigger={trigger}>
      {({ isOpen }) => (
        <AssetDetailsContent isOpen={isOpen} value={value} type={type} />
      )}
    </DrawerModal>
  );
};

export default SubdomainsInfoDrawerModal;

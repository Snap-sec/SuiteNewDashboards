import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useStore from '../../store';

export const EditorHeader = ({ isEditingRule }) => {
  const navigate = useNavigate();
  const setSelectedRule = useStore((state) => state.setSelectedRule);

  const handleBack = () => {
    setSelectedRule(null);
    useStore.setState({ mode: 'create' });
    navigate('/casm/blacklist-rules');
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold">
        {isEditingRule ? 'Edit Blacklist Rule' : 'Blacklist Rule Editor'}
      </h1>
    </div>
  );
};

export default EditorHeader;

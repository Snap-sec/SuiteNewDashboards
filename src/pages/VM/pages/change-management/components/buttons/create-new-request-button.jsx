import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';


const CreateNewReqButton = () => {
  const userDataString = localStorage.getItem('user');
  const userData = JSON.parse(userDataString);
  const orgId = userData.orgId;

  const handleClick = () => {

    window.open(`/pages/public/${orgId}/change-request`, '_blank');
  };

  return (
    <Button onClick={handleClick}>
      <Plus />
      Create New Request
    </Button>
  );
};

export default CreateNewReqButton;

import React from 'react';
import GithubModal from './adapter-modals/github';
import ConfigureAdapterModal from './configure-adapter-modal';

function ModalRegistry() {
  return (
    <div>
      <GithubModal />
      <ConfigureAdapterModal />
    </div>
  );
}

export default ModalRegistry;

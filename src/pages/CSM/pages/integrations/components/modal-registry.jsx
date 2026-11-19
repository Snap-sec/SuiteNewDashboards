import Gcp from './adapter-modals/gcp';
import Aws from './adapter-modals/aws';
import Azure from './adapter-modals/azure';
import Oracle from './adapter-modals/oracle';
import Jira from './integration-modals/jira/jira';
import JiraConfigure from './integration-modals/jira-configure/JiraConfigure';
import ConfigureAdapterModal from './configure-adapter-modal';

function ModalRegistry() {
  return (
    <div>
      <Jira />
      <JiraConfigure />
      <Gcp />
      <Aws />
      <Azure />
      <Oracle />
      <ConfigureAdapterModal />
    </div>
  );
}

export default ModalRegistry;

import Aim from './adapter-modals/aim';
import Checkmarx from './adapter-modals/checkmarx';
import GoogleSheet from './adapter-modals/google-sheet';
import Csv from './adapter-modals/csv';
import Gitlab from './adapter-modals/gitlab';
import Manual from './adapter-modals/manual';
import Nuclei from './adapter-modals/nuclei';
import Qualys from './adapter-modals/qualys';
import QualysWas from './adapter-modals/qualys-was';
import Trivy from './adapter-modals/trivy';
import Semgrep from './adapter-modals/semgrep';
import DependencyCheck from './adapter-modals/dependency-check';
import NpmAudit from './adapter-modals/npm-audit';
import TruffleHog from './adapter-modals/trufflehog';
import Tenable from './adapter-modals/tenable';
import Jira from './integration-modals/jira/jira';
import AiProviders from './adapter-modals/ai-providers';
import ConfigureAdapterModal from './configure-adapter-modal';

function ModalRegistry() {
  return (
    <div>
      <ConfigureAdapterModal />
      <AiProviders />
    </div>
  );
}

export default ModalRegistry;

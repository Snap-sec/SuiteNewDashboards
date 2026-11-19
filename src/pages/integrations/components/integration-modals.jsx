import { lazy, Suspense, useEffect } from 'react';
import { useStore } from '../store';
import { INTEGRATION_PROVIDERS } from './integration-providers';

const Jira = lazy(() => import('./integration-modals/jira/jira'));
const JiraConfigure = lazy(
  () => import('./integration-modals/jira-configure/JiraConfigure'),
);
const ConfigureAdapterModal = lazy(() => import('./configure-adapter-modal'));

function StoreModal({ active, onClose }) {
  const install = useStore((state) => state.showInstallModal);
  const config = useStore((state) => state.showConfigModal);
  const open =
    active.isEdit || active.type !== 'jira'
      ? Boolean(config)
      : Boolean(install?.type);
  useEffect(() => {
    if (!open) onClose();
  }, [open, onClose]);
  if (!open) return null;
  if (active.type === 'jira')
    return active.isEdit ? <JiraConfigure /> : <Jira />;
  return <ConfigureAdapterModal />;
}

export default function IntegrationModals({ active, onClose }) {
  if (!active) return null;
  const Form = INTEGRATION_PROVIDERS[active.type]?.Form;
  return (
    <Suspense
      fallback={
        <p role="status" className="text-sm text-muted-foreground">
          Loading integration form…
        </p>
      }
    >
      {Form ? (
        <Form
          open
          integrationId={active.integrationId}
          adapter={active.adapter}
          mode={active.isEdit ? 'update' : 'create'}
          isEdit={active.isEdit}
          onClose={onClose}
        />
      ) : (
        <StoreModal active={active} onClose={onClose} />
      )}
    </Suspense>
  );
}

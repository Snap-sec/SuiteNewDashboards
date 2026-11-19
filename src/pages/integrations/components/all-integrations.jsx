import IntegrationsPanel from './integrations-panel';

export function AllIntegrations({ filterCategory, category, ...props }) {
  return <IntegrationsPanel {...props} category={category ?? filterCategory} />;
}

export default AllIntegrations;

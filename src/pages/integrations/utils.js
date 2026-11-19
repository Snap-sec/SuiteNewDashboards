/**
 * Helper to determine adapter / integration type from any adapter object
 */
export function getAdapterType(adapter) {
  if (!adapter) return null;
  const raw =
    `${adapter?.integrationId || ''} ${adapter?.id || ''} ${adapter?.slug || ''} ${adapter?.adapterName || ''} ${adapter?.adapterType || ''} ${adapter?.title || ''} ${adapter?.name || ''} ${adapter?.userProvidedName || ''} ${(Array.isArray(adapter?.category) ? adapter.category : [adapter?.category]).filter(Boolean).join(' ')}`.toLowerCase();

  if (raw.includes('gitlab')) return 'gitlab';
  if (raw.includes('github')) return 'github';
  if (raw.includes('gcp') || raw.includes('google')) return 'gcp';
  if (raw.includes('aws') || raw.includes('amazon')) return 'aws';
  if (raw.includes('azure') || raw.includes('microsoft')) return 'azure';
  if (raw.includes('oracle') || raw.includes('oci')) return 'oracle';
  if (raw.includes('jira')) return 'jira';

  return (
    adapter?.integrationId ||
    adapter?.id ||
    adapter?.slug ||
    adapter?.adapterName ||
    ''
  ).toLowerCase();
}

export const CLOUD_INTEGRATION_CATEGORY = 'cloud-infra';

export function getIntegrationCategories(adapter) {
  const raw = adapter?.category ?? adapter?.categories ?? adapter?.tags;
  const categories = (Array.isArray(raw) ? raw : raw ? [raw] : [])
    .map((category) =>
      typeof category === 'object'
        ? category?.value || category?.id || category?.name || category?.label
        : category,
    )
    .filter(Boolean)
    .map((category) => String(category).trim().toLowerCase());
  if (categories.length) return [...new Set(categories)];

  // Older integration responses omit categories; classify known cloud providers.
  const type = getAdapterType({ ...adapter, category: [] });
  return ['aws', 'gcp', 'azure', 'oracle'].includes(type)
    ? [CLOUD_INTEGRATION_CATEGORY]
    : [];
}

export function getIntegrationList(response) {
  const list =
    response?.data?.data?.integrations ||
    response?.data?.integrations ||
    response?.data?.data?.adapters ||
    response?.data?.adapters ||
    response?.integrations ||
    response?.adapters ||
    (Array.isArray(response?.data?.data) ? response.data.data : null) ||
    (Array.isArray(response?.data) ? response.data : null) ||
    (Array.isArray(response) ? response : []);
  return Array.isArray(list) ? list : [];
}

import { lazy } from 'react';

export const INTEGRATION_PROVIDERS = {
  aws: {
    label: 'Amazon Web Services',
    logo: '/new-adapter-logos/aws.svg',
    logoDark: '/new-adapter-logos/aws-dark.svg',
    Form: lazy(() => import('./adapter-modals/aws')),
  },
  gcp: {
    label: 'Google Cloud',
    logo: '/new-adapter-logos/gcp.svg',
    Form: lazy(() => import('./adapter-modals/gcp')),
  },
  azure: {
    label: 'Microsoft Azure',
    logo: '/new-adapter-logos/azure.svg',
    Form: lazy(() => import('./adapter-modals/azure')),
  },
  oracle: {
    label: 'Oracle Cloud',
    logo: '/new-adapter-logos/oracle.svg',
    Form: lazy(() => import('./adapter-modals/oracle')),
  },
  github: {
    label: 'GitHub',
    logo: '/new-adapter-logos/github.svg',
    Form: lazy(() => import('./adapter-modals/github')),
  },
  gitlab: {
    label: 'GitLab',
    logo: '/new-adapter-logos/gitlab.svg',
    Form: lazy(() => import('./adapter-modals/gitlab')),
  },
};

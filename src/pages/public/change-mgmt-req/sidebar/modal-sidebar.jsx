import { ScrollspyMenu } from '@/partials/navbar/scrollspy-menu';

export function PentestReqModalSidebar() {
  const items = [
    // {
    //   title: 'Approval & Priority',
    //   children: [
    //     { title: 'Go/No-Go & Priority', target: 'approval_gonogo_priority' },
    //   ],
    // },
    {
      title: 'Change Request Details',
      children: [
        {
          title: 'Request Summary',
          target: 'change_request_summary',
          default: true,
        },
        { title: 'Timeline', target: 'change_request_timeline' },
      ],
    },
    {
      title: 'Technical Details',
      children: [
        { title: 'Application Info', target: 'technical_app_info' },
        { title: 'Testing Environment', target: 'technical_test_env' },
        { title: 'Authentication & Access', target: 'technical_auth_access' },
        { title: 'API Documentation', target: 'technical_api_docs' },
      ],
    },
  ];

  return <ScrollspyMenu items={items} />;
}

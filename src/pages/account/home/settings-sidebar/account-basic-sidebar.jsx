import { ScrollspyMenu } from '@/partials/navbar/scrollspy-menu';

export function AccountSettingsSidebar() {
  const items = [
    {
      title: 'Basic Settings',
      target: 'basic_settings',
      active: true,
    },
    {
      title: 'Authentication',
      children: [
        // {
        //   title: 'Email',
        //   target: 'auth_email',
        //   active: false,
        // },
        {
          title: 'Password',
          target: 'auth_password',
        },
        {
          title: 'Two-Factor auth(2FA)',
          target: 'auth_two_factor',
        },
      ],
    },
    {
      title: 'Advanced Settings',
      children: [
        // {
        //   title: 'Preferences',
        //   target: 'advanced_settings_preferences',
        // },
        {
          title: 'Appearance',
          target: 'advanced_settings_appearance',
        },
        // {
        //   title: 'Notifications',
        //   target: 'advanced_settings_notifications',
        // },
      ],
    },
    {
      title: 'Delete Account',
      target: 'delete_account',
    },
  ];

  return <ScrollspyMenu items={items} />;
}

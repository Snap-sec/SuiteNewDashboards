import { Navbar } from '@/partials/custom/navbar/navbar';
import { NavbarMenu } from '@/partials/custom/navbar/navbar-menu';
import { AUTH_TOPBAR } from '@/config/menu.config';
import { useSettings } from '@/providers/settings-provider';
import { Container } from '@/components/common/container';

const PageNavbar = () => {
  const { settings } = useSettings();
  const accountMenuConfig = AUTH_TOPBAR[0].children;

  if (accountMenuConfig && settings?.layout === 'demo1') {
    return (
      <Navbar>
        <Container>
          <NavbarMenu items={accountMenuConfig} />
        </Container>
      </Navbar>
    );
  } else {
    return <></>;
  }
};

export { PageNavbar };

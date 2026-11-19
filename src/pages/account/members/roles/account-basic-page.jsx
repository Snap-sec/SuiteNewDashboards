import { Fragment, useState } from 'react';
import { PageNavbar } from '@/pages/account';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Link } from 'react-router';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { AccountRolesContent } from '.';
import NewRoleModal from './components/new-role-modal';

export function AccountRolesPage() {
  const { settings } = useSettings();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <p className='text-xl font-medium leading-none text-mono'>
              Roles
            </p>
            <ToolbarDescription>
              Overview of all team members and roles.
            </ToolbarDescription>
          </ToolbarHeading>
          <ToolbarActions>
            <NewRoleModal
              open={isModalOpen}
              setOpen={setIsModalOpen}
              trigger={
                <Button variant="outline">
                  New Role
                </Button>
              }
            />
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <AccountRolesContent />
      </Container>
    </Fragment>
  );
}

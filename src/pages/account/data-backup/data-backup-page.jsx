import { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { PageNavbar } from '../page-navbar';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useSettings } from '@/providers/settings-provider';
import { Container } from '@/components/common/container';
import { DataBackup } from './components/data-backup';

export function DataBackupPage() {
  const { settings } = useSettings();

  return (
    <Fragment>
      <Helmet>
        <title>Auth | Data & Backups</title>
      </Helmet>
      <PageNavbar />
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-secondary-foreground font-medium">
                    Configure how often backups are taken and how many are kept
                  </span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}
      <Container className="py-6">
        <DataBackup />
      </Container>
    </Fragment>
  );
}

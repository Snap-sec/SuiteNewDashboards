import { ArrowBigRight, MonitorDown, Plug } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {EmptyScreen} from "@/components/common/empty-screen"
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';

const Empty = ({title, subTitle, showButton}) => {
  return (
    <EmptyScreen
      title={title ? title : "No Assets Found"}
      subTitle={subTitle ? subTitle : "Your asset list is currently empty. Please try installing a relevant adapter to begin."}
      engage={
        <AuthorityGuard forbidRoles={['Auditor']}>
        <Link to="/assetinventory/adapters">
          <Button variant="primary">
            <Plug /> Connect Adapter
          </Button>
        </Link>
        </AuthorityGuard>
  }
    />
  );
};

export default Empty;

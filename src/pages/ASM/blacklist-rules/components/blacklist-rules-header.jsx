import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

export const BlacklistRulesHeader = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <PageHeading
        title="Blacklist Rules"
        description={"Define rules to automatically exclude or blacklist specific assets based on your criteria."}
      />
      <div className="flex items-center gap-3">
        <AuthorityGuard forbidRoles={['Auditor']}>
          <Link to="/casm/blacklist-rules/guided-editor">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" /> Create Rule
            </Button>
          </Link>
        </AuthorityGuard>
      </div>
    </div>
  );
};

export default BlacklistRulesHeader;

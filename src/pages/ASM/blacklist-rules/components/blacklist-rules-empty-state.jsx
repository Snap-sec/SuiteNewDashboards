import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

export const BlacklistRulesEmptyState = ({
  isFilterActive = false,
  onResetFilters,
}) => {
  if (isFilterActive) {
    return (
      <div className="mt-10">
        <EmptyScreen
          title="No Results Found"
          subTitle="No rules match the selected filters or search. Try adjusting your search or filters."
          engage={
            <Button
              variant="outline"
              onClick={onResetFilters || (() => window.location.reload())}
            >
              Clear All Filters
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <EmptyScreen
      title="No Blacklist Rules Found"
      subTitle="You haven't created any blacklist rules yet. Create a rule to start automatically blacklisting assets."
      engage={
        <AuthorityGuard forbidRoles={['Auditor']}>
          <Link to="/casm/blacklist-rules/guided-editor">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" /> Create Rule
            </Button>
          </Link>
        </AuthorityGuard>
      }
    />
  );
};

export default BlacklistRulesEmptyState;

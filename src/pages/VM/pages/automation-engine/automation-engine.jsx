import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import CreateAutomationRuleModal from './components/create-automation-rule-modal';
import { AutomationDetailsView } from './components/automation-details-view';
import { AutomationSidebar } from './components/automation-sidebar';
import { ApiErrorHandler } from '@/components/common/api-error-handler';

const ORIGIN_HEADINGS = {
  falsepositive_analysis: {
    title: 'Analysis Rules',
    description: 'Define and manage automated rules for identifying and analyzing potential false positives.',
  },
  default: {
    title: 'Workflow Automation',
    description: 'Define conditions, actions, and triggers to automate vulnerability management workflows.',
  },
};

function AutomationEngine({ origin }) {
  const [activeRule, setActiveRule] = useState(null);
  const [rulesState, setRulesState] = useState({ isLoading: true, isEmpty: false, isError: false, error: null });

  // Prevent re-rendering loops by checking if state actually changed
  const handleRulesStateChange = useCallback((nextState) => {
    setRulesState((prev) => {
      if (
        prev.isLoading === nextState.isLoading &&
        prev.isEmpty === nextState.isEmpty &&
        prev.isError === nextState.isError &&
        prev.error === nextState.error
      ) {
        return prev;
      }
      return nextState;
    });
  }, []);

  const handleActiveRuleChange = useCallback((rule) => {
    setActiveRule((prev) => {
      if (prev?._id === rule?._id) return prev;
      return rule;
    });
  }, []);

  const heading = ORIGIN_HEADINGS[origin] || ORIGIN_HEADINGS.default;

  if (rulesState.isError) {
    return <ApiErrorHandler error={rulesState.error} />;
  }

  return (
    <div className={`flex ${rulesState.isEmpty ? '' : 'p-4'} flex-col bg-background ${origin ? 'h-full' : 'h-[calc(100vh-90px)]'} min-h-0 flex-1 overflow-hidden`}>
      <Helmet>
        <title>UniRisk | Automation Engine</title>
      </Helmet>

      {!origin && !rulesState.isEmpty && (
        <div className="mb-1">
          <PageHeading
            title={heading.title}
            description={heading.description}
          />
        </div>
      )}

      <div className={`flex flex-1 overflow-hidden min-h-0 ${!origin && !rulesState.isEmpty ? 'border rounded-md' : ''}`}>
        {/* Keep AutomationSidebar permanently in the exact same tree position to avoid unmount/remount loops */}
        <div className={rulesState.isEmpty ? 'hidden' : 'flex h-full'}>
          <AutomationSidebar
            onActiveRuleChange={handleActiveRuleChange}
            onRulesStateChange={handleRulesStateChange}
            origin={origin}
          />
        </div>

        {rulesState.isEmpty ? (
          <EmptyScreen
            title="No Automation Rules Found"
            subTitle="Create your first automation rule to start automating vulnerability workflows."
            engage={
              <AuthorityGuard forbidRoles={['Auditor']}>
                <CreateAutomationRuleModal origin={origin} />
              </AuthorityGuard>
            }
          />
        ) : (
          <AutomationDetailsView
            activeRule={activeRule}
            setActiveRule={setActiveRule}
            isLoading={rulesState.isLoading}
            origin={origin}
          />
        )}
      </div>
    </div>
  );
}

export default AutomationEngine;

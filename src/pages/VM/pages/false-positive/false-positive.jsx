import { useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Bot } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetVmPotentialFalsePositivesQuery } from '@/services/vm/falsePositiveApi';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyScreen } from '@/components/common/empty-screen';
import SetupScreen from '@/components/common/setup-screen';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import AutomationEngine from '../automation-engine/automation-engine';
import { FalsePositiveDetailView } from './components/false-positive-detail-view';
import { FalsePositiveSidebar } from './components/false-positive-sidebar';


const TAB_HEADINGS = {
  'review-requests': {
    title: 'Review Requests',
    description: 'Review and validate AI-identified potential false positive vulnerabilities.',
  },
  'analysis-rules': {
    title: 'Analysis Rules',
    description: 'Define and manage automated rules for identifying and analyzing potential false positives.',
  },
};

function FalsePositiveWorkflow() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { auth } = useAuth();
  const [activeVuln, setActiveVuln] = useState(null);

  const tabParam = searchParams.get('tab');
  const validTabs = ['review-requests', 'analysis-rules'];
  const activeTab = validTabs.includes(tabParam) ? tabParam : 'review-requests';

  const { title: headingTitle, description: headingDescription } =
    TAB_HEADINGS[activeTab] || TAB_HEADINGS['review-requests'];

  const handleTabChange = (value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('tab', value);
      return params;
    });
  };

  const isAiConfigured = auth?.ai_configuration?.enabled === true;

  const { data, isLoading, isError, error } = useGetVmPotentialFalsePositivesQuery(undefined, { skip: !isAiConfigured });

  const items = data?.data || [];
  const noData = !isLoading && items.length === 0;

  // After a decision, clear the active selection so user picks the next one
  const handleDecision = (vulnId, action) => {
    setActiveVuln(null);
  };

  if (!isAiConfigured) {
    return (
      <div className="flex flex-col bg-background h-[calc(100vh-90px)] overflow-hidden p-4">
        <Helmet>
          <title>UniRisk | False Positive Workflow</title>
        </Helmet>
        <EmptyScreen
          title="AI Configuration Required"
          subTitle="False Positive analysis requires an active AI configuration. Please set up your AI integration to proceed."
          engage={
            <Button variant="primary" className="gap-2">
              <Link
                to="/profile/account/ai-config"
                className="flex flex-row gap-2"
              >
                <Bot className="size-4" />
                Configure AI
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background h-[calc(100vh-90px)] overflow-hidden p-4">
      <Helmet>
        <title>{`UniRisk | ${headingTitle}`}</title>
      </Helmet>

      <PageHeading
        title={headingTitle}
        description={headingDescription}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-full w-full">
        <TabsList className="mb-4" variant="line">
          <TabsTrigger value="review-requests">Review Requests</TabsTrigger>
          <TabsTrigger value="analysis-rules">Analysis Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="review-requests" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0">
          {!isError && noData ? (
            <SetupScreen
              title="No False Positive Requests"
              subTitle="There are currently no potential false positive requests to review."
              steps={[
                {
                  title: 'Configure Matching Criteria',
                  description: 'Create an automation workflow and define the matching conditions that identify the vulnerabilities you want to evaluate for potential false positives. These conditions can target specific assets, scanners, severities, technologies, or any other supported attributes.'
                },
                {
                  title: 'Select False Positive Analysis',
                  description: 'Choose False Positive Analysis as the workflow action. Every vulnerability matched by the workflow will be automatically analyzed to determine whether it is likely to be a false positive and, if applicable, escalated for review.'
                },
                {
                  title: 'Execute and Review Results',
                  description: 'Run the workflow to analyze all matching vulnerabilities. Review the generated false positive escalations, validate the findings, and take appropriate actions such as marking confirmed false positives or refining the workflow criteria.'
                }
              ]}
            // engage={
            //   <Button onClick={() => navigate('/vm/automation-engine')} variant="outline">
            //     Setup workflow automation
            //   </Button>
            // }
            />
          ) : isError ? (
            <ApiErrorHandler error={error} />
          ) : (
            <div className="flex flex-1 overflow-hidden min-h-0 border rounded-md">
              <FalsePositiveSidebar
                activeVuln={activeVuln}
                onVulnSelect={setActiveVuln}
              />
              <FalsePositiveDetailView
                activeVuln={activeVuln}
                onDecision={handleDecision}
                isLoading={isLoading}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis-rules" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 border rounded-md">
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0">
              <AutomationEngine origin="falsepositive_analysis" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FalsePositiveWorkflow;
import React from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeading from '@/components/custom/page-heading';
import PlaygroundForm from './components/playground-form';
import PlaygroundRunsTable from './components/playground-runs-table';

export default function AutomationPlayground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'playground';

  const handleTabChange = (v) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set('tab', v);
      return nextParams;
    });
  };

  return (
    <div className="p-4 flex flex-col gap-4 w-full">
      <Helmet>
        <title>Automation | Playground</title>
      </Helmet>

      <PageHeading
        title="Playground"
        description="Choose an agent, add your files and context, then tell it exactly what to do."
      />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-0"
      >
        <div className="flex items-end justify-between border-b border-border mb-4">
          <TabsList variant="line" className="mb-[-1px]">
            <TabsTrigger value="playground">Playground</TabsTrigger>
            <TabsTrigger value="runs">Runs</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="playground" className="mt-0">
          <PlaygroundForm />
        </TabsContent>

        <TabsContent value="runs" className="mt-0">
          <PlaygroundRunsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

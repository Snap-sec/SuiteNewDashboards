import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AgentsTable from './components/AgentsTable';

export default function AutomationAgents() {

  return (
    <div className="p-4 flex flex-col gap-4">
      <Helmet>
        <title>Automation | Agents</title>
      </Helmet>

      <AgentsTable />
    </div>
  );
}


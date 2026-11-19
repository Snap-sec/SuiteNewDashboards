import React from 'react';
import { Helmet } from 'react-helmet';
import { EmptyScreen } from '@/components/common/empty-screen';

export function EmptyAgents() {
  return (
    <div className="p-4">
      <Helmet>
        <title>VS | Registered Agents</title>
      </Helmet>
      <EmptyScreen
        title="No Agents Registered"
        subTitle="No agents have been registered yet. Install and connect an agent to start scanning assets."
      />
    </div>
  );
}

export default EmptyAgents;

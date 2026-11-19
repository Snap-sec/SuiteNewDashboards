import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useImportAutomationAgentMutation } from '@/services/automation/agentsApi';
import { toast } from 'sonner';
import { useAutomationStore } from '@/pages/automation/store';

export default function AgentCard({ agent }) {
  const navigate = useNavigate();
  const setAgentData = useAutomationStore((state) => state.setAgentData);
  const [importAgent, { isLoading }] = useImportAutomationAgentMutation();

  const id = agent._id || agent.id;
  const title = agent.name || agent.title;

  const handleImport = (e) => {
    e.stopPropagation();
    toast.promise(importAgent(id).unwrap(), {
      loading: 'Importing agent...',
      success: 'Agent imported successfully',
      error: (err) => err?.data?.message || 'Failed to import agent'
    });
  };

  return (
    <Card 
      className="flex flex-col p-5 hover:border-primary/50 cursor-pointer transition-all duration-200"
      onClick={() => {
        setAgentData(agent);
        navigate(`/automation/workflows/${id}?status=view`);
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-secondary/50 rounded-md">
          <Bot className="size-5 text-muted-foreground" />
        </div>
        {agent.imported && (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Imported
          </Badge>
        )}
      </div>

      <h3 className="font-semibold text-base mb-2 line-clamp-2 min-h-[48px] text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-3 mb-6 min-h-[60px]">
        {agent.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleImport}
            disabled={isLoading || agent.imported}
          >
            {agent.imported ? (
              <><Check className="mr-2 size-4" /> Imported</>
            ) : (
              <><Plus className="mr-2 size-4" /> {isLoading ? 'Importing...' : 'Import'}</>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

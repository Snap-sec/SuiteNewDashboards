import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Plus, Settings2 } from 'lucide-react';
import useStore from '../store';
import { Actions } from './actions';
import { ClassifierAlertChannels } from './classifier-alert-channels';
import { ClassifierTriggerActions } from './classifier-trigger-actions';
import { PipelineBlock, ACTION_META } from './pipeline-block';
import DrawerModal from '@/components/custom/drawer-modal';

export function ActionTypeSelector({ properties }) {
  const currentRuleJson = useStore((state) => state.currentRuleJson);
  const setCurrentRuleJson = useStore((state) => state.setCurrentRuleJson);

  const availableActionTypes = properties?.actions || [];
  const actions = currentRuleJson?.actions || [];

  function handleAddAction(actionValue) {
    const selectedAction = availableActionTypes.find(a => a.value === actionValue);
    const config = selectedAction?.config || {};

    let newAction = { type: actionValue, config: {} };

    if (actionValue === 'classify') {
      const setKeys = config.setKeys || [];
      const firstField = setKeys[0]?.field || '';
      newAction.config.set = firstField ? [{ field: firstField, value: '' }] : [];
    }

    if (actionValue === 'alert') {
      const firstChannelType = (config.channels || [])[0] || '';
      const channelConfigs = config.channelConfigs || {};
      const firstSchema = channelConfigs[firstChannelType] || {};
      const defaultConfig = Object.fromEntries(
        Object.keys(firstSchema).map(k => [k, firstSchema[k]?.type === 'array' ? [] : ''])
      );
      newAction.config.channels = [{ type: firstChannelType, config: defaultConfig }];
    }

    if (actionValue === 'trigger') {
      const firstTriggerType = (config.actions || [])[0] || '';
      const actionConfigs = config.actionConfigs || {};
      const firstSchema = actionConfigs[firstTriggerType] || {};
      const defaultConfig = Object.fromEntries(
        Object.keys(firstSchema).map(k => [k, firstSchema[k]?.type === 'array' ? [] : ''])
      );
      newAction = { type: 'trigger', config: { action: firstTriggerType, ...defaultConfig } };
    }

    const newActions = [...actions, newAction];
    setCurrentRuleJson({
      ...currentRuleJson,
      actions: newActions
    });
  }

  function removeAction(indexToRemove) {
    setCurrentRuleJson({
      ...currentRuleJson,
      actions: actions.filter((_, idx) => idx !== indexToRemove)
    });
  }

  const getActionSummary = (action) => {
    if (action.type === 'classify') {
      const field = action.config?.set?.[0]?.field;
      const value = action.config?.set?.[0]?.value;
      if (field && value) return `${field} = ${value}`;
      if (field) return `${field} = ...`;
    }
    if (action.type === 'alert') {
      const ch = action.config?.channels?.[0]?.type;
      if (ch) return ch;
    }
    if (action.type === 'trigger') {
      const trig = action.config?.action;
      if (trig) return trig;
    }
    return 'Not configured';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 w-full justify-between">
          <CardTitle className="flex items-center gap-2">
            Action pipeline
            <span className="flex items-center justify-center bg-muted text-muted-foreground text-[10px] rounded-full h-5 w-5 font-medium">{actions.length}</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-6 min-w-max">
            {actions.map((action, idx) => {
              const title = availableActionTypes.find(a => a.value === action.type)?.label || action.type;

              return (
                <div key={idx} className="flex items-center gap-6 shrink-0">
                  <PipelineBlock
                    title={title}
                    type={action.type}
                    step={idx + 1}
                    totalSteps={actions.length}
                    summary={getActionSummary(action)}
                    onRemove={() => removeAction(idx)}
                    configureDrawer={
                      <DrawerModal
                        width="[500px]"
                        trigger={
                          <Button variant="outline" size="sm" className="w-full mt-2 font-medium">
                            <Settings2 className="mr-2 h-3.5 w-3.5" />
                            Configure
                          </Button>
                        }
                        title={
                          <div className="flex items-center gap-3">
                            {(() => {
                              const meta = ACTION_META[action.type] || ACTION_META.classify;
                              const Icon = meta.icon;
                              return (
                                <>
                                  <div className={cn("p-2 rounded-md", meta.bg)}>
                                    <Icon className={cn("h-5 w-5", meta.color)} />
                                  </div>
                                  <div className="flex flex-col text-left gap-1">
                                    <span className="font-semibold text-base leading-none">{title} action</span>
                                    <span className="text-xs text-muted-foreground font-medium leading-none mt-0.5">step {idx + 1} of {actions.length}</span>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        }
                      >
                        <div className="p-6 overflow-y-auto h-full">
                          {action.type === 'classify' && <Actions properties={properties} actionIndex={idx} />}
                          {action.type === 'alert' && <ClassifierAlertChannels properties={properties} actionIndex={idx} />}
                          {action.type === 'trigger' && <ClassifierTriggerActions properties={properties} actionIndex={idx} />}
                        </div>
                      </DrawerModal>
                    }
                  />
                  <ArrowRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                </div>
              )
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-col items-center justify-center w-[220px] h-[160px] rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors bg-background/50 hover:bg-muted/30 shrink-0">
                  <Plus className="h-6 w-6 mb-2" />
                  <span className="font-medium text-sm">Add action</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[200px]">
                {availableActionTypes.map(action => (
                  <DropdownMenuItem key={action.value} onClick={() => handleAddAction(action.value)}>
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

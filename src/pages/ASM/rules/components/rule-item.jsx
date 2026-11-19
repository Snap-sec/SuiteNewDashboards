import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, GripVertical, Play, Trash, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinners';
import { Tooltip } from '@/components/ui/tooltip';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import Select from '@/components/custom/select';
import SeverityLabel from '../../../../components/custom/severity-label';
import { CustomTooltip } from '../../../../components/custom/tooltip';
import { Badge } from '../../../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch, SwitchWrapper, SwitchIndicator } from '@/components/ui/switch';
import {
  useDeleteAsmRuleMutation,
  useExecuteAsmRuleMutation,
  useToggleAsmRuleStatusMutation,
} from '../../../../services/asm/ruleApi';
import useStore from '../store';
import useGlobalStore from "../../store"
import { useNavigate } from 'react-router';

function RuleItem({ rule, isExecutingRuleSet, priorities, index }) {
  const navigate = useNavigate()
  const setGlobalSelectedRule = useGlobalStore((state) => state.setSelectedRule);
  const globalSelectedRule = useGlobalStore((state) => state.selectedRule);
  const setIsEditingRule = useGlobalStore((state) => state.setIsEditingRule);


  const setSelectedRule = useStore((state) => state.setSelectedRule);
  const selectedRule = useStore((state) => state.selectedRule);
  const setMode = useStore((state) => state.setMode);
  const setShowModal = useStore((state) => state.setShowModal);

  const [runRule] = useExecuteAsmRuleMutation();
  const [deleteRule, { isLoading: isDeletingRule }] = useDeleteAsmRuleMutation();
  const [toggleRule] = useToggleAsmRuleStatusMutation();

  const handleToggle = (checked) => {
    toast.promise(toggleRule({ ruleId: rule._id, enabled: checked }).unwrap(), {
      loading: 'Updating Status',
      success: 'Status Updated',
      error: 'Failed to update status',
    });
  };

  const handleExecuteRule = (id) => {
    toast.promise(runRule(id).unwrap(), {
      loading: 'Running Rule',
      success: 'Rule Executed',
      error: 'Failed to execute rule',
    });
  };

  const handleDelete = (id) => {
    toast.promise(deleteRule(id).unwrap(), {
      loading: 'Removing Rule',
      success: 'Rule Removed',
      error: 'Failed to remove the rule',
    });
  };

  const handleEdit = () => {
    setSelectedRule(rule);
    setMode('update');
    setShowModal(true);

    setGlobalSelectedRule(rule)
    setIsEditingRule(true)
    // navigate to edit rule page
    navigate(`/casm/rules/guided-editor`)
  };

  // DnD kit hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rule._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  const isSelected = selectedRule && selectedRule._id === rule._id;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      aria-selected={isSelected}
      onClick={() => setSelectedRule(rule)}
      className={
        'w-full rounded-md p-4 flex flex-row items-center justify-between border' +
        (isSelected
          ? 'border-2 border-blue-500 w-full rounded-md p-4 flex flex-row items-center justify-between'
          : 'border w-full rounded-md p-4 flex flex-row items-center justify-between')
      }
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <div {...listeners}>
          <GripVertical className="text-gray-400" />
        </div>

        <div className=" space-y-2">
          <div className=" flex gap-4">
            <p className=" font-medium">
              {rule.name}{' '}
              {/* <Select
              className="w-[40px]"
              defaultValue={rule.priority}
              options={priorities}
              enableSearch={false}
              onChange={(option) => updatePriority(option.value)}
            /> */}
            </p>

            <Badge
              variant={
                rule?.exposure_count === 0 ||
                  ['not_exposed', 'safe'].includes(
                    rule?.set?.find((s) => s.field === 'exposure_status')?.value
                  )
                  ? 'success'
                  : 'destructive'
              }
              appearance="light"
              size="sm"
            >
              Assets Matched : {rule?.exposure_count}
            </Badge>

            {rule?.set?.find(s => s.field === 'exposure_status')?.value !== 'not_exposed' && (
              <SeverityLabel severity={rule?.severity} />
            )}


          </div>
          <p className="text-[11px]">{rule.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <CustomTooltip text="Toggle Rule">
          <div onClick={(e) => e.stopPropagation()}>
            <SwitchWrapper className="mr-2">
              <Switch
                checked={rule?.enabled !== false} // Default to true if undefined
                onCheckedChange={(checked) => handleToggle(checked)}
                size="md"
              />
              <SwitchIndicator state="on" className="text-[10px] font-bold">ON</SwitchIndicator>
              <SwitchIndicator state="off" className="text-[10px] font-bold">OFF</SwitchIndicator>
            </SwitchWrapper>
          </div>
        </CustomTooltip>

        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                disabled={isExecutingRuleSet}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExecuteRule(rule._id);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                {isExecutingRuleSet ? (
                  <Spinner className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Execute
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                Edit
              </DropdownMenuItem>

              <div onClick={(e) => e.stopPropagation()}>
                <ButtonWithConfirm
                  variant="ghost"
                  confirm={true}
                  disabled={isDeletingRule}
                  onConfirm={() => handleDelete(rule._id)}
                  confirmButton={<Button variant="primary">Proceed</Button>}
                  cancelButton={<Button variant="outline">Cancel</Button>}
                  className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-destructive hover:text-destructive focus:bg-accent focus:text-destructive"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </ButtonWithConfirm>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}

export default RuleItem;

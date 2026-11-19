import { useCallback, useEffect, useState } from 'react';
import { Pencil, PencilOff, SquarePen } from 'lucide-react';
import { toast } from 'sonner';
import {
  useCreateApisecRuleMutation,
  useUpdateApisecRuleMutation,
} from '@/services/apisec/rulesApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinners';
import Select from '@/components/custom/select';
import YamlEditor from '@/components/custom/yaml-editor/yaml-editor';
import useStore from '../../store';

const SEVERITIES = [
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

function CreateUpdateRule() {
  const [createRule, { isLoading: isCreating }] = useCreateApisecRuleMutation();
  const [updateRule, { isLoading: isUpdating }] = useUpdateApisecRuleMutation();

  const showModal = useStore((state) => state.showModal);
  const setShowModal = useStore((state) => state.setShowModal);
  const mode = useStore((state) => state.mode);
  const setMode = useStore((state) => state.setMode);

  const selectedRule = useStore((state) => state.selectedRule);
  const setSelectedRule = useStore((state) => state.setSelectedRule);

  const getDisplayYaml = useCallback((yamlString) => {
    let regex = /^(description|name|product|severity):.*/;
    let newBody = '';

    for (let line of yamlString?.split('\n') || []) {
      let match = line.match(regex);
      if (!match) {
        newBody += line + '\n';
      }
    }
    return newBody.trim();
  }, []);

  const [ruleName, setRuleName] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [ruleSeverity, setRuleSeverity] = useState('');
  const [yamlContent, setYamlContent] = useState('');

  const DEFAULT_YAML = `rule_name: Privilege Escalation via Method Override

# if this rule matches, for that (host), it will not match again
single_match: true

transform:
  header:
    add:
      X-HTTP-Method-Override: PUT

match_on:
  status: 200
  header:
    X-Admin: "true"
  body:
    contains:
      - "admin"
      - "privilege"

report:
  title: "Privilege Escalation: {{req.method}} Override"
  description: |
    The application accepts privilege escalation through:
    - Method override headers
    - Direct role parameter manipulation

    Original Request:
    {{original}}

    Transformed Request:
    {{req}}

    Response:
    {{res}}

  cwe: "CWE-269"
  cvssScore: "9.8"
  severity: "critical"
  mitigation: |
    1. Use server-side role validation
    2. Ignore X-HTTP-Method-Override
    3. Never trust client-supplied role parameters
  stepsToReproduce: |
    1. Send transformed request to {{req.url}}
    2. Response contains admin indicators
    3. Attacker can modify other user accounts
  tags: "privilege-escalation,authorization,critical"
  impact: "Complete application compromise, data breach"`;

  function resetAll() {
    setRuleName('');
    setRuleDescription('');
    setRuleSeverity('');
    setYamlContent(mode === 'create' ? DEFAULT_YAML : '');
  }

  useEffect(() => {
    if (mode === 'update' && selectedRule) {
      setRuleName(selectedRule.name || '');
      setRuleDescription(selectedRule.description || '');
      setRuleSeverity(selectedRule.severity || '');
      setYamlContent(getDisplayYaml(selectedRule.raw_yaml || '')); // Use getDisplayYaml for initial editor content
    } else if (mode === 'create') {
      // Clear states when in create mode or modal is opened in create mode
      setRuleName('');
      setRuleDescription('');
      setRuleSeverity('');
      setYamlContent(DEFAULT_YAML);
    }
  }, [selectedRule, mode, getDisplayYaml, showModal]);

  const handleAction = () => {
    const basePayload = `
${yamlContent}
    `;

    if (mode === 'create') {
      toast.promise(createRule(basePayload).unwrap(), {
        loading: 'Creating Rule...',
        success: (res) => {
          setShowModal(false);
          setMode('create');
          resetAll();
          return 'Rule Created Successfully!';
        },
        error: (err) => {
          console.error('Failed to create rule:', err);
          return err?.data?.message || 'Failed to create rule.';
        },
      });
    } else if (mode === 'update') {
      toast.promise(
        updateRule({ ruleId: selectedRule._id, yaml: basePayload }).unwrap(),
        {
          loading: 'Updating Rule...',
          success: (res) => {
            setShowModal(false);
            // setMode('create'); // Reset mode after successful update
            // resetAll();
            // setSelectedRule({})
            return 'Rule Updated Successfully!';
          },
          error: (err) => {
            console.error('Failed to update rule:', err);
            return err?.data?.message || 'Failed to update rule.';
          },
        },
      );
    }
  };

  const isLoading = mode === 'create' ? isCreating : isUpdating;

  return (
    <div className="p-4">
      {selectedRule?._id && (
        <p className=" mb-4 font-bold border-l-4 p-2 border-l-blue-500">
          {selectedRule.rule_name}
        </p>
      )}
      <YamlEditor
        yaml={yamlContent}
        onChange={setYamlContent}
        height={`65vh`}
      />
      <div className="flex items-center justify-end gap-2">
        {/* Reset button */}
        {mode === 'create' ? (
          <Button
            onClick={() => {
              setSelectedRule({});
              setMode('create');
              setYamlContent('');
            }}
            disabled={isLoading}
          >
            <PencilOff className="w-4 h-4 mr-2" />
            Reset
          </Button>
        ) : null}

        <Button onClick={handleAction} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner className="w-4 h-4 mr-2 animate-spin" />
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : mode === 'create' ? (
            <>
              <SquarePen className="w-4 h-4 mr-2" />
              Create
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Update
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default CreateUpdateRule;

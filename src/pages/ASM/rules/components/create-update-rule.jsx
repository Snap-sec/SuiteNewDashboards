import { useCallback, useEffect, useState } from 'react'; // Added useCallback

// You'll need to uncomment and import this
import { toast } from 'sonner';
import {
  useCreateAsmRuleMutation,
  useUpdateAsmRuleMutation,
} from '@/services/asm/ruleApi';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Select from '@/components/custom/select';
import YamlEditor from '@/components/custom/yaml-editor/yaml-editor';
import { validateStrictYAML } from '../../../../lib/helpers';
import useStore from '../store';
import { Plus } from 'lucide-react';

const SEVERITIES = [
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

function CreateUpdateRule() {
  const [createRule] = useCreateAsmRuleMutation();
  const [updateRule] = useUpdateAsmRuleMutation(); // Uncomment this when you have the mutation defined

  const showModal = useStore((state) => state.showModal);
  const setShowModal = useStore((state) => state.setShowModal);
  const mode = useStore((state) => state.mode);
  const setMode = useStore((state) => state.setMode); // Import setMode

  const selectedRule = useStore((state) => state.selectedRule);

  // Memoize getDisplayYaml for useEffect dependency
  const getDisplayYaml = useCallback((yamlString) => {
    // let regex = /^(description|name|product|severity):.*/; // Updated regex to match whole lines including colon

    // let newBody = '';

    // for (let line of yamlString?.split('\n') || []) {
    //   let match = line.match(regex);

    //   if (!match) {
    //     // If there's no match, include the line
    //     newBody += line + '\n';
    //   }
    // }
    // return newBody.trim(); // Trim any trailing newline

    return yamlString;
  }, []);

  const [ruleName, setRuleName] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [ruleSeverity, setRuleSeverity] = useState('');
  const [yamlContent, setYamlContent] = useState(''); // Renamed for clarity, this holds the editor's raw content

  const DEFAULT_YAML = `match:
  conditions:
    - field: "type"
      operator: "=="
      value: "certificate"

    - field: "properties.certificate_is_expired"
      operator: "=="
      value: true

set:
  - field: "exposure_status"
    value: "exposed"
  - field: "exposure_reason"
    value: "Expired certificate"`;

  function resetAll() {
    setRuleName('');
    setRuleDescription('');
    setRuleSeverity('');
    // setYamlContent('');
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
  }, [selectedRule, mode, getDisplayYaml]); // getDisplayYaml is now a stable dependency

  const handleAction = () => {
    // Input Validations
    // if (!ruleName.trim() || !ruleDescription.trim()) {
    //   return toast.error('All feilds are required!');
    // }

    const result = validateStrictYAML(yamlContent.trim());
    if (result !== 'Valid YAML rule') {
      return toast.error(validateStrictYAML(yamlContent.trim()));
    }

    // Renamed to handleAction for both create/update
    //     const basePayload = `name: ${ruleName}
    // description: ${ruleDescription}
    // severity: ${ruleSeverity}
    // product: asm
    // ${yamlContent}
    // `;
    const basePayload = `
${yamlContent}
`;

    if (mode === 'create') {
      toast.promise(createRule(basePayload).unwrap(), {
        loading: 'Creating Rule...',
        success: (res) => {
          setShowModal(false);
          setMode('create'); // Reset mode after successful creation
          resetAll();
          return 'Rule Created Successfully!';
        },
        error: (err) => {
          console.error('Failed to create rule:', err);
          return 'Failed to create rule.';
        },
      });
    } else if (mode === 'update') {
      toast.promise(
        updateRule({ ruleId: selectedRule._id, yaml: basePayload }).unwrap(),
        {
          loading: 'Updating Rule...',
          success: (res) => {
            setShowModal(false);
            setMode('create'); // Reset mode after successful update
            resetAll();
            return 'Rule Updated Successfully!';
          },
          error: (err) => {
            console.error('Failed to update rule:', err);
            return 'Failed to update rule.';
          },
        },
      );
      setShowModal(false); // Close modal even if update isn't fully implemented
      setMode('create'); // Reset mode
      resetAll();
    }
  };

  return (
    <Card className="p-4">
      {/* <CardHeader>
                <CardHeading>
                    <CardTitle>Create Rule</CardTitle>
                </CardHeading>
            </CardHeader> */}
      {/* <div className="flex flex-col gap-2">
        <Input
          placeholder="Enter Rule Name"
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
        />
        <Input
          placeholder="Enter Rule Description"
          value={ruleDescription}
          onChange={(e) => setRuleDescription(e.target.value)}
        />
        <Select
          defaultValue={ruleSeverity}
          options={SEVERITIES}
          enableSearch={false}
          onChange={(option) => setRuleSeverity(option.value)}
        />
      </div> */}

      {/* YamlEditor's content is now directly tied to yamlContent state */}
      <YamlEditor yaml={yamlContent} onChange={setYamlContent} />

      <div className="flex items-center justify-end gap-2 mt-2">
        {mode !== "create" && <Button
          variant="outline"
          onClick={() => {
            resetAll();
            setYamlContent(DEFAULT_YAML); // Clear YAML editor
            setMode('create'); // Reset mode
            setShowModal(false); // Close modal
          }}
        >
          Cancel
        </Button>}

        <Button onClick={handleAction}>
          <Plus /> {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </div>
    </Card>
  );
}

export default CreateUpdateRule;

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "@/components/custom/select";
import { toast } from "sonner";


const ScanningScope = forwardRef(function ScanningScope({data, isLoading}, ref) {
  const [rules, setRules] = useState([
    { type: null, value: "" }
  ]);

  const options = [
    { label: "URL", value: "url" },
    { label: "Regex", value: "regex" }
  ];

  // Prefill with scopes
  useEffect(() => {
  if (!data?.data?.configuration?.scope || !Array.isArray(data?.data?.configuration?.scope)) return;

  const normalizedRules = data?.data?.configuration?.scope?.map((item) => ({
    type: options.find((opt) => opt.value === item.type) || null,
    value: item.value || "",
  }));

  setRules(normalizedRules?.filter((item) => item.type && item.value));
}, [data?.data]);


  const addRule = () => {
    setRules([...rules, { type: null, value: "" }]);
  };

  const updateRule = (index, field, newValue) => {
    if(!field.trim() && !newValue?.trim()) return 

    const updated = [...rules];
    updated[index][field] = newValue;
    setRules(updated);
  };

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  useImperativeHandle(ref, () => ({
    getData: () => rules,
  }));

  console.log(rules, "X");
  

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      {rules.map((rule, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="w-50">
            <Select
              options={options}
              placeholder="Select type"
              value={rule.type?.value}
              onChange={(opt) => updateRule(index, 'type', opt)}
            />
          </div>

          <Input
            type="text"
            placeholder="Add value"
            value={rule.value}
            onChange={(e) => updateRule(index, 'value', e.target.value)}
          />

          {rules.length > 1 && (
            <Button variant="ghost" onClick={() => removeRule(index)}>
              <X size={16} />
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="dashed"
        disabled={rules.some((rule) => !rule.type || rule.value.trim() === '')}
        onClick={addRule}
      >
        <Plus /> Add Scope Rule
      </Button>
    </div>
  );
});

export default ScanningScope;
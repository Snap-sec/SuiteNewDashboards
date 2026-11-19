import { Globe, Key } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function ThreeFeilderForm({ adapterType, adapterPayload, onPayloadChange }) {
  const handleInput = (event) => {
    const { name, value } = event.target;

    const newPayload = { ...adapterPayload, [name]: value };
    onPayloadChange(newPayload);
  };

  return (
    <div className="flex flex-col gap-3">
      <InputWrapper>
        <Key />
        <Input
          name="apiKey"
          type="text"
          placeholder="Enter api key"
          value={adapterPayload['apiKey']}
          onChange={handleInput}
        />
      </InputWrapper>

      <InputWrapper>
        <Globe />
        <Input
          name="domain"
          type="text"
          placeholder="Enter domain name"
          onChange={handleInput}
          value={adapterPayload['domain']}
        />
      </InputWrapper>

      <div>
        <Textarea
          className="text-sm text-secondary-foreground font-normal"
          name="name"
          placeholder="Enter description here"
          rows={3}
          onChange={handleInput}
          value={adapterPayload['name']}
        />
      </div>
    </div>
  );
}

export default ThreeFeilderForm;

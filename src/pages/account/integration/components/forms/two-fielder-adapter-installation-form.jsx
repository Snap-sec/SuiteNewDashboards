import { Globe, Info, Key } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function TwoFeilderForm({ adapterType, adapterPayload, onPayloadChange }) {
  const handleInput = (event) => {
    const { name, value } = event.target;

    const newPayload = { ...adapterPayload, [name]: value };
    onPayloadChange(newPayload);
  };

  const useDomainInsteadOfApiKey = ['crt', 'hackertarget', 'gsheet', 'swagger'];
  const isDomainType = useDomainInsteadOfApiKey.includes(adapterType);

  const INPUT_FEILDS = [
    {
      icon: isDomainType ? <Globe /> : <Key />,
      name: isDomainType ? 'domain' : 'apiKey',
      type: 'text',
      placeholder: isDomainType ? 'Enter domain name' : 'Enter API Key',
      feildType: 'input',
    },

    {
      icon: <Info />,
      name: 'name',
      type: 'text',
      placeholder: 'Enter description here',
      feildType: 'textarea',
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {INPUT_FEILDS?.map(({ icon, name, type, placeholder, feildType }) =>
        feildType == 'input' ? (
          <InputWrapper Key={name}>
            {icon}

            <Input
              name={name}
              type={type}
              placeholder={placeholder}
              onChange={handleInput}
              value={adapterPayload[name]}
            />
          </InputWrapper>
        ) : (
          <Textarea
            className="text-sm text-secondary-foreground font-normal"
            name={name}
            placeholder={placeholder}
            rows={3}
            onChange={handleInput}
            value={adapterPayload[name]}
          />
        ),
      )}
    </div>
  );
}

export default TwoFeilderForm;

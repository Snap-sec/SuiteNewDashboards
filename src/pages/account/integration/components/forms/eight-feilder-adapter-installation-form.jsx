import { Fingerprint, Globe, IdCard, Key, Link, Locate } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function EightFeilderForm({ adapterType, adapterPayload, onPayloadChange }) {
  const handleInput = (event) => {
    const { name, value } = event.target;

    const newPayload = { ...adapterPayload, [name]: value };
    onPayloadChange(newPayload);
  };

  const leftFields = [
    {
      name: 'domain',
      icon: <Globe />,
      placeholder: 'Enter domain name',
      type: 'text',
    },
    {
      name: 'fingerprint',
      icon: <Fingerprint />,
      placeholder: 'Enter fingerprint',
      type: 'text',
    },
    {
      name: 'privateKey',
      icon: <Key />,
      placeholder: 'Enter private key',
      type: 'text',
    },
    {
      name: 'region',
      icon: <Locate />,
      placeholder: 'Enter region',
      type: 'text',
    },
  ];

  const rightFields = [
    {
      name: 'apiUrl',
      icon: <Link />,
      placeholder: 'Enter api url',
      type: 'text',
    },
    {
      name: 'tenancyId',
      icon: <IdCard />,
      placeholder: 'Enter tenancy id',
      type: 'text',
    },
    {
      name: 'userId',
      icon: <IdCard />,
      placeholder: 'Enter user id',
      type: 'text',
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className=" flex flex-col lg:flex-row gap-5">
        {/* Left side feilds */}
        <div className=" w-full lg:w-1/2 flex flex-col gap-3">
          {leftFields?.map(({ name, type, icon, placeholder }) => (
            <InputWrapper Key={name}>
              {icon}

              <Input
                name={name}
                type={type}
                placeholder={placeholder}
                value={adapterPayload[name]}
                onChange={handleInput}
              />
            </InputWrapper>
          ))}
        </div>

        {/* Right side feilds */}
        <div className="w-full lg:w-1/2 flex flex-col gap-3">
          {rightFields?.map(({ name, type, icon, placeholder }) => (
            <InputWrapper Key={name}>
              {icon}

              <Input
                name={name}
                type={type}
                placeholder={placeholder}
                value={adapterPayload[name]}
                onChange={handleInput}
              />
            </InputWrapper>
          ))}
        </div>
      </div>

      <div>
        <Textarea
          className="text-sm text-secondary-foreground font-normal"
          name="name"
          placeholder="Enter description here"
          rows={4}
          onChange={handleInput}
          value={adapterPayload['name']}
        />
      </div>
    </div>
  );
}

export default EightFeilderForm;

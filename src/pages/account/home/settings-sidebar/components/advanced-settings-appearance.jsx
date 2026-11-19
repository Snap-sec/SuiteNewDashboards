import { CircleCheck } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { toast, Toaster } from 'sonner';

const AdvancedSettingsAppearance = ({ title }) => {
  const { theme, setTheme } = useTheme();

  const items = [
    {
      image: '28.jpg',
      label: 'Dark',
      value: 'dark',
    },
    {
      image: '32.jpg',
      label: 'Light',
      value: 'light',
    },
    {
      image: '30.jpg',
      label: 'System',
      value: 'system',
    },
  ];

  const handleThemeChange = (nextTheme, label) => {
    if (theme === nextTheme) return;

    setTheme(nextTheme);

    toast.success(`${label} mode enabled`);
  };

  const renderItem = (item, index) => {
    const isChecked = theme === item.value;

    return (
      <div
        key={index}
        onClick={() => handleThemeChange(item.value, item.label)}
        className="cursor-pointer"
      >
        <Label
          className="flex items-end border bg-no-repeat bg-cover border-input rounded-xl 
                     has-checked:border-green-500 has-checked:border-3 
                     has-checked:[&_.checked]:flex h-[170px] mb-0.5"
          style={{
            backgroundImage: `url(${toAbsoluteUrl(
              `/media/images/600x400/${item.image}`
            )})`,
          }}
        >
          <Input
            className="absolute opacity-0 w-0 h-0"
            type="radio"
            name="appearance_option"
            checked={isChecked}
            readOnly
          />

          <CircleCheck
            size={20}
            className="checked ms-5 mb-5 text-xl text-green-500 leading-none hidden"
          />
        </Label>

        <span className="text-sm font-medium text-mono">
          {item.label}
        </span>
      </div>
    );
  };

  return (
    <>
 

      <Card>
        <CardHeader id="advanced_settings_appearance">
          <CardTitle>{title || 'Appearance'}</CardTitle>
        </CardHeader>

        <CardContent className="lg:py-7.5">
          <div className="mb-5">
            <h3 className="text-base font-medium text-mono">Theme mode</h3>
            <span className="text-sm text-secondary-foreground">
              Select or customize your UI theme
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
            {items.map(renderItem)}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export { AdvancedSettingsAppearance };

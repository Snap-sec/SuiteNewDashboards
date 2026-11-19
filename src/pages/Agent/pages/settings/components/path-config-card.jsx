import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function PathConfigCard({ title, icon: Icon, iconClassName, placeholder, paths, onChange }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() && !paths.includes(inputValue.trim())) {
      onChange([...paths, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (pathToRemove) => {
    onChange(paths.filter((p) => p !== pathToRemove));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {Icon && <Icon size={16} className={iconClassName} />}
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className=" text-sm"
          />
          <Button
            onClick={handleAdd}
            variant="outline"
            className="shrink-0 bg-transparent hover:bg-accent"
          >
            <Plus size={16} />
          </Button>
        </div>
        <div className="space-y-2 h-70 kt-scrollable-y-auto">
          {paths.map((path) => (
            <div key={path} className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/50 bg-accent/20 font-mono text-sm text-foreground">
              {path}
              <button
                onClick={() => handleRemove(path)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {paths.length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-2">
              No paths configured
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

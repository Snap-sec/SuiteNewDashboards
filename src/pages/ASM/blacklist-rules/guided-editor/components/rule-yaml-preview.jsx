import React from 'react';
import { Textarea } from '@/components/ui/textarea';

export const RuleYamlPreview = ({ formValues }) => {
  const renderNode = (node, indentLevel) => {
    const indent = '  '.repeat(indentLevel);
    if (!node) return '';
    
    if (node.type === 'group') {
      let str = `${indent}- type: group\n`;
      str += `${indent}  logicalOp: '${node.operator || 'AND'}'\n`;
      str += `${indent}  children:\n`;
      (node.children || []).forEach(child => {
        str += renderNode(child, indentLevel + 2);
      });
      return str;
    }
    
    let str = `${indent}- type: condition\n`;
    str += `${indent}  field: ${node.key || ''}\n`;
    str += `${indent}  operator: '${node.operator || '=='}'\n`;
    str += `${indent}  value: ${node.value || ''}\n`;
    if (node.transformer) str += `${indent}  transformer: ${node.transformer}\n`;
    return str;
  };

  const generateYAMLPreview = () => {
    let str = `name: '${formValues.name || ''}'\n`;
    str += `description: '${formValues.description || ''}'\n`;
    str += `action: 'blacklist'\n`;
    str += `match:\n`;
    str += renderNode(formValues.conditions, 1);
    return str;
  };

  return (
    <div className="w-[350px] border-l flex flex-col bg-muted/30">
      <div className="px-4 py-3 border-b flex justify-between items-center bg-background backdrop-blur">
        <h2 className="font-semibold text-sm tracking-wide">
          Rule Structure Preview
        </h2>
      </div>
      <Textarea
        className="flex-1 p-4 text-xs font-mono leading-relaxed resize-none outline-none border-none bg-transparent"
        value={generateYAMLPreview()}
        readOnly
        spellCheck="false"
      />
    </div>
  );
};

export default RuleYamlPreview;

import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';

// Ace modes & tools
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/ext-language_tools';

// Themes
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';

// Theme hook
import useThemeLoader from '@/hooks/use-theme-loader';

const YamlEditor = ({
  yaml,
  onChange,
  height = '400px',
  readOnly = false,
}) => {
  const { resolvedTheme } = useThemeLoader();
  const [editorTheme, setEditorTheme] = useState('monokai');

  useEffect(() => {
    const loadTheme = async () => {
      let themeName;
      if (resolvedTheme === 'dark') {
        themeName = 'monokai';
      } else {
        themeName = 'github';
      }
      setEditorTheme(themeName);
    };

    loadTheme();
  }, [resolvedTheme]);

  const handleChange = (newValue) => {
    if (!readOnly && onChange) {
      onChange(newValue);
      console.log('YAML updated:', newValue);
    }
  };

  return (
    <div className="yaml-editor-container p-1 rounded-lg">
      <h2
        style={{
          color: resolvedTheme === 'dark' ? '#eee' : '#333',
          fontSize: '14px',
          marginBottom: '6px',
        }}
      >
        YAML {readOnly ? 'Viewer' : 'Editor'}
      </h2>

      <AceEditor
        key={editorTheme}
        mode="yaml"
        theme={editorTheme}
        name="yaml-editor"
        value={yaml}
        onChange={handleChange}
        readOnly={readOnly}
        width="100%"
        height={height}
        fontSize={14}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          useWorker: false,
          showPrintMargin: false,
          tabSize: 2,
          showGutter: true,
          highlightActiveLine: !readOnly,
          highlightGutterLine: !readOnly,
          enableBasicAutocompletion: !readOnly,
          enableLiveAutocompletion: !readOnly,
          enableSnippets: !readOnly,
        }}
      />
    </div>
  );
};

export default YamlEditor;

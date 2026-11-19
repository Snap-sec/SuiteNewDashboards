import { useEffect, useRef } from 'react';
import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import './custom.css';
import useThemeLoader from '@/hooks/use-theme-loader';

import { codeBlockConfig, codeBlockComponent, codeBlockView } from '@milkdown/components/code-block'




export const Editor = ({ defaultValue, className, readOnly = false, onChange, onUpdate }) => {
  const { themeLoaded, resolvedTheme } = useThemeLoader();
  const crepeRef = useRef(null);
  const editorContainerRef = useRef(null);
  const initialLoadDone = useRef(false);


  useEffect(() => {
    if (!themeLoaded || !editorContainerRef.current) return;

    const crepe = new Crepe({
      root: editorContainerRef.current,
      defaultValue: typeof defaultValue === 'string'
        ? defaultValue
        : '# XSS in Dashboard\n## Summary\n\nlorem ipsum\n\n## Impact\n\nlorem ipsum\n\n## Reproduce\n\n``````',
    });

    crepe.create().then(() => {
      crepe.editor.use(codeBlockComponent);

      crepe.editor.ctx.update(codeBlockConfig.key, (defaultConfig) => ({
        ...defaultConfig,
        expandIcon: '🔽',
        searchIcon: '🔍',
        clearSearchIcon: '❌',
        copyIcon: '📄',
        copyText: 'Copy code',
        searchPlaceholder: 'Find a language...',
        noResultText: 'No language found',
        previewLabel: 'Preview',
      }));

      crepe.setReadonly(readOnly);

      crepe.on((listener) => {
        listener.markdownUpdated((ctx, markdown) => {
          if (initialLoadDone.current) {
            onChange?.(markdown); // only after initial load
          } else {
            initialLoadDone.current = true;
          }
        });
        listener.updated((ctx, doc, prevDoc) => {
          onUpdate?.(doc);
        });
        // etc for other events…
      });
    });

    crepeRef.current = crepe;

    return () => {
      crepe.destroy();
    };
  }, [themeLoaded]);

  useEffect(() => {
    if (crepeRef.current) {
      crepeRef.current.setReadonly(readOnly);
    }
  }, [readOnly]);

  return (
    <div className={className}>
      <div ref={editorContainerRef} />
    </div>
  );
};
// src/components/custom/MarkdownViewer.jsx

import React, { useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { Marked } from 'marked';

const MarkdownViewer = ({ markdown = '' }) => {
  // Copy button handler
  useEffect(() => {
    const handleCopy = (e) => {
      const button = e.target.closest('.copy-button');

      if (!button) return;

      const code = decodeURIComponent(button.dataset.code || '');

      navigator.clipboard.writeText(code);

      const span = button.querySelector('span');

      if (!span) return;

      const original = span.textContent;

      span.textContent = 'Copied!';

      setTimeout(() => {
        span.textContent = original;
      }, 2000);
    };

    document.addEventListener('click', handleCopy);

    return () => {
      document.removeEventListener('click', handleCopy);
    };
  }, []);

  const html = useMemo(() => {
    try {
      const markedInstance = new Marked();

      const renderer = {
        code({ text, lang }) {
          const language = (lang || 'code').split(/[\s,]+/)[0];

          // Escape HTML
          const escapedHtml = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

          return `
            <div class="code-block-wrapper my-6 overflow-hidden rounded-xl border border-zinc-800">

              <div class="code-block-header flex items-center justify-between bg-zinc-900 px-4 py-2 text-xs text-zinc-400">

                <span class="uppercase tracking-widest opacity-70">
                  ${language}
                </span>

                <button
                  class="copy-button flex items-center gap-2 hover:opacity-80 transition"
                  data-code="${encodeURIComponent(text)}"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>

                    <path
                      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                    ></path>
                  </svg>

                  <span>Copy code</span>
                </button>
              </div>

              <pre class="overflow-x-auto bg-zinc-950 p-4 text-sm">
                <code class="language-${language}">
${escapedHtml}
                </code>
              </pre>

            </div>
          `;
        },
      };

      markedInstance.use({
        renderer,
        gfm: true,
        breaks: true,
      });

      const rawHtml = markedInstance.parse(markdown || '');

      return DOMPurify.sanitize(rawHtml);
    } catch (e) {
      console.error('Markdown parse error:', e);

      return `<pre>${markdown}</pre>`;
    }
  }, [markdown]);

  return (
    <div
      className="prose prose-sm md:prose-base dark:prose-invert max-w-none leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};

export { default as LightweightMarkdown } from './lightweight-markdown';
export default MarkdownViewer;

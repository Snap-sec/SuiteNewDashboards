// src/components/custom/lightweight-markdown.jsx
import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { Marked } from 'marked';

/**
 * LightweightMarkdown
 * A minimal, compact markdown renderer designed for reports and print layouts.
 * Relies on standard Marked parser + scoped CSS styling to avoid heavy margins,
 * dark chat boxes, and bloated padding.
 */
const LightweightMarkdown = ({ markdown = '', className = '' }) => {
  const html = useMemo(() => {
    if (!markdown || typeof markdown !== 'string') return '';

    try {
      const markedInstance = new Marked({
        gfm: true,
        breaks: true,
      });

      const rawHtml = markedInstance.parse(markdown);
      return DOMPurify.sanitize(rawHtml);
    } catch (e) {
      console.error('LightweightMarkdown parse error:', e);
      return `<p class="whitespace-pre-wrap">${markdown}</p>`;
    }
  }, [markdown]);

  return (
    <div
      className={`lightweight-markdown text-sm text-gray-700 leading-relaxed break-words
        [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_p]:leading-relaxed
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 [&_ol]:space-y-0.5
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_ul]:space-y-0.5
        [&_li]:my-0.5 [&_li]:leading-relaxed
        [&_li>ol]:my-0.5 [&_li>ul]:my-0.5
        [&_pre]:my-2 [&_pre]:p-2.5 [&_pre]:bg-gray-50 [&_pre]:border [&_pre]:border-gray-200 [&_pre]:rounded [&_pre]:overflow-x-auto
        [&_code]:font-mono [&_code]:text-xs [&_code]:bg-gray-100 [&_code]:text-gray-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-800 [&_pre_code]:text-xs
        [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:my-1.5 [&_blockquote]:text-gray-600 [&_blockquote]:italic
        [&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-2 [&_h1]:mb-1 [&_h1]:text-gray-900
        [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1 [&_h2]:text-gray-900
        [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:mt-1.5 [&_h3]:mb-0.5 [&_h3]:text-gray-900
        [&_strong]:font-semibold [&_strong]:text-gray-900
        [&_a]:text-indigo-600 [&_a]:underline [&_a]:break-all
        [&_table]:min-w-full [&_table]:text-xs [&_table]:border [&_table]:border-gray-200 [&_table]:my-1.5
        [&_th]:border-b [&_th]:border-gray-200 [&_th]:p-1.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-900
        [&_td]:border-b [&_td]:border-gray-100 [&_td]:p-1.5
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default LightweightMarkdown;

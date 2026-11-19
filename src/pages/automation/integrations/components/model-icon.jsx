import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MODEL_ICON_MAP = {
  openai: '/new-adapter-logos/openai.svg',
  'gpt-4': '/new-adapter-logos/openai.svg',
  'gpt-4o': '/new-adapter-logos/openai.svg',
  chatgpt: '/new-adapter-logos/openai.svg',
  claude: '/new-adapter-logos/claude.svg',
  anthropic: '/new-adapter-logos/claude.svg',
  gemini: '/new-adapter-logos/gemini.svg',
  google: '/new-adapter-logos/gemini.svg',
  deepseek: '/new-adapter-logos/deepseek.svg',
  snapiq: '/new-adapter-logos/snapiq.svg',
  snapsec: '/new-adapter-logos/snapsec.svg',
  openrouter: '/new-adapter-logos/openrouter.svg',
  aim: '/new-adapter-logos/aim.svg',
  azure: '/new-adapter-logos/azure.svg',
  'azure-openai': '/new-adapter-logos/azure.svg',
  aws: '/new-adapter-logos/aws.svg',
  bedrock: '/new-adapter-logos/aws.svg',
  gcp: '/new-adapter-logos/gcp.svg',
  vertex: '/new-adapter-logos/gcp.svg',
  github: '/new-adapter-logos/github.svg',
  gitlab: '/new-adapter-logos/gitlab.svg',
  jira: '/new-adapter-logos/jira.svg',
  slack: '/new-adapter-logos/slack.svg',
  trivy: '/new-adapter-logos/trivy.svg',
  nuclei: '/new-adapter-logos/nuclei.svg',
  semgrep: '/new-adapter-logos/semgrep.svg',
};

/**
 * Returns the icon image URL for a given adapter/model type.
 */
export const getModelIconSrc = (type) => {
  if (!type) return null;
  const key = String(type).trim().toLowerCase();

  if (MODEL_ICON_MAP[key]) return MODEL_ICON_MAP[key];

  if (key.includes('openai') || key.includes('gpt')) return MODEL_ICON_MAP.openai;
  if (key.includes('claude') || key.includes('anthropic')) return MODEL_ICON_MAP.claude;
  if (key.includes('gemini') || key.includes('google')) return MODEL_ICON_MAP.gemini;
  if (key.includes('deepseek')) return MODEL_ICON_MAP.deepseek;
  if (key.includes('snapiq') || key.includes('snapsec')) return MODEL_ICON_MAP.snapiq;
  if (key.includes('openrouter')) return MODEL_ICON_MAP.openrouter;
  if (key.includes('aim')) return MODEL_ICON_MAP.aim;
  if (key.includes('azure')) return MODEL_ICON_MAP.azure;
  if (key.includes('aws') || key.includes('bedrock')) return MODEL_ICON_MAP.aws;

  return null;
};

/**
 * Reusable component that accepts a model/adapter `type` and renders its logo icon.
 */
export default function ModelIcon({
  type,
  className,
  imgClassName,
  fallback,
}) {
  const [hasError, setHasError] = useState(false);
  const iconSrc = getModelIconSrc(type);
  const isWhiteIcon = iconSrc?.includes('openai');

  if (!iconSrc || hasError) {
    if (fallback) return fallback;
    return (
      <span
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-md border border-border/50 bg-muted/40 text-muted-foreground',
          className
        )}
      >
        <Bot className="size-3.5" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-md border border-border/40 p-0.5 overflow-hidden',
        isWhiteIcon
          ? 'bg-slate-900 dark:bg-muted/40 border-slate-800 dark:border-border/40'
          : 'bg-muted/40',
        className
      )}
    >
      <img
        src={iconSrc}
        alt={type || 'Model Icon'}
        onError={() => setHasError(true)}
        className={cn(
          'size-4 object-contain',
          isWhiteIcon && 'brightness-100',
          imgClassName
        )}
      />
    </span>
  );
}

ModelIcon.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
  fallback: PropTypes.node,
};

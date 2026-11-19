import { useState } from 'react';
import { Check, TriangleAlert } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CodeBlock, Pill, StepList } from '../../components';
import { McpOrgToggle } from '../../components/mcp-org-toggle';

const IDES = [
  {
    id: 'antigravity',
    label: 'Antigravity',
    icon: (
      <img
        src="/media/brand-logos/antigravity.svg"
        className="w-full h-full object-contain"
        alt="Antigravity"
      />
    ),
  },
  {
    id: 'codex',
    label: 'Codex CLI',
    icon: (
      <svg
        className="w-full h-full object-contain"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
          fill="#10A37F"
        />
      </svg>
    ),
  },
  {
    id: 'cursor',
    label: 'Cursor',
    icon: (
      <img
        src="/media/brand-logos/cursor-ai.svg"
        className="w-full h-full object-contain"
        alt="Cursor"
      />
    ),
  },
  {
    id: 'vscode',
    label: 'VS Code',
    icon: (
      <svg
        className="w-full h-full object-contain"
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M110.2 16.4L78 2.2c-2.4-1.1-5.1-.3-6.5 1.9L46.8 45.4 17.5 22.8c-2.1-1.6-5.1-1-6.5 1.3L1.5 39.8c-1.3 2.1-.8 4.9 1.1 6.4l28.6 22-28.7 22c-1.9 1.5-2.4 4.3-1.1 6.4l9.5 15.7c1.4 2.3 4.4 2.9 6.5 1.3l29.3-22.6 24.7 41.3c1.4 2.2 4.1 3 6.5 1.9l32.2-14.2c2.4-1.1 3.5-3.8 2.4-6.2V22.6c1.2-2.4-1-5.1-3.4-6.2zM80.5 91.5L50.4 64.2l30.1-27.3v54.6z"
          fill="#007acc"
        />
      </svg>
    ),
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    icon: (
      <img
        src="/media/brand-logos/windsurf.svg"
        className="w-full h-full object-contain"
        alt="Windsurf"
      />
    ),
  },
  {
    id: 'zed',
    label: 'Zed',
    icon: (
      <svg
        className="w-full h-full object-contain"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#1348DC"
          fillRule="evenodd"
          d="M9 6a3 3 0 0 0-3 3v66H0V9a9 9 0 0 1 9-9h80.379c4.009 0 6.016 4.847 3.182 7.682L43.055 57.187H57V51h6v7.688a4.5 4.5 0 0 1-4.5 4.5H37.055L26.743 73.5H73.5V36h6v37.5a6 6 0 0 1-6 6H20.743L10.243 90H87a3 3 0 0 0 3-3V21h6v66a9 9 0 0 1-9 9H6.621c-4.009 0-6.016-4.847-3.182-7.682L52.757 39H39v6h-6v-7.5a4.5 4.5 0 0 1 4.5-4.5h21.257l10.5-10.5H22.5V60h-6V22.5a6 6 0 0 1 6-6h52.757L85.757 6H9Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

function ClickToCopy({ text }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success('Value copied to clipboard');
  };

  return (
    <span
      onClick={handleCopy}
      className="inline-flex items-center gap-1 cursor-pointer"
      title="Click to copy"
    >
      <span>"{text}"</span>
    </span>
  );
}

const getMcpConfig = (mcpUrl) => ({
  antigravity: {
    filename: '~/.gemini/config/mcp_config.json',
    snippet: `{
  "SnapsecMCP": {
    "$typeName": "exa.cascade_plugins_pb.CascadePluginCommandTemplate",
    "command": "npx",
    "args": [
      "-y",
      "mcp-remote",
      "${mcpUrl}/mcp",
      "--header",
      "x-api-key: your-api-key-here"
    ],
    "env": {}
  }
}`,
    steps: [
      {
        title: 'Locate the config file',
        body: (
          <>
            Antigravity reads MCP configuration from
            ~/.gemini/config/mcp_config.json. Open this file in your text
            editor, or press Ctrl+Shift+P to open the command palette, search
            for <ClickToCopy text="Manage MCP Servers" />, and click "View raw
            config".
          </>
        ),
      },
      {
        title: 'Paste the snippet',
        body: 'Copy the config block and merge it into your existing configuration. Make sure it is properly formatted JSON.',
      },
      {
        title: 'Set your API key',
        body: 'Replace "your-api-key-here" with the API key from your dashboard.',
      },
      {
        title: 'Connect',
        body: 'Restart your Antigravity IDE, or click the "Refresh" button in the Manage MCP Servers panel. The MCP server will be loaded automatically and available to use.',
      },
    ],
  },
  cursor: {
    filename: '~/.cursor/mcp.json',
    snippet: `{
  "mcpServers": {
    "my-mcp": {
      "command": "npx",
      "args": ["-y", "@myorg/mcp-server@latest"],
      "env": {
        "MCP_API_KEY": "your-api-key-here"
      }
    }
  }
}`,
    steps: [
      {
        title: 'Open MCP Settings',
        body: 'In Cursor, open the Command Palette (⌘⇧P) and search for "MCP: Open Settings". Alternatively, navigate to Settings → MCP Servers.',
      },
      {
        title: 'Add the configuration',
        body: "Paste the config snippet into your mcp.json file. If the file doesn't exist, create it at the path shown above.",
      },
      {
        title: 'Set your API key',
        body: 'Replace "your-api-key-here" with the API key from your dashboard. Never commit this value to version control — use an environment variable or secret manager instead.',
      },
      {
        title: 'Reload Cursor',
        body: 'Restart Cursor or run Reload Window (⌘⇧P → Reload Window). The MCP server will appear under the MCP panel once connected.',
      },
    ],
  },
  windsurf: {
    filename: '~/.codeium/windsurf/mcp_config.json',
    snippet: `{
  "mcpServers": {
    "my-mcp": {
      "command": "npx",
      "args": ["-y", "@myorg/mcp-server@latest"],
      "env": {
        "MCP_API_KEY": "your-api-key-here"
      }
    }
  }
}`,
    steps: [
      {
        title: 'Locate the config directory',
        body: "Windsurf reads MCP configuration from ~/.codeium/windsurf/mcp_config.json. Create this file if it doesn't already exist.",
      },
      {
        title: 'Paste the snippet',
        body: 'Copy the config block and paste it into mcp_config.json. Windsurf supports multiple servers — add additional entries under mcpServers as needed.',
      },
      {
        title: 'Inject your credentials',
        body: 'Set MCP_API_KEY to your secret key. Windsurf can also pick this up from a .env file in your project root — set MCP_API_KEY="sk-..." there.',
      },
      {
        title: 'Connect',
        body: 'Open Windsurf and navigate to the Cascade panel. Click the plug icon to refresh MCP connections. Your server should show a green status indicator.',
      },
    ],
  },
  codex: {
    filename: '~/.codex/config.yaml',
    snippet: `mcp_servers:
  - name: my-mcp
    transport: stdio
    command: npx
    args:
      - "-y"
      - "@myorg/mcp-server@latest"
    env:
      MCP_API_KEY: "your-api-key-here"`,
    steps: [
      {
        title: 'Install Codex CLI',
        body: 'Make sure Codex CLI is installed: npm install -g @openai/codex. Confirm with codex --version before proceeding.',
      },
      {
        title: 'Edit config.yaml',
        body: "Open ~/.codex/config.yaml in any text editor. If it doesn't exist, run codex init to scaffold the default configuration first.",
      },
      {
        title: 'Append the MCP block',
        body: 'Copy the YAML snippet and add it under the mcp_servers key. YAML is indentation-sensitive — ensure the list item (-) aligns correctly with the key.',
      },
      {
        title: 'Verify the connection',
        body: 'Run codex mcp list in your terminal. The server should appear with a ✓ status. If it fails, check the MCP_API_KEY value and confirm npx can resolve the package.',
      },
    ],
  },
  vscode: {
    filename: '.vscode/mcp.json  or  settings.json (global)',
    snippet: `{
  "servers": {
    "my-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@myorg/mcp-server@latest"],
      "env": {
        "MCP_API_KEY": "\${env:MCP_API_KEY}"
      }
    }
  }
}`,
    steps: [
      {
        title: 'Enable MCP in VS Code',
        body: "Ensure you have VS Code 1.99+ with the GitHub Copilot extension installed. MCP support ships with Copilot's agent mode — enable it via Settings → Chat → Agent.",
      },
      {
        title: 'Create mcp.json',
        body: 'For workspace-scoped config, create .vscode/mcp.json at your project root. For global config, add an mcp key inside your user settings.json.',
      },
      {
        title: 'Use env var substitution',
        body: 'VS Code supports ${env:VAR_NAME} syntax in mcp.json — this keeps secrets out of your config file. Set MCP_API_KEY in your shell profile or a .env.local file.',
      },
      {
        title: 'Start the agent',
        body: 'Open the Chat panel, switch to Agent mode (the ✦ icon), and select your MCP server from the tools menu. The server spins up automatically on first use.',
      },
    ],
  },
  zed: {
    filename: '~/.config/zed/settings.json',
    snippet: `{
  "context_servers": {
    "my-mcp": {
      "command": {
        "path": "npx",
        "args": ["-y", "@myorg/mcp-server@latest"],
        "env": {
          "MCP_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}`,
    steps: [
      {
        title: 'Open Zed settings',
        body: 'Use the shortcut ⌘, to open your user settings.json directly in the editor. Zed uses a single JSON file for all configuration.',
      },
      {
        title: 'Add context_servers block',
        body: 'If a context_servers key already exists, merge the inner object. If not, add it at the top level. Zed calls them "context servers" — these are MCP-compatible.',
      },
      {
        title: 'Set the API key',
        body: 'Replace "your-api-key-here" with your actual key. Zed inherits environment variables from the terminal it is launched from.',
      },
      {
        title: 'Reload and confirm',
        body: 'Save settings.json. Zed reloads configuration automatically. Open the Assistant panel and look for your server in the context sources — a checkmark confirms the connection.',
      },
    ],
  },
});

export function McpsTab() {
  const [activeIDE, setActiveIDE] = useState('antigravity');
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '5173');
  const mcpUrl = isLocal
    ? `${window.location.protocol}//${window.location.hostname}:11100`
    : typeof window !== 'undefined'
      ? window.location.origin
      : 'https://staging.snapsec.co';
  const config = getMcpConfig(mcpUrl)[activeIDE];
  const activeMeta = IDES.find((i) => i.id === activeIDE);

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5">
      <Helmet>
        <title>Auth | MCP Access</title>
      </Helmet>

      {/* Enable / Disable mcp */}
      <McpOrgToggle />

      {/* Main Page Content Card */}
      <Card className="pb-0 mb-3 overflow-hidden">
        <CardHeader
          id="mcp_access"
          className="flex flex-col py-3.5 md:flex-row md:items-center justify-between gap-4"
        >
          <div className="space-y-1.5">
            <CardTitle>Connect your IDE</CardTitle>
            <CardDescription>
              Add this server to your development environment to give your AI
              assistant direct access to your project context, tools, and data.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row min-h-[500px]">
            {/* Left sidebar inside card */}
            <aside className="w-full lg:w-56 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-border p-5 bg-muted/10">
              <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3 pl-1">
                IDE / Client
              </div>
              <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {IDES.map((ide) => {
                  const isActive = activeIDE === ide.id;
                  return (
                    <button
                      key={ide.id}
                      onClick={() => setActiveIDE(ide.id)}
                      className={cn(
                        'cursor-pointer flex items-center rounded-lg px-2.5 py-2 border border-transparent text-sm gap-2 w-full justify-start transition-all',
                        isActive
                          ? 'bg-accent text-primary font-medium'
                          : 'text-accent-foreground hover:text-primary hover:bg-accent/40',
                      )}
                    >
                      <span className="flex items-center justify-center w-4 h-4 opacity-90 shrink-0">
                        {ide.icon}
                      </span>
                      <span className="flex-1 text-start">{ide.label}</span>
                      {isActive && (
                        <span className="flex w-1.5 h-1.5 bg-primary rounded-full hidden lg:block"></span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Right details inside card */}
            <main className="flex-1 p-6 flex flex-col gap-6">
              {/* Selected client status */}
              <div className="flex items-center gap-2.5 border-b border-border pb-4">
                <span className="flex items-center justify-center w-5 h-5 text-foreground opacity-80 shrink-0">
                  {activeMeta?.icon}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  Configuration for {activeMeta?.label}
                </h3>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                {/* Left col: CodeBlock + Prerequisites */}
                <div className="space-y-5">
                  <div>
                    <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      Config snippet
                    </h4>
                    <CodeBlock
                      code={config.snippet}
                      filename={config.filename}
                    />
                  </div>

                  {/* Prerequisites Card */}
                  <div className="border border-border bg-muted/10 rounded-xl p-4">
                    <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <span className="text-xs font-semibold">
                        Prerequisites
                      </span>
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Node.js 21+',
                        'npx available in PATH',
                        'An active API key from your dashboard',
                      ].map((req, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2.5 text-xs text-muted-foreground"
                        >
                          <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right col: Setup Guide */}
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Setup guide
                  </h4>
                  <div className="border border-border bg-muted/10 px-4 rounded-xl">
                    <StepList steps={config.steps} />
                  </div>
                </div>
              </div>

              {/* Key warning Alert */}
              <Alert variant="warning" appearance="light">
                <AlertIcon>
                  <TriangleAlert className="size-4" />
                </AlertIcon>
                <AlertContent>
                  <AlertTitle>Keep your API key secret</AlertTitle>
                  <AlertDescription>
                    Never hard-code your API key in committed configuration
                    files. Use environment variables (e.g. in your shell profile{' '}
                    <Pill>~/.zshrc</Pill> or <Pill>~/.bashrc</Pill>) or a secure
                    secrets manager instead. Remember to add local{' '}
                    <Pill>.env</Pill> files to your <Pill>.gitignore</Pill>.
                  </AlertDescription>
                </AlertContent>
              </Alert>
            </main>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

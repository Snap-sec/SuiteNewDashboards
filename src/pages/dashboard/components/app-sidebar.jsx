import {
  Aperture,
  FileText,
  Layers,
  LayoutGrid,
  Radar,
  RefreshCw,
  Settings,
  ShieldAlert,
} from "lucide-react"
import { toast } from "sonner"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const PRIMARY_ITEMS = [
  { id: "assets", label: "Assets", icon: Layers },
  { id: "risks", label: "Risk signals", icon: ShieldAlert, count: 12 },
  { id: "changes", label: "Changes", icon: RefreshCw },
]

const SECONDARY_ITEMS = [
  { id: "scans", label: "Scans", icon: Radar },
  { id: "reports", label: "Reports", icon: FileText },
]

function preview(label) {
  toast.info("Design preview", {
    description: `${label} isn't part of the Surface Command demo.`,
  })
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" aria-label="Workspace navigation">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Aperture"
              render={<a href="#main" aria-label="Aperture home" />}
            >
              <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Aperture className="size-4" aria-hidden="true" />
              </span>
              <span className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Aperture</span>
                <span className="truncate text-xs text-muted-foreground">
                  Surface command
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <nav aria-label="Primary">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive
                    tooltip="Overview"
                    render={
                      <a href="#main" aria-current="page" aria-label="Overview" />
                    }
                  >
                    <LayoutGrid aria-hidden="true" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {PRIMARY_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        type="button"
                        tooltip={item.label}
                        onClick={() => preview(item.label)}
                      >
                        <Icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.count ? (
                        <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  )
                })}

                <SidebarSeparator />

                {SECONDARY_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        type="button"
                        tooltip={item.label}
                        onClick={() => preview(item.label)}
                      >
                        <Icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <nav aria-label="Workspace settings">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                tooltip="Settings"
                onClick={() => preview("Settings")}
              >
                <Settings aria-hidden="true" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </nav>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

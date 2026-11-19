import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar } from "./components/app-sidebar"
import { DashboardContent } from "./components/dashboard-content"
import { TopBar } from "./components/top-bar"

export function DashboardPage() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset id="main" className="min-w-0">
        <TopBar />
        <DashboardContent />
      </SidebarInset>
    </SidebarProvider>
  )
}

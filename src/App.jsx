import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useThemeStore } from "@/store/use-theme-store"

import { DashboardPage } from "@/pages/dashboard"

function AppToaster() {
  const theme = useThemeStore((state) => state.theme)

  return <Toaster theme={theme} position="bottom-right" />
}

export default function App() {
  return (
    <TooltipProvider>
      <DashboardPage />
      <AppToaster />
    </TooltipProvider>
  )
}

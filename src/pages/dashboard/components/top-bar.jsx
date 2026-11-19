import { useEffect, useRef } from "react"

import { Bell, Radar, Search, TriangleAlert } from "lucide-react"

import { Badge } from "@/components/reui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { currentUser, workspace } from "../data/dashboard"
import { useDashboardStore } from "../store/use-dashboard-store"
import { cn } from "@/lib/utils"

const NOTIFICATION_TONES = {
  critical: {
    icon: TriangleAlert,
    className:
      "bg-destructive/10 text-destructive-foreground dark:text-destructive",
  },
  high: {
    icon: TriangleAlert,
    className: "bg-warning/15 text-warning-foreground dark:text-warning",
  },
  info: {
    icon: Radar,
    className: "bg-info/10 text-info-foreground dark:text-info",
  },
}

function scrollToPriorityQueue() {
  const queue = document.getElementById("priority-queue")
  if (!queue) return

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches

  queue.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  })
}

export function TopBar() {
  const searchRef = useRef(null)
  const query = useDashboardStore((state) => state.query)
  const setQuery = useDashboardStore((state) => state.setQuery)
  const notifications = useDashboardStore((state) => state.notifications)
  const markAllRead = useDashboardStore((state) => state.markAllRead)

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length

  useEffect(() => {
    function handleShortcut(event) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
    }

    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [])

  function handleSearchKeyDown(event) {
    if (event.key === "Enter") {
      scrollToPriorityQueue()
    }

    if (event.key === "Escape") {
      setQuery("")
      event.currentTarget.blur()
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-3 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="my-auto hidden h-4 sm:block"
        />
        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground"
            aria-hidden="true"
          >
            {workspace.initials}
          </span>
          <span className="truncate text-xs font-medium">
            {workspace.name}
          </span>
          <Badge variant="outline">{workspace.plan}</Badge>
        </div>
      </div>

      <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:flex-none">
        <div className="min-w-0 max-w-xs flex-1 basis-40 sm:w-64 sm:flex-none">
          <InputGroup>
            <InputGroupAddon>
              <Search aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search priority assets"
              aria-label="Search priority assets"
              autoComplete="off"
            />
            <InputGroupAddon align="inline-end">
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground sm:inline-block">
                ⌘K
              </kbd>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <ThemeToggle />

        <Popover>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="relative"
                aria-label={
                  unreadCount > 0
                    ? `Notifications, ${unreadCount} unread`
                    : "Notifications"
                }
              />
            }
          >
            <Bell aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 size-2 rounded-full bg-destructive ring-2 ring-background"
                aria-hidden="true"
              />
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="flex items-center justify-between gap-2">
              <PopoverTitle className="text-sm font-medium">
                Notifications
              </PopoverTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                {unreadCount === 0 ? "All caught up" : "Mark all read"}
              </Button>
            </div>

            <ul className="flex flex-col divide-y divide-border">
              {notifications.map((notification) => {
                const tone =
                  NOTIFICATION_TONES[notification.tone] ??
                  NOTIFICATION_TONES.info
                const Icon = tone.icon

                return (
                  <li
                    key={notification.id}
                    className="flex items-start gap-2 py-2 first:pt-0 last:pb-0"
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md",
                        tone.className,
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="text-xs leading-relaxed text-foreground">
                        {notification.text}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <>
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Unread</span>
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          </PopoverContent>
        </Popover>

        <div className="relative">
          <span className="sr-only">Signed in as {currentUser.name}</span>
          <Avatar aria-hidden="true">
            <AvatarFallback>{currentUser.initials}</AvatarFallback>
            <AvatarBadge className="bg-success" />
          </Avatar>
        </div>
      </div>
    </header>
  )
}

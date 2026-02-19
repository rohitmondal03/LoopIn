"use client"

import { Button } from "@/components/ui/button"
import { Bell, ChevronDown, Radio } from "lucide-react"
import { useState } from "react"


export function LobbyNav() {
  const [hasNotifications] = useState(true);

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="size-9 rounded-xl bg-primary/20 flex items-center justify-center">
          <Radio className="size-4.5 text-primary" />
        </div>
        <span className="text-foreground font-semibold text-lg tracking-tight">
          LoopIn
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Online indicator */}
        <div className="hidden sm:flex items-center gap-2 glass rounded-xl px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-glow" />
          <span className="text-muted-foreground text-xs font-medium">
            1,247 online
          </span>
        </div>

        {/* Notification bell */}
        <button
          className="relative h-9 w-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          )}
        </button>

        {/* Profile avatar */}
        <Button className="flex items-center gap-2 glass rounded-xl px-2.5 py-1.5 hover:bg-secondary/60 transition-colors">
          <div className="size-7 rounded-lg bg-primary/30 flex items-center justify-center text-primary font-semibold text-xs">
            JD
          </div>
          <span className="hidden sm:block text-foreground text-sm font-medium">
            Jane
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    </nav>
  )
}

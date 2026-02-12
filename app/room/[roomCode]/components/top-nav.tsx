"use client"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"
import { Copy, Settings, ChevronDown, Radio } from "lucide-react"
import { toast } from "sonner"
import SettingsDrawer from "./settings-drawer"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type TTopNavProps = {
  roomCode: string,
  roomName: string,
  isHost?: boolean
}

export function TopNav({ roomCode, isHost, roomName }: TTopNavProps) {

  const handleCopy = (type: "link" | "code") => {
    const text = type === "code" ? roomCode : window.location.href

    try {
      navigator.clipboard.writeText(text)
    } catch (err) {
      toast("Can't copy to clipboard. Please try copying manually.", {
        description: text,
        icon: '😢',
        position: "top-right"
      })
    }

    toast(`${type === "code" ? "Room code" : "Room link"} copied to clipboard!`, {
      icon: '✅',
    })
  }

  return (
    <nav className="glass-strong flex items-center justify-between px-5 py-3 rounded-2xl mx-3 mt-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Radio className="h-4 w-4 text-primary" />
          </div>
          <span className="text-foreground font-semibold text-lg tracking-tight">LoopIn</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border-primary border rounded-xl px-3 py-1.5">
          <span className="text-muted-foreground text-sm font-mono">Room:</span>
          <span className="text-foreground text-sm font-mono font-medium">{roomCode}</span>
          <button
            onClick={() => handleCopy("code")}
            className="text-muted-foreground hover:text-primary transition-colors ml-1"
            aria-label="Copy room code"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 border-primary border rounded-xl px-3 py-1.5">
          <span className="text-sm font-mono">Copy Link</span>
          <button
            onClick={() => handleCopy("link")}
            className="text-muted-foreground hover:text-primary transition-colors ml-1"
            aria-label="Copy room link"
          >
            <Copy className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isHost ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="default" className="size-9 rounded-xl flex items-center justify-center" aria-label="Settings">
                <Settings className="size-4" />
              </Button>
            </DrawerTrigger>
            <SettingsDrawer roomName={roomName} roomCode={roomCode} />
          </Drawer>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 glass rounded-xl px-2 py-1.5 hover:bg-secondary/60 transition-colors">
              <div className="size-7 rounded-lg bg-primary/30 flex items-center justify-center text-primary font-semibold text-xs">
                JD
              </div>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </nav>
  )
}

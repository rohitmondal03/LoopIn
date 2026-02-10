"use client"

import { Button } from "@/components/ui/button"
import { Crown, UserPlus, LogOut, Wifi, WifiOff } from "lucide-react"
import { useState } from "react"

const participants = [
  { id: 1, name: "Jane Doe", initials: "JD", isHost: true, status: "connected" as const, color: "bg-primary" },
  { id: 2, name: "Alex Chen", initials: "AC", isHost: false, status: "connected" as const, color: "bg-chart-2" },
  { id: 3, name: "Sam Rivera", initials: "SR", isHost: false, status: "connected" as const, color: "bg-chart-1" },
  { id: 4, name: "Morgan Lee", initials: "ML", isHost: false, status: "syncing" as const, color: "bg-chart-3" },
  { id: 5, name: "Taylor Kim", initials: "TK", isHost: false, status: "disconnected" as const, color: "bg-muted-foreground" },
]

export function RoomPanel() {
  const [isLive, setIsLive] = useState(true)

  return (
    <aside className="flex flex-col gap-4 h-full">
      {/* Room Header */}
      <div className="glass-strong rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground font-semibold text-base">Movie Night</h2>
          <button
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-1.5"
          >
            <span className={`h-2 w-2 rounded-full ${isLive ? "bg-emerald-400 animate-pulse-glow" : "bg-amber-400"}`} />
            <span className={`text-xs font-medium ${isLive ? "text-emerald-400" : "text-amber-400"}`}>
              {isLive ? "Live" : "Paused"}
            </span>
          </button>
        </div>
        <p className="text-muted-foreground text-xs">
          Session started 42 min ago
        </p>
      </div>

      {/* Participants */}
      <div className="glass-strong rounded-2xl p-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Participants ({participants.length})
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1">
          {participants.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-secondary/40 transition-colors group"
            >
              <div className="relative">
                <div className={`h-8 w-8 rounded-lg ${p.color}/20 flex items-center justify-center text-xs font-semibold`}
                  style={{ color: `hsl(var(--primary))` }}
                >
                  {p.initials}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${
                  p.status === "connected" ? "bg-emerald-400" : p.status === "syncing" ? "bg-amber-400" : "bg-muted-foreground"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-foreground text-sm truncate">{p.name}</span>
                  {p.isHost && (
                    <Crown className="h-3 w-3 text-amber-400 shrink-0" />
                  )}
                </div>
                <span className="text-muted-foreground text-xs capitalize">
                  {p.status === "syncing" ? "Syncing..." : p.status}
                </span>
              </div>
              {p.status === "disconnected" ? (
                <WifiOff className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <Wifi className="h-3.5 w-3.5 text-emerald-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button size={"lg"} className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <UserPlus className="h-4 w-4" />
          Invite
        </Button>
        <Button variant={"destructive"} size={"lg"}>
          <LogOut className="h-4 w-4" />
          Leave Room
        </Button>
      </div>
    </aside>
  )
}

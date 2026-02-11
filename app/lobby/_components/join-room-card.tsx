"use client"

import { useState } from "react"
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  Link2,
  Users,
  Pause,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type JoinState = "idle" | "loading" | "error"

interface RecentRoom {
  id: string
  name: string
  isLive: boolean
  participants: { initials: string; color: string }[]
}

const recentRooms: RecentRoom[] = [
  {
    id: "1",
    name: "Movie Night",
    isLive: true,
    participants: [
      { initials: "AC", color: "bg-chart-2/30 text-chart-2" },
      { initials: "SR", color: "bg-primary/30 text-primary" },
      { initials: "ML", color: "bg-chart-3/30 text-chart-3" },
    ],
  },
  {
    id: "2",
    name: "Lo-fi Chill Session",
    isLive: true,
    participants: [
      { initials: "TK", color: "bg-chart-2/30 text-chart-2" },
      { initials: "JD", color: "bg-primary/30 text-primary" },
    ],
  },
  {
    id: "3",
    name: "Documentary Club",
    isLive: false,
    participants: [
      { initials: "RW", color: "bg-chart-3/30 text-chart-3" },
    ],
  },
]

function AvatarGroup({
  participants,
}: {
  participants: RecentRoom["participants"]
}) {
  return (
    <div className="flex -space-x-1.5">
      {participants.map((p) => (
        <div
          key={p.initials}
          className={cn(
            "h-6 w-6 rounded-md flex items-center justify-center text-[9px] font-semibold ring-2 ring-card",
            p.color
          )}
        >
          {p.initials}
        </div>
      ))}
    </div>
  )
}

function EmptyRecentRooms() {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-2">
      <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
        <Users className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-xs text-center">
        No recent rooms yet
      </p>
    </div>
  )
}

export function JoinRoomCard() {
  const [roomCode, setRoomCode] = useState("")
  const [joinState, setJoinState] = useState<JoinState>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [showEmpty] = useState(false)

  const handleJoin = () => {
    if (!roomCode.trim()) {
      setJoinState("error")
      setErrorMessage("Please enter a room code or invite link")
      return
    }

    setJoinState("loading")
    setErrorMessage("")

    // Simulate validation
    setTimeout(() => {
      if (roomCode.toUpperCase() === "INVALID") {
        setJoinState("error")
        setErrorMessage("Room not found. Check the code and try again.")
      } else {
        setJoinState("idle")
        setRoomCode("")
      }
    }, 1500)
  }

  return (
    <div className="glass-strong rounded-2xl p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Link2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-base">
            Join a Room
          </h3>
          <p className="text-muted-foreground text-xs">
            Enter a code or link to join
          </p>
        </div>
      </div>

      {/* Input + Button */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <Input
              placeholder="Room code or invite link"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value)
                if (joinState === "error") {
                  setJoinState("idle")
                  setErrorMessage("")
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoin()
              }}
              disabled={joinState === "loading"}
              className={cn(
                "h-11 rounded-xl bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground/50 font-mono text-sm focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-colors",
                joinState === "error" &&
                  "border-destructive/60 focus-visible:ring-destructive/40"
              )}
            />
            <Button
              onClick={handleJoin}
              disabled={joinState === "loading"}
              className="h-11 px-5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all shrink-0"
            >
              {joinState === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Join
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
          {joinState === "error" && errorMessage && (
            <p className="text-destructive text-xs flex items-center gap-1 animate-slide-in">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errorMessage}
            </p>
          )}
        </div>
        <p className="text-muted-foreground/60 text-xs">
          Get a code from your friend to join their room
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-border/50" />
        <span className="text-muted-foreground/50 text-[10px] uppercase tracking-widest">
          Recent
        </span>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* Recent Rooms */}
      <div className="flex-1 mt-3 overflow-y-auto scrollbar-thin">
        {showEmpty ? (
          <EmptyRecentRooms />
        ) : (
          <div className="flex flex-col gap-1.5">
            {recentRooms.map((room) => (
              <button
                key={room.id}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-secondary/40 transition-colors text-left group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-medium truncate">
                      {room.name}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
                        room.isLive
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-amber-400/10 text-amber-400"
                      )}
                    >
                      {room.isLive ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
                          Live
                        </>
                      ) : (
                        <>
                          <Pause className="h-2.5 w-2.5" />
                          Paused
                        </>
                      )}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {room.participants.length} watching
                  </span>
                </div>
                <AvatarGroup participants={room.participants} />
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

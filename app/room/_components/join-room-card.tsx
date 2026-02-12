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
import RecentRoomItem from "./recent-room-item"

type JoinState = "idle" | "loading" | "error"


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

type TJoinRoomCardProps = {
  recentRooms: Room[]
}

export function JoinRoomCard({ recentRooms }: TJoinRoomCardProps) {
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
            {recentRooms.map((room) =>
              <RecentRoomItem key={room.id} room={room} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

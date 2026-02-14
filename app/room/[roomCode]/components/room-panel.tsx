"use client"

import { useMemo, useState } from "react"
import { UserPlus, LogOut } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import RoomParticipantCard from "./room-participant-card"

export function RoomPanel({ roomName, roomCode, roomId, isPrivate, createdAt }: {
  roomName: string,
  roomCode: string,
  roomId: string,
  isPrivate: boolean,
  createdAt: Date
}) {
  const [isLive, setIsLive] = useState(true)

  const createdAtString = useMemo(() => {
    const date = parseISO(createdAt.toString());
    return format(date, "MMM d, yyyy h:mm a");
  }, [createdAt])

  return (
    <aside className="flex flex-col gap-4 h-full">
      {/* Room Header */}
      <div className="glass-strong rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground font-bold text-xl underline-offset-4 underline">{roomName}</h2>
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
          Room created at {" "}
          <span className="text-foreground">{createdAtString}</span>
        </p>
      </div>

      {/* Participants */}
      <RoomParticipantCard roomId={roomId} roomCode={roomCode} />

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

"use client"

import React, { useState } from "react"
import {
  ArrowRight,
  Link2,
  Users,
  Loader,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import RecentRoomItem from "./recent-room-item"
import { isRoomOwner, isRoomPrivate } from "@/lib/actions/room"
import { RoomPasswordDialog } from "./room-password-dialog"


function EmptyRecentRooms() {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-2">
      <div className="size-10 rounded-xl bg-secondary flex items-center justify-center">
        <Users className="size-5 text-muted-foreground" />
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
  const [roomCode, setRoomCode] = useState("");
  const [isPrivateRoom, setPrivateRoom] = useState(false)
  const [isLoading, setLoading] = useState(false);


  // join room by CODE
  const handleJoin = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!roomCode || roomCode.trim().length === 0) {
      toast.error("Room code cannot be empty", {
        icon: '⚠️',
        style: {
          background: "red",
          color: "white",
        }
      });
      return;
    }

    setLoading(true);

    await isRoomOwner(roomCode)
      .then(isOwner => {
        if (isOwner) {
          toast.error("Cannot join your own room", {
            icon: "⚠️",
            style: {
              background: "red",
              color: "white",
            }
          })
        }

        return;
      })

    // check if room is private
    await isRoomPrivate(roomCode)
      .then((data) => {
        setPrivateRoom(data.is_private);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setLoading(false))
  }


  return (
    <>
      <div className="glass-strong rounded-2xl p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Link2 className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold text-base">
              Join a Room
            </h3>
            <p className="text-muted-foreground text-xs">
              Enter room code
            </p>
          </div>
        </div>

        {/* Input + Button */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-col gap-1.5">
            <form onSubmit={handleJoin} className="flex gap-2">
              <Input
                placeholder="Room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                disabled={isLoading}
                className={
                  "h-11 rounded-xl bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground/50 font-mono text-sm focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-colors"}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 px-5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all shrink-0"
              >
                {isLoading ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  <>
                    Join
                    <ArrowRight className="size-4 ml-1" />
                  </>
                )}
              </Button>
            </form>
          </div>
          <p className="text-muted-foreground/60 text-xs">
            Get a code from your friend to join their room
          </p>
        </div>

        {/* If room is private, then this dialog will open to enter password */}
        <RoomPasswordDialog
          isOpen={isPrivateRoom}
          setOpen={setPrivateRoom}
          roomCode={roomCode.trim()}
        />

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
          {recentRooms.length === 0 ?
            <EmptyRecentRooms /> : (
              <div className="flex flex-col gap-1.5">
                {recentRooms.map((room) =>
                  <RecentRoomItem key={room.id} room={room} />
                )}
              </div>
            )}
        </div>
      </div>
    </>
  )
}

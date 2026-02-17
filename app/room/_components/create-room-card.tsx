"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Sparkles, Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { createRoom } from "@/lib/actions/room"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import YoutubeIcon from "@/components/icons/youtube"

type MediaType = "youtube" | "spotify"

export function CreateRoomCard() {
  const [roomName, setRoomName] = useState("")
  const [roomPassword, setRoomPassword] = useState("")
  const [mediaType, setMediaType] = useState<MediaType>("youtube")
  const [isLoading, setLoading] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const router = useRouter()


  // creating new Room
  const handleCreate = async () => {
    if (!roomName) {
      alert("Please enter a room name");
      return
    }

    if(isPrivate && roomPassword && roomPassword.length < 8) {      
      alert("Password must be at least 8 characters long");
      return
    }

    setLoading(true);

    await createRoom({ roomName, isPrivate, roomPassword })
      .then((roomCode) => {
        toast.success("Room created successfully", {
          icon: "🎉",
          description: `Room code: ${roomCode}`,
          style: {
            background: "green",
            color: "white",
          },
        })
        router.push(`/room/${roomCode}`)
        })
      .catch((error) => {
        toast.error("Something went wrong", {
          icon: "😢",
          description: error.message,
          style: {
            background: "red",
            color: "white",
          },
        })
      })
      .finally(() => {
        setRoomName("")
        setLoading(false)
      })
  }


  return (
    <div className="glass-strong rounded-2xl p-6 flex flex-col space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Plus className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-base">
            Start a New Room
          </h3>
          <p className="text-muted-foreground text-xs">
            Create and invite friends
          </p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-6">
        {/* Room Name */}
        <div className="flex flex-col gap-1.5 mb-4">
          <Label
            htmlFor="room-name"
            className="text-foreground/80 text-sm"
          >
            Room Name
          </Label>
          <Input
            id="room-name"
            placeholder="e.g. Movie Night, Chill Session"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            disabled={isLoading}
            className="h-11 rounded-xl bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground/50 text-sm focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-colors"
            autoComplete="off"
          />
        </div>

        {/* Private Room */}
        <div className="flex flex-row gap-4 items-center mb-4">
          <Label
            htmlFor="room-private"
            className="text-foreground/80 text-sm"
          >
            Is private Room ?
          </Label>
          <Checkbox
            className="border-primary"
            checked={isPrivate}
            onCheckedChange={e => setIsPrivate(e.valueOf().toString() === "true")}
          />
        </div>

        {/* Room Password (if is private is selected) */}
        <div className="flex flex-col gap-1.5 mb-4">
          <Label
            htmlFor="room-password"
            className="text-foreground/80 text-sm"
          >
            Room Password
          </Label>
          <Input
            id="room-password"
            value={roomPassword}
            type="password"
            onChange={(e) => setRoomPassword(e.target.value)}
            disabled={!isPrivate || isLoading}
            className={`h-11 rounded-xl bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground/50 text-sm focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-all duration-200 ease-out  disabled:border-red-500/50 disabled:bg-red-500/10 disabled:text-red-500/80 disabled:cursor-not-allowed`}
          />
        </div>

        {/* Media Type Selector */}
        <div className="flex flex-col gap-2 mb-6">
          <Label className="text-foreground/80 text-sm">
            Media Type
          </Label>
          <div className="flex gap-2">
            <Button
              size={"lg"}
              type="button"
              onClick={() => setMediaType("youtube")}
              disabled={isLoading}
              className={cn(
                "flex-1 flex items-center justify-center gap-2.5 py-3 hover:bg-red-500 hover:text-white rounded-xl border transition-all duration-200",
                mediaType === "youtube"
                  ? "border-red-400/40 bg-red-400/10 text-red-400 shadow-sm shadow-red-400/5"
                  : "border-border/40 bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <YoutubeIcon className="size-5" />
              <span className="text-sm font-medium">YouTube</span>
            </Button>
            {/* <Button
            size={"lg"}
            onClick={() => setMediaType("spotify")}
            disabled={isDisabled}
            className={cn(
              "flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl border transition-all duration-200",
              mediaType === "spotify"
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400 shadow-sm shadow-emerald-400/5 hover:text-white"
                : "border-border/40 bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            <SpotifyIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Spotify</span>
          </Button> */}
          </div>
        </div>

        {/* Spacer pushes button to bottom */}
        <div className="flex-1" />

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          disabled={isLoading}
          className="h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 font-medium text-sm transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Room...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Create Room
            </>
          )}
        </Button>
      </form>

      <p className="text-muted-foreground/70 text-sm text-center mt-3">
        {"You'll be the host of this Room"}
      </p>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Sparkles, Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { createRoom } from "@/lib/actions/room"
import { Checkbox } from "@/components/ui/checkbox"

type CreateState = "idle" | "loading"
type MediaType = "youtube" | "spotify"

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

export function CreateRoomCard() {
  const [roomName, setRoomName] = useState("")
  const [roomPassword, setRoomPassword] = useState("")
  const [mediaType, setMediaType] = useState<MediaType>("youtube")
  const [createState, setCreateState] = useState<CreateState>("idle")
  const [isPrivate, setIsPrivate] = useState(false)

  const router = useRouter()

  // creating new Room
  const handleCreate = async () => {
    if (!roomName) {
      setCreateState("idle")
      alert("Please enter a room name");
      return
    }

    setCreateState("loading")

    await createRoom({ roomName, isPrivate, roomPassword })
      .then((roomCode) => {
        setCreateState("idle")
        setRoomName("")
        if (roomCode) router.push(`/lobby/${roomCode}`)
      })
      .catch((error) => {
        setCreateState("idle")
        // alert(error)
      })
      .finally(() => {
        setCreateState("idle")
      })
  }

  const isDisabled = createState === "loading"

  return (
    <div className="glass-strong rounded-2xl p-6 flex flex-col space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Plus className="h-5 w-5 text-primary" />
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
            disabled={isDisabled}
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
            disabled={!isPrivate || isDisabled}
            className={`h-11 rounded-xl bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground/50 text-sm focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-all duration-200 ease-out  disabled:border-red-500/50 disabled:bg-red-500/10 disabled:text-red-500/80`}
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
              disabled={isDisabled}
              className={cn(
                "flex-1 flex items-center justify-center gap-2.5 py-3 hover:bg-red-500 hover:text-white rounded-xl border transition-all duration-200",
                mediaType === "youtube"
                  ? "border-red-400/40 bg-red-400/10 text-red-400 shadow-sm shadow-red-400/5"
                  : "border-border/40 bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <YouTubeIcon className="h-5 w-5" />
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
          disabled={isDisabled}
          className="h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 font-medium text-sm transition-all"
        >
          {createState === "loading" ? (
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

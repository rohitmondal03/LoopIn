"use client"

import React from "react"

import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, RefreshCw, Loader2 } from "lucide-react"
import { useState, useRef, useCallback, useEffect } from "react"

export function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(75)
  const [progress, setProgress] = useState(35)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isDisconnected, setIsDisconnected] = useState(false)
  const seekRef = useRef<HTMLDivElement>(null)

  const currentTime = "12:43"
  const duration = "36:12"
  const videoTitle = "Lo-fi Hip Hop Radio - Beats to Relax/Study To"
  const latency = "24ms"

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekRef.current) return
    const rect = seekRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    setProgress(pct)
  }, [])

  useEffect(() => {
    if (isSyncing) {
      const t = setTimeout(() => setIsSyncing(false), 2000)
      return () => clearTimeout(t)
    }
  }, [isSyncing])

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Disconnected Banner */}
      {isDisconnected && (
        <div className="flex items-center justify-between bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-2.5 animate-slide-in">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-destructive animate-spin" />
            <span className="text-destructive text-sm font-medium">Reconnecting to sync server...</span>
          </div>
          <button
            onClick={() => setIsDisconnected(false)}
            className="text-destructive/60 hover:text-destructive text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Player Container */}
      <div className="border-2  border-zinc-400 rounded-2xl overflow-hidden flex-1 flex flex-col min-h-0">
        {/* Video Area */}
        <div className="relative flex-1 bg-background/80 flex items-center justify-center min-h-0">
          {/* Simulated video background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05),transparent_70%)]" />

          {/* Overlay Top Bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-linear-to-b from-background/80 to-transparent z-10">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-foreground text-sm font-medium truncate">{videoTitle}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400/80">Synced</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-mono">{latency}</span>
              </div>
            </div>
          </div>

          {/* Syncing Overlay */}
          {isSyncing && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-foreground text-sm font-medium">Syncing playback...</span>
                <span className="text-muted-foreground text-xs">Aligning with host player</span>
              </div>
            </div>
          )}

          {/* Center Play Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative z-10 h-16 w-16 rounded-2xl glass flex items-center justify-center text-foreground hover:text-primary hover:bg-primary/10 transition-all group"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-7 w-7 group-hover:scale-110 transition-transform" />
            ) : (
              <Play className="h-7 w-7 ml-1 group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Floating reaction area */}
          <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-10">
            {["fire", "heart", "laugh"].map((reaction) => (
              <button
                key={reaction}
                className="h-10 w-10 rounded-xl glass flex items-center justify-center text-lg hover:scale-110 transition-transform"
                aria-label={`React with ${reaction}`}
              >
                {reaction === "fire" ? "\u{1F525}" : reaction === "heart" ? "\u{2764}\u{FE0F}" : "\u{1F602}"}
              </button>
            ))}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="px-4 py-3 glass-strong border-t border-border/30">
          {/* Seek Bar */}
          <div
            ref={seekRef}
            className="relative h-1.5 bg-muted rounded-full cursor-pointer group mb-3"
            onClick={handleSeek}
            role="slider"
            aria-label="Seek"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
          >
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-primary rounded-full shadow-lg shadow-primary/30 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5 ml-0.5" />}
              </button>
              <button className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Skip">
                <SkipForward className="h-4 w-4" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value))
                    if (isMuted) setIsMuted(false)
                  }}
                  className="w-20 h-1 bg-muted rounded-full accent-primary cursor-pointer"
                  aria-label="Volume"
                />
              </div>

              <span className="text-muted-foreground text-xs font-mono ml-3">
                {currentTime} / {duration}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSyncing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Re-sync
              </button>
              <button
                onClick={() => setIsDisconnected(!isDisconnected)}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

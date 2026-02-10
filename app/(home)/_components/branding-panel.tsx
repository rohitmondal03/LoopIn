"use client"

import React from "react"

import { Play, Headphones, MessageCircle, Radio, Wifi } from "lucide-react"

function FloatingIcon({
  icon: Icon,
  className,
}: {
  icon: React.ElementType
  className: string
}) {
  return (
    <div className={`absolute ${className}`}>
      <div className="glass rounded-2xl p-3 text-primary/40">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  )
}

function RoomPreviewCard() {
  const participants = [
    { initials: "JD", color: "bg-primary/30 text-primary" },
    { initials: "AK", color: "bg-chart-2/30 text-chart-2" },
    { initials: "ML", color: "bg-chart-3/30 text-chart-3" },
  ]

  return (
    <div className="glass-strong rounded-2xl p-5 max-w-sm w-full">
      {/* Mini player mockup */}
      <div className="rounded-xl bg-secondary/60 aspect-video mb-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Play className="h-5 w-5 text-primary ml-0.5" />
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
          <div className="h-full w-2/3 bg-primary rounded-r-full" />
        </div>
      </div>

      {/* Room info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {participants.map((p) => (
              <div
                key={p.initials}
                className={`h-7 w-7 rounded-full ${p.color} flex items-center justify-center text-xs font-semibold ring-2 ring-card`}
              >
                {p.initials}
              </div>
            ))}
          </div>
          <span className="text-muted-foreground text-xs">+4 watching</span>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-primary text-xs font-medium">Synced Live</span>
        </div>
      </div>
    </div>
  )
}

export function BrandingPanel() {
  return (
    <div className="relative h-full flex flex-col items-center justify-center p-8 lg:p-12 overflow-hidden w-full">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-chart-2/5" />

      {/* Floating icons */}
      <FloatingIcon icon={Play} className="top-[15%] left-[12%] animate-pulse-glow" />
      <FloatingIcon icon={Headphones} className="top-[25%] right-[15%] animate-pulse-glow [animation-delay:0.7s]" />
      <FloatingIcon icon={MessageCircle} className="bottom-[30%] left-[18%] animate-pulse-glow [animation-delay:1.4s]" />
      <FloatingIcon icon={Wifi} className="bottom-[18%] right-[12%] animate-pulse-glow [animation-delay:0.3s]" />
      <FloatingIcon icon={Radio} className="top-[50%] left-[8%] animate-pulse-glow [animation-delay:1s]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5 bg-white/90 p-4 rounded-xl">
          <div className="h-10 w-10 rounded-xl bg-primary/70 flex items-center justify-center">
            <Radio className="h-5 w-5 text-black/70" />
          </div>
          <span className="text-black font-bold text-xl tracking-tight">LoopIn</span>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-3 max-w-xl">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground text-balance leading-tight">
            Watch Together. Perfectly in Sync.
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed text-pretty">
            Create rooms, invite friends, and experience media in real-time.
          </p>
        </div>

        {/* Room Preview Card */}
        <RoomPreviewCard />
      </div>
    </div>
  )
}

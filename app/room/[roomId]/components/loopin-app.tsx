"use client"

import { TopNav } from "./top-nav"
import { RoomPanel } from "./room-panel"
import { MediaPlayer } from "./media-player"
import { InteractionPanel } from "./interaction-panel"

type TLoopInApp = {
  roomId: string
}

export function LoopInApp({roomId}: TLoopInApp) {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <TopNav />

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex gap-3 p-3 min-h-0">
        {/* Left Sidebar - Room Panel */}
        <div className="hidden lg:flex w-64 shrink-0">
          <RoomPanel />
        </div>

        {/* Center - Media Player */}
        <div className="flex-1 min-w-0">
          <MediaPlayer />
        </div>

        {/* Right Sidebar - Interaction Panel */}
        <div className="hidden md:flex w-80 shrink-0">
          <InteractionPanel />
        </div>
      </div>
    </div>
  )
}

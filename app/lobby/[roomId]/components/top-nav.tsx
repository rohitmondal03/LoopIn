"use client"

import { Copy, Settings, ChevronDown, Radio } from "lucide-react"
import { useState } from "react"

export function TopNav() {
  const [copied, setCopied] = useState(false)
  const roomCode = "SYNC-7X4K"


  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <nav className="glass-strong flex items-center justify-between px-5 py-3 rounded-2xl mx-3 mt-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Radio className="h-4 w-4 text-primary" />
          </div>
          <span className="text-foreground font-semibold text-lg tracking-tight">LoopIn</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5">
          <span className="text-muted-foreground text-sm font-mono">Room:</span>
          <span className="text-foreground text-sm font-mono font-medium">{roomCode}</span>
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-primary transition-colors ml-1"
            aria-label="Copy room code"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          {copied && (
            <span className="text-primary text-xs animate-slide-in">Copied!</span>
          )}
        </div>

        <button className="glass rounded-xl px-3 py-1.5 text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1.5">
          Share Link
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="h-9 w-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-2 glass rounded-xl px-2 py-1.5 hover:bg-secondary/60 transition-colors">
          <div className="h-7 w-7 rounded-lg bg-primary/30 flex items-center justify-center text-primary font-semibold text-xs">
            JD
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </nav>
  )
}

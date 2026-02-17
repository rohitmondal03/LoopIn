"use client"

import { useState } from "react"
import { ListMusic, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatTab from "./chat-tab"
import MusicQueueTab from "./music-queue-tab"

// --- Main Panel ---

type Tab = "chat" | "queue" | "reactions"


type TInteractionPanelProps = {
  roomCode: string;
  roomId: string;
  userId: string;
}

export function InteractionPanel({ roomCode, roomId, userId }: TInteractionPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("chat")

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "chat", label: "Chat", icon: <MessageCircle className="size-3.5" /> },
    { key: "queue", label: "Queue", icon: <ListMusic className="size-3.5" /> },
  ]

  return (
    <aside className="glass-strong rounded-2xl p-4 flex flex-col h-full w-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3 bg-secondary/40 rounded-xl p-1">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors hover:text-black ${activeTab === tab.key
              ? "hover:bg-primary/70 "
              : "bg-primary/15 text-primary"
              }`}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0">
        {activeTab === "chat" && <ChatTab
          userId={userId}
          roomCode={roomCode}
          roomId={roomId}
        />}
        {activeTab === "queue" && <MusicQueueTab
          roomId={roomId}
        />}
      </div>
    </aside>
  )
}

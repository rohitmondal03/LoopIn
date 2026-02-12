"use client"

import React from "react"

import { Send, ArrowUp, GripVertical, SmilePlus, ListMusic, MessageCircle, Sparkles } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// --- Chat Tab ---

const chatMessages = [
  { id: 1, user: "Alex Chen", initials: "AC", message: "This part is so good!", time: "12:30", color: "text-chart-2" },
  { id: 2, user: "Sam Rivera", initials: "SR", message: "Wait for the drop at 14:00", time: "12:32", color: "text-chart-1" },
  { id: 3, user: "Jane Doe", initials: "JD", message: "Turning up the volume for this one", time: "12:35", color: "text-primary" },
  { id: 4, user: "Morgan Lee", initials: "ML", message: "Can we add the remix next?", time: "12:38", color: "text-chart-3" },
  { id: 5, user: "Alex Chen", initials: "AC", message: "Yes! The Nujabes remix is incredible", time: "12:40", color: "text-chart-2" },
  { id: 6, user: "Sam Rivera", initials: "SR", message: "Adding it to the queue now", time: "12:41", color: "text-chart-1" },
]

function ChatMessage({ msg }: { msg: typeof chatMessages[number] }) {
  return (
    <div className="flex gap-2.5 px-2 py-1.5 rounded-xl hover:bg-secondary/30 transition-colors group animate-slide-in">
      <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
        <span className={`text-[10px] font-semibold ${msg.color}`}>{msg.initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-xs font-medium ${msg.color}`}>{msg.user}</span>
          <span className="text-[10px] text-muted-foreground">{msg.time}</span>
        </div>
        <p className="text-foreground text-sm leading-relaxed">{msg.message}</p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0 mt-1" aria-label="React to message">
        <SmilePlus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function ChatTab() {
  const [newMessage, setNewMessage] = useState("")

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-0.5 py-2">
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
      </div>
      <div className="pt-2 border-t border-border/20">
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Add emoji">
            <SmilePlus className="h-4 w-4" />
          </button>
          <button className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors" aria-label="Send message">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Queue Tab ---

const queueItems = [
  { id: 1, title: "Nujabes - Feather", duration: "5:24", upvotes: 4, type: "youtube" as const },
  { id: 2, title: "Tame Impala - Let It Happen", duration: "7:45", upvotes: 3, type: "spotify" as const },
  { id: 3, title: "Khruangbin - Time (You and I)", duration: "4:12", upvotes: 2, type: "youtube" as const },
  { id: 4, title: "Mac DeMarco - Chamber of Reflection", duration: "3:53", upvotes: 1, type: "spotify" as const },
]

function QueueItem({ item, index }: { item: typeof queueItems[number]; index: number }) {
  const [votes, setVotes] = useState(item.upvotes)

  return (
    <div className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-secondary/30 transition-colors group">
      {/* <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity shrink-0" /> */}
      <span className="text-muted-foreground text-xs font-mono w-5 shrink-0">{index + 1}</span>
      <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
        {item.type === "youtube" ? (
          <svg className="h-4 w-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-foreground text-sm truncate block">{item.title}</span>
        <span className="text-muted-foreground text-xs font-mono">{item.duration}</span>
      </div>
      <button
        onClick={() => setVotes(votes + 1)}
        className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors shrink-0"
        aria-label={`Upvote ${item.title}`}
      >
        <ArrowUp className="h-3.5 w-3.5" />
        <span className="text-[10px] font-medium">{votes}</span>
      </button>
    </div>
  )
}

function QueueTab() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-0.5 py-2">
        {queueItems.length > 0 ? (
          queueItems.map((item, i) => <QueueItem key={item.id} item={item} index={i} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
            <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center">
              <ListMusic className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">Queue is empty</p>
            <p className="text-muted-foreground/60 text-xs">Add a YouTube or Spotify link to get started</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Paste a YouTube link..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <Button size={"sm"} className="h-7 px-3 rounded-sm bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30 transition-colors">
          Add
        </Button>
      </div>
    </div>
  )
}

// --- Reactions Tab ---

const reactionEvents = [
  { id: 1, user: "Alex", emoji: "\u{1F525}", timestamp: "12:30" },
  { id: 2, user: "Sam", emoji: "\u{2764}\u{FE0F}", timestamp: "12:31" },
  { id: 3, user: "Morgan", emoji: "\u{1F602}", timestamp: "12:33" },
  { id: 4, user: "Jane", emoji: "\u{1F389}", timestamp: "12:35" },
  { id: 5, user: "Alex", emoji: "\u{1F525}", timestamp: "12:37" },
  { id: 6, user: "Sam", emoji: "\u{1F60D}", timestamp: "12:39" },
]

function ReactionsTab() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
        <div className="space-y-2">
          {reactionEvents.map((evt) => (
            <div key={evt.id} className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-secondary/30 transition-colors">
              <span className="text-muted-foreground text-[10px] font-mono w-10 shrink-0">{evt.timestamp}</span>
              <span className="text-xl animate-float-up" style={{ animationPlayState: "paused" }}>{evt.emoji}</span>
              <span className="text-muted-foreground text-xs">{evt.user} reacted</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-2 border-t border-border/20">
        <div className="flex items-center justify-center gap-2">
          {["\u{1F525}", "\u{2764}\u{FE0F}", "\u{1F602}", "\u{1F389}", "\u{1F60D}", "\u{1F44F}"].map((emoji) => (
            <button
              key={emoji}
              className="h-9 w-9 rounded-xl glass flex items-center justify-center text-lg hover:scale-125 active:scale-90 transition-transform"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Main Panel ---

type Tab = "chat" | "queue" | "reactions"

export function InteractionPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("chat")

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "chat", label: "Chat", icon: <MessageCircle className="h-3.5 w-3.5" /> },
    { key: "queue", label: "Queue", icon: <ListMusic className="h-3.5 w-3.5" /> },
    { key: "reactions", label: "Reactions", icon: <Sparkles className="h-3.5 w-3.5" /> },
  ]

  return (
    <aside className="glass-strong rounded-2xl p-4 flex flex-col h-full w-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3 bg-secondary/40 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === tab.key
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0">
        {activeTab === "chat" && <ChatTab />}
        {activeTab === "queue" && <QueueTab />}
        {activeTab === "reactions" && <ReactionsTab />}
      </div>
    </aside>
  )
}

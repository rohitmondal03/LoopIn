"use client"

import { AlertTriangle, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface RoomNotFoundProps {
  roomCode?: string
  onGoBack?: () => void
}

export default function NotFound({ roomCode, onGoBack }: RoomNotFoundProps) {
  const router = useRouter()

  const handleBackToLobby = () => {
    if (onGoBack) {
      onGoBack()
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated background blobs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(0 72% 51% / 0.08), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(0 72% 51% / 0.06), transparent 70%)",
        }}
      />

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-6 max-w-md">
          {/* Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full" />
            <div className="relative h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center border border-destructive/30">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Room Not Found
            </h1>
            <p className="text-muted-foreground text-base">
              {roomCode
                ? `The room code "${roomCode.toUpperCase()}" doesn't exist or has expired.`
                : "The room you're looking for doesn't exist or is no longer available."}
            </p>
          </div>

          {/* Error Details Card */}
          <div className="glass rounded-xl p-4 w-full text-left">
            <div className="space-y-3">
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">
                  What could have happened:
                </p>
                <ul className="text-muted-foreground text-xs space-y-1.5">
                  <li className="flex gap-2">
                    <span className="text-destructive/60 shrink-0">•</span>
                    <span>The room code may have been typed incorrectly</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive/60 shrink-0">•</span>
                    <span>The room might have been closed by the host</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive/60 shrink-0">•</span>
                    <span>The invite link may have expired</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-2">
            <Button
              onClick={handleBackToLobby}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-medium"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Lobby
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full h-11 rounded-xl border-border/60 hover:bg-secondary/40 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-muted-foreground/60 text-xs text-center">
            Need help? Ask the room host for a fresh invite link or code.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-center items-center py-4 relative z-10">
        <p className="text-muted-foreground/40 text-xs">
          © 2025 SyncWatch. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

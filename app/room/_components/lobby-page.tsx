import { LobbyNav } from "./lobby-nav"
import { JoinRoomCard } from "./join-room-card"
import { CreateRoomCard } from "./create-room-card"
import { Radio } from "lucide-react"
import { fetchHostsRecentRooms } from "@/lib/actions/room"

export async function LobbyPage() {

  const recentRooms = await fetchHostsRecentRooms()
    .then((rooms: Room[]) => {
      console.log("Recent rooms:", rooms);
      return rooms;
    })
    .catch((error) => {
      console.error("Error fetching recent rooms:", error);
      throw new Error("Failed to fetch recent rooms");
    })

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated background blobs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(168 84% 46% / 0.12), transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(200 70% 50% / 0.1), transparent 70%)" }}
      />
      <div
        className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(168 84% 46% / 0.08), transparent 70%)" }}
      />

      {/* Top Navigation */}
      <LobbyNav />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center gap-3 mb-10">
          {/* Icon badge */}
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2 mb-2">
            <Radio className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground text-xs font-medium">
              Real-time sync powered
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance leading-tight">
            Watch together.{" "}
            <span className="text-primary">Stay in sync.</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md leading-relaxed text-pretty">
            Join a room or start your own synchronized watch party with friends.
          </p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
          <JoinRoomCard recentRooms={recentRooms} />
          <CreateRoomCard />
        </div>

        {/* Footer hint */}
        <p className="text-muted-foreground/40 text-xs mt-8">
          Supports YouTube and Spotify. More platforms coming soon.
        </p>
      </main>
    </div>
  )
}

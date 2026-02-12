import { useEffect, useState } from "react"
import { Crown, Wifi, WifiOff } from "lucide-react"
import { fetchRoomParticipants } from "@/lib/actions/room-participants";

type TRoomParticipantCardProps = {
  roomCode: string,
}


function RoomParticipantCard({ roomCode }: TRoomParticipantCardProps) {
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setFetching(true);
        const data = await fetchRoomParticipants(roomCode);
        setParticipants(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setFetching(false);
      }
    })();
  }, [])

  return (
    <div className="glass-strong rounded-2xl p-4 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          Participants ({participants.length})
        </h3>
      </div>
      {fetching ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-muted-foreground text">Loading participants...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1">
          {participants.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-secondary/40 transition-colors group"
            >
              <div className="relative">
                <div className={`h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-semibold`}
                  style={{ color: `hsl(var(--primary))` }}
                >
                  {p.full_name ? p.full_name.charAt(0).toUpperCase() : "?"}
                </div>
                {/* <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${p.status === "connected" ? "bg-emerald-400" : p.status === "syncing" ? "bg-amber-400" : "bg-muted-foreground"
                  }`} /> */}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-foreground text-sm truncate">{p.full_name}</span>
                  {p.role === "host" && (
                    <Crown className="h-3 w-3 text-amber-400 shrink-0" />
                  )}
                </div>
                <span className="text-muted-foreground text-xs capitalize">
                  {/* {p.status === "syncing" ? "Syncing..." : p.status} */}
                </span>
              </div>
              {/* {p.status === "disconnected" ? (
                <WifiOff className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <Wifi className="h-3.5 w-3.5 text-emerald-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RoomParticipantCard
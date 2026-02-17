"use client"

import { useEffect, useState } from "react"
import { Crown, Loader } from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client";
import { fetchRoomParticipants } from "@/lib/actions/room-participants";
import { useQuery } from "@tanstack/react-query";

type TRoomParticipantCardProps = {
  roomCode: string,
  roomId: string,
}

function RoomParticipantCard({ roomCode, roomId }: TRoomParticipantCardProps) {
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);


  const { data: roomParticipants, isLoading } = useQuery({
    queryKey: ["fetch-room-participants", roomCode],
    queryFn: () => fetchRoomParticipants(roomCode),
  })

  useEffect(() => {
    setParticipants(roomParticipants || []);
  }, [roomParticipants]);


  useEffect(() => {
    if (!roomId) return;

    const channel = supabaseClient
      .channel(`room_participants_${roomCode}`)
      .on(
        "postgres_changes", {
        event: "*",
        schema: "public",
        table: "room_participants",
        filter: `room_id=eq.${roomId}`,
      },
        async () => {
          try {
            // refetch participants
            const { data, error } = await supabaseClient
              .from("room_participants")
              .select("user_id, role, joined_at, users(full_name)")
              .eq("room_id", roomId)
              .order("joined_at", { ascending: true });

            if (error) {
              console.error("Error refetching participants:", error);
              return;
            }

            const participantDetails = (data || []).map((p: any) => ({
              ...p,
              full_name: p.users?.full_name ?? null,
            })) as RoomParticipant[];

            setParticipants(participantDetails);
          } catch (err) {
            console.error("Error handling realtime payload:", err);
          }
        }
      )
      .subscribe();


    return () => {
      try {
        channel.unsubscribe();
      } catch (err) {
        console.warn("Error unsubscribing channel:", err);
      }
    };
  }, [roomId, roomCode]);


  return (
    <div className="glass-strong rounded-2xl p-4 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          Participants ({participants.length})
        </h3>
      </div>
      {isLoading ? (
        <div className='h-full w-full flex items-center justify-center'>
          <Loader className="size-6 animate-spin" />
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
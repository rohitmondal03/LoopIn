"use client"

import { useEffect, useState } from 'react'
import { ListMusic, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addMusicToQueue, getRoomMusicQueue } from '@/lib/actions/room-music';
import YoutubeIcon from '@/components/icons/youtube';
import SpotifyIcon from '@/components/icons/spotify';
import { supabaseClient } from '@/lib/supabase/client';
import { formatSeconds } from '@/lib/utils';
import Image from 'next/image';


type TMusicQueueTabProps = {
  roomId: string;
}


function MusicQueueTab({ roomId }: TMusicQueueTabProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [roomMusicQueueList, setRoomMusicQueueList] = useState<RoomMusic[]>([]);


  const {
    data: roomMusicQueue,
    isLoading: isRoomMusicQueueLoading,
  } = useQuery({
    queryKey: ["fetch-room-music-queue", roomId],
    queryFn: () => getRoomMusicQueue(roomId),
  })

  useEffect(() => {
    setRoomMusicQueueList(roomMusicQueue ?? [])
    console.log(roomMusicQueue)
  }, [roomMusicQueue])


  const handleAddMusicToQueue = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setLoading(true);

    await addMusicToQueue(url, roomId)
      .then(() => {
        toast("Music added to queue", {
          icon: '🎵',
          style: {
            background: "white",
            color: "black"
          }
        })
        return;
      })
      .catch(error => {
        toast("Something went wrong", {
          icon: '😢',
          description: error.message,
          style: {
            background: "red",
            color: "white"
          }
        })
      })
      .finally(() => {
        setUrl("");
        setLoading(false);
      })
  }


  // realtime
  useEffect(() => {
    const channel = supabaseClient
      .channel(`room_music_queue_${roomId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "room_music_queue",
        filter: `room_id=eq.${roomId}`,
      }, async (payload) => {

        console.log("PAYLOAD", payload);

        try {
          const { data, error } = await supabaseClient
            .from("room_music_queue")
            .select("*")
            .eq("room_id", roomId)
            .order("added_at", { ascending: true });

          if (error) {
            console.error("Error fetching music queue:", error);
            throw new Error("Failed to fetch music queue");
          }

          setRoomMusicQueueList(data as RoomMusic[]);
        }
        catch (error) {
          console.error("Error fetching music queue:", error);
          throw new Error("Failed to fetch music queue");
        }
      })
      .subscribe();

    return () => {
      try {
        channel.unsubscribe();
      } catch (err) {
        console.log("Error unsubscribing from channel: ", err);
      }
    }
  }, [roomId, supabaseClient])


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-0.5 py-2">
        {isRoomMusicQueueLoading
          ? (
            <div className='h-full w-full flex items-center justify-center'>
              <Loader className="size-6 animate-spin" />
            </div>
          )
          : roomMusicQueueList.length > 0 ? (
            roomMusicQueueList.map((item) =>
              <QueueItem key={item.id} item={item} />
            )
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
      <form
        onSubmit={handleAddMusicToQueue}
        className="flex items-center gap-2">
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="Paste a YouTube link..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <Button
          disabled={!url || url.trim().length === 0 || isLoading}
          type='submit'
          className="rounded-lg bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
          aria-label="Send message"
        >
          {isLoading ? <Loader className="size-4 animate-spin" /> : "Add"}
        </Button>
      </form>
    </div>
  )
}

export default MusicQueueTab



function QueueItem({ item }: { item: RoomMusic }) {
  return (
    <div className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-secondary/30 transition-colors group">
      <span className="text-muted-foreground text-xs font-mono w-3 shrink-0">
        {item.position}
      </span>
        {item.provider === "youtube" ? (
          <Image src={item.thumbnail} alt="Youtube" width={80} height={80} />
        ) : (
          <SpotifyIcon className="size-4 text-green-400" />
        )}
      <div className="flex-1 min-w-0">
        <span className="text-foreground text-sm truncate block">
          {item.title}
        </span>
        <span className="text-muted-foreground text-xs font-mono">
          {formatSeconds(item.duration_seconds)}
        </span>
      </div>
    </div>
  )
}
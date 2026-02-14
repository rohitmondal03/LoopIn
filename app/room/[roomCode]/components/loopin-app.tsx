import { TopNav } from "./top-nav"
import { RoomPanel } from "./room-panel"
import { MediaPlayer } from "./media-player"
import { InteractionPanel } from "./interaction-panel"
import { createServerClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { fetchRoomByCode } from "@/lib/actions/room"

type TLoopInApp = {
  roomCode: string,
}

export async function LoopInApp({ roomCode }: TLoopInApp) {
  const {
    created_at,
    host_id,
    name: roomName,
    is_private,
    id,
  } = await fetchRoomByCode(roomCode);


  const user = await (await createServerClient()).auth
    .getUser()
    .then((data) => data.data.user);

  if (!user) redirect('/');

  const isHost = user.id === host_id;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <TopNav
        roomName={roomName}
        roomCode={roomCode}
        isHost={isHost}
      />

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex gap-3 p-3 min-h-0">
        {/* Left Sidebar - Room Panel */}
        <div className="hidden lg:flex w-fit shrink-0">
          <RoomPanel
            roomName={roomName}
            roomId={id}
            roomCode={roomCode}
            isPrivate={is_private}
            createdAt={created_at}
          />
        </div>

        {/* Center - Media Player */}
        <div className="flex-1 min-w-0">
          <MediaPlayer />
        </div>

        {/* Right Sidebar - Interaction Panel */}
        <div className="hidden md:flex w-80 shrink-0">
          <InteractionPanel 
            roomCode={roomCode}
            roomId={id}
            userId={user.id}
          />
        </div>
      </div>
    </div>
  )
}

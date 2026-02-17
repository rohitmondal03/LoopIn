import RoomDetailProvider from '@/providers/room-provider'
import { createServerClient } from '@/lib/supabase'

type TRoomLayoutProps = {
  params: Promise<{ roomCode: string }>,
  children: React.ReactNode
}

async function RoomLayout({ children, params }: TRoomLayoutProps) {
  const roomCode = (await params).roomCode;

  return (
    <RoomDetailProvider roomCode={roomCode}>
      {children}
    </RoomDetailProvider>
  )
}

export default RoomLayout
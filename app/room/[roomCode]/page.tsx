import { fetchRoomByCode } from "@/lib/actions/room";
import { LoopInApp } from "./components/loopin-app";

export default async function Page({
  params
}: {
  params: Promise<{ roomCode: string }>
}) {
  const { roomCode } = await params;

  const roomData = await fetchRoomByCode(roomCode);

  return (
    <div>
      <LoopInApp roomData={roomData} />
    </div>
  )
}
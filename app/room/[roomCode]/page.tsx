import { fetchRoomByCode } from "@/lib/actions/room";
import { LoopInApp } from "./components/loopin-app";
import { notFound } from "next/navigation";

export default async function Page({
  params
}: {
  params: Promise<{ roomCode: string }>
}) {
  const { roomCode } = await params;

  await fetchRoomByCode(roomCode)
    .catch(() => notFound());

  return (
    <div>
      <LoopInApp roomCode={roomCode} />
    </div>
  )
}
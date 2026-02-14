import { LoopInApp } from "./components/loopin-app";

export default async function Page({
  params
}: {
  params: Promise<{ roomCode: string }>
}) {
  const { roomCode } = await params;

  return (
    <div>
      <LoopInApp roomCode={roomCode} />
    </div>
  )
}
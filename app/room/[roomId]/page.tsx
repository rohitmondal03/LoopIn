import { LoopInApp } from "./components/loopin-app";

export default async function Page({
  params
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params;
  console.log(roomId)

  return (
    <div>
      <LoopInApp roomId={roomId} />
    </div>
  )
}
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { RecoilRoot } from "recoil"
import { fetchRoomByCode } from "../lib/actions/room"

type TRoomDetailProviderProps = {
  children: React.ReactNode,
  roomCode: string,
}

function RoomProvider({ children }: TRoomDetailProviderProps) {
  const [roomCode, setRoomCode] = useState<string>();
  const [roomId, setRoomId] = useState<string>();
  const params = useParams()

  useEffect(() => {
    (async () => {

      const roomCodeFromParams = params.roomCode?.toString()
      
      if(!roomCodeFromParams) return;
      
      setRoomCode(roomCodeFromParams)
      
      await fetchRoomByCode(params.roomCode?.toString( ) ?? "")
        .then(roomData => {
          setRoomId(roomData.id)
        })
        .catch(err => {
          console.log(err)
          throw new Error(err)
        })
    })()
  }, [params.roomCode])

  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  )
}

export default RoomProvider;
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { fetchRoomsBasicDetailsByCode } from "@/lib/actions/room";
import { fetchUserNameByID } from "@/lib/actions/users";
import { hostname } from "os";
import { useEffect, useState } from "react";


type TRoomPasswordDialogProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roomCode: string;
}


export function RoomPasswordDialog({ isOpen, setOpen, roomCode }: TRoomPasswordDialogProps) {
  const [basicRoomDetails, setBasicRoomDetails] = useState<{
    room_code: string;
    name: string;
    host_id: string;
    is_playing: boolean;
  }>()
  const [hostName, setHostName] = useState<string>()

  useEffect(() => {
    fetchRoomsBasicDetailsByCode(roomCode)
      .then(async (data) => {
        setBasicRoomDetails(data);

        const userName = await fetchUserNameByID(data.host_id);
        setHostName(userName);
      })
  }, [roomCode])


  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{basicRoomDetails?.name}</DialogTitle>
          <DialogDescription>
            HOST NAME: {" "}
            <span className="text-white underline underline-offset-2">{hostName}</span>
          </DialogDescription>
          <Separator aria-orientation="horizontal" className="my-5" />
          <form action="">
            <div>
              <label htmlFor=""></label>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { beforeRoomJoinChecks, fetchRoomsBasicDetailsByCode, joinRoomByCode } from "@/lib/actions/room";
import { fetchUserNameByID } from "@/lib/actions/users";
import { hostname } from "os";
import { useEffect, useState } from "react";
import { toast } from "sonner";


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
  const [hostName, setHostName] = useState<string>();
  const [password, setPassword]= useState<string>();


  useEffect(() => {
    beforeRoomJoinChecks(roomCode)
      .then(async (data) => {
        setBasicRoomDetails(data);
        setHostName(data.host_name);
      })
  }, [roomCode])


  // Join ROOM Logic
  const handleSubmit = async(e: React.SubmitEvent) => {
    e.preventDefault();

    if(!password || password.trim() === "") {
      toast.error("Password cannot be empty", {
        icon: "⚠️",
        style: {
          background: "red",
          color: "white",
        }
      });
      return;
    }

    // roomCode and password - to join room
    await joinRoomByCode(roomCode, password)
      .then(() => {
        toast.success("Room joined successfully !!", {
          icon: "🎉",
          style: {
            background: "white",
            color: "black",
          }
        })
      })
      .catch(error => {
        toast.error("Error joining this room !!", {
          description: error.message,
          icon: "😢",
          style: {
            background: "red",
            color: "white",
          }
        })
      })
  }


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
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Label
                htmlFor="room-password"
                className="text-muted-foreground"
              >
                This room is private. Enter room password to enter into the room
              </Label>
              <Input
                id="room-password"
                autoComplete="off"
                placeholder="Enter room password"
              />
              <Button
                variant={"destructive"}
                className="w-full"
              >
                Join Room
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

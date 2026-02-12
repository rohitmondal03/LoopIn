import { Pencil, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { handleRoomNameChange } from '@/lib/actions/room'

type TSettingsDrawerProps = {
  roomName: string,
  roomCode: string,
}

function SettingsDrawer({ roomCode, roomName }: TSettingsDrawerProps) {
  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const changeRoomName = async () => {
    if(!inputRef?.current?.value) {
      toast("Please enter new ROOM NAME to update",{
        icon: "👀",
        style: {
          background: "red",
        }
      })
      return;
    }

    await handleRoomNameChange(roomCode, inputRef?.current?.value)
  }

  return (
    <DrawerContent >
      <DrawerHeader className='space-y-2'>
        <div className='flex items-center justify-center gap-3'>
          {editMode ? (
            <Input
              ref={inputRef}
              autoComplete='off'
              defaultValue={roomName}
              className='text-2xl text-center font-bold bg-transparent focus:ring-0 focus:border-primary w-fit'
            />
          ) : <DrawerTitle className='text-2xl'>{roomName}</DrawerTitle>}
          {editMode ? (
            <div className='flex items-center'>
              <Button
                className='font-bold'
                onClick={changeRoomName}
              >
                Save
              </Button>
              <Button
                variant={"destructive"}
                className="ml-2"
                onClick={() => setEditMode(false)}
              >
                <X className='size-4' />
              </Button>
            </div>
          ) : (
            <Button
              size={"icon"}
              onClick={() => setEditMode(!editMode)}
            >
              <Pencil />
            </Button>
          )}
        </div>
        <DrawerDescription>Room CODE: {" "}
          <span className='text-white underline-offset-2 underline'>{roomCode}</span>
        </DrawerDescription>
      </DrawerHeader>
    </DrawerContent>
  )
}

export default SettingsDrawer
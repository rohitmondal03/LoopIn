"use client"

import { useEffect, useState } from 'react'
import { Send, SmilePlus, Loader } from 'lucide-react'
import { toast } from 'sonner';
import { Input } from '@/components/ui/input'
import { getRoomMessages, sendRoomMessage } from '@/lib/actions/room-messages';
import { supabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


type TRoomMessage = RoomMessages & { full_name: string }

type TChatTabProps = {
  roomCode: string;
  roomId: string;
  userId: string
}

function ChatTab({ roomCode, roomId, userId }: TChatTabProps) {
  const [newMessage, setNewMessage] = useState("")
  const [roomMessages, setRoomMessages] = useState<TRoomMessage[]>([]);
  const [isFetching, setFetching] = useState(false);
  const [isSending, setSendStatus] = useState(false);

  // send message
  const sendMessage = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!newMessage || newMessage.trim() === "") {
      toast.error("Message cannot be empty", {
        icon: '⚠️',
        style: {
          background: "red",
          color: "white"
        }
      })
      setNewMessage("")
      return;
    };

    setSendStatus(true);

    await sendRoomMessage(roomId, newMessage)
      .catch(err => {
        toast.error(err.message, {
          icon: '⚠️',
          style: {
            background: "red",
            color: "white"
          }
        })
        return;
      })
      .finally(() => {
        setSendStatus(false);
        setNewMessage("");
      })
  }


  useEffect(() => {
    (async () => {
      setFetching(true);

      await getRoomMessages(roomCode)
        .then(data => {
          setRoomMessages(data)
          // console.log("Room Messages: ", data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setFetching(false);
        })
    })()
  }, [roomCode])


  useEffect(() => {
    if (!roomCode) return;

    const channel = supabaseClient
      .channel(`room_messages_${roomCode}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "room_messages",
        filter: `room_id=eq.${roomId}`,
      },
        async () => {
          try {
            const { data: messages, error } = await supabaseClient
              .from("room_messages")
              .select("*")
              .eq("room_id", roomId)
              .order("timestamp", { ascending: true });

            if (error) {
              console.error("Error fetching messages:", error);
              throw new Error("Failed to fetch messages");
            }

            if (messages === null) {
              console.log("Can't get messages")
              throw new Error("Can't get messages: ", error);
            }

            const messageWithSenderDetails = await Promise.all(
              messages.map(async (msg) => {
                const { data: userData, error: userError } = await supabaseClient
                  .from("users")
                  .select("full_name")
                  .eq("id", msg.sender_id)
                  .single();

                if (userError) {
                  console.error("Error fetching user details:", userError);
                  throw new Error("Failed to fetch user details");
                } else if (!userData) {
                  return [] as unknown as TRoomMessage;
                }

                return {
                  ...(msg as RoomMessages),
                  full_name: userData.full_name,
                };
              })
            );

            console.log("Messages: ", messageWithSenderDetails)
            setRoomMessages(messageWithSenderDetails as TRoomMessage[]);
          } catch (err) {
            console.log(err)
            throw new Error("Failed to fetch messages");
          }
        }
      )
      .subscribe();

    return () => {
      try {
        channel.unsubscribe();
      } catch (err) {
        console.log("Error unsubscribing from channel: ", err);
      }
    }
  }, [roomId, roomCode, supabaseClient])


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1.5 py-2">
        {isFetching ? (
          <p>Loading Chats...</p>
        ) : roomMessages.map((msg, i) => (
          <ChatMessage
            key={i}
            message={msg}
            ownMessage={userId === msg.sender_id}
          />
        ))}
      </div>
      <div className="pt-2 border-t border-border/20">
        <form onSubmit={sendMessage} className="flex items-center gap-2 border border-zinc-500 rounded-xl px-3 py-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message..."
            autoComplete="off"
            className="flex-1 border border-zinc-400 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="hover:text-foreground transition-colors"
                aria-label="Add emoji"
                type='button'
              >
                <SmilePlus className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='bg-zinc-800'>
              <EmojiPicker
                className="h-[300px] bg-transparent"
                onEmojiSelect={({ emoji }) => {
                  // setIsOpen(false);
                  setNewMessage((prev) => prev + emoji);
                  console.log(emoji);
                }}
              >
                <EmojiPickerSearch className='border' />
                <EmojiPickerContent />
                <EmojiPickerFooter />
              </EmojiPicker>
            </PopoverContent>
          </Popover>
          <Button
            disabled={!newMessage || newMessage.trim().length === 0 || isSending}
            type='submit'
            className="rounded-lg bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
            aria-label="Send message"
          >
            {isSending ? <Loader className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}

function ChatMessage({ message, ownMessage }: {
  message: TRoomMessage,
  ownMessage: boolean
}) {
  return (
    <div className="flex gap-2.5 px-2 py-1.5 rounded-xl hover:bg-secondary/30 transition-colors group animate-slide-in">
      {/* <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
        <span className={`text-[10px] font-semibold ${msg.color}`}>{msg.initials}</span>
      </div> */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-xs font-medium w-full ${ownMessage ? "text-primary text-right" : ""}`}>
            {ownMessage ? "You" : message.full_name}
          </span>
          {/* <span className="text-[10px] text-muted-foreground">{message.created_at}</span> */}
        </div>
        <p className={`text-foreground text leading-relaxed ${ownMessage ? "text-right" : ""}`}>{message.content}</p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0 mt-1" aria-label="React to message">
        <SmilePlus className="size-3.5" />
      </button>
    </div>
  )
}

export default ChatTab
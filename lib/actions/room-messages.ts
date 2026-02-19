"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "../supabase";
import { fetchRoomByCode } from "./room";
import { redirect } from "next/navigation";
import { fetchCurrentUser } from "./users";

export async function getRoomMessages(roomCode: string) {
  const { id: roomId } = await fetchRoomByCode(roomCode);

  const { data: messages, error } = await (await createServerClient())
    .from("room_messages")
    .select("*")
    .eq("room_id", roomId)
    .order("timestamp", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }

  if (messages === null) {
    console.log("Can't get messages");
    throw new Error("Can't get messages: ", error);
  }

  const messageWithSenderDetails = await Promise.all(
    messages.map(async (msg) => {
      const { data: userData, error: userError } = await (
        await createServerClient()
      )
        .from("users")
        .select("full_name")
        .eq("id", msg.sender_id)
        .single();

      if (userError) {
        console.error("Error fetching user details:", userError);
        throw new Error("Failed to fetch user details");
      } else if (!userData) {
        return [] as RoomParticipant[];
      }

      return {
        ...(msg as RoomMessages),
        full_name: userData.full_name,
      };
    }),
  );

  revalidatePath(`/room/${roomCode}`);

  return messageWithSenderDetails as (RoomMessages & { full_name: string })[];
}

export async function sendRoomMessage(roomId: string, message: string) {
  if(!message || message.trim() === "") {
    console.log("Empty message");
    throw new Error("Message cannot be empty");
  };

  const user = await fetchCurrentUser()

  const { error } = await (await createServerClient())
    .from("room_messages")
    .upsert({
      room_id: roomId,
      content: message.trim(),
      sender_id: user.id,
    });

  if(error) {
    console.log("Cant send message: ", error);
    throw new Error("Cant send message");
  }
}

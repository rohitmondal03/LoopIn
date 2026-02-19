"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "../supabase";
import { fetchUserNameByID } from "./users";
import { fetchRoomByCode } from "./room";

export const fetchRoomParticipants = async (roomCode: string) => {
  const { data: roomData, error: roomError } = await (await createServerClient())
    .from("rooms")
    .select("id")
    .eq("room_code", roomCode)
    .single();

  if(!roomData) {
    throw new Error("Room not found");
  }

  if (roomError) {
    console.error("Error fetching room:", roomError);
    throw new Error("Failed to fetch room");
  }

  const { data, error } = await (await createServerClient())
    .from("room_participants")
    .select("user_id, role, joined_at")
    .eq("room_id", roomData.id)
    .order("joined_at", { ascending: true });

  if (error) {
    console.error("Error fetching room:", error);
    throw new Error("Failed to fetch room");
  }

  const participantDetails = await Promise.all(
    data.map(async (participant) => {
      const userName = await fetchUserNameByID(participant.user_id);

      return {
        ...(participant as RoomParticipant),
        full_name: userName,
      };
    }),
  );

  revalidatePath(`/room/${roomCode}`);

  return participantDetails as RoomParticipant[];
};

// add participant to room by roomCode
export const addParticipantToRoom = async (roomCode: string, userId: string) => {
  // get ROOM DETAILS from ROOM CODE
  const roomDetails = await fetchRoomByCode(roomCode);

  // add participant to ROOM PARTICIPANTS
  const { error: roomError } = await (await createServerClient())
    .from("room_participants")
    .insert({ 
      room_id: roomDetails.id, 
      user_id: userId,
      role: "viewer",
    })

  if(roomError) {
    console.error("Error adding participant to room:", roomError);
    throw new Error("Failed to add participant to room");
  }
}
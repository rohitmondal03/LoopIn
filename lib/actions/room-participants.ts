"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "../supabase";
import { fetchUserNameByID } from "./users";

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

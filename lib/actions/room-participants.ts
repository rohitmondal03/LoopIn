"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "../supabase";

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
      const { data: userData, error: userError } = await (
        await createServerClient()
      )
        .from("users")
        .select("full_name")
        .eq("id", participant.user_id)
        .single();

      if (userError) {
        console.error("Error fetching user details:", userError);
        throw new Error("Failed to fetch user details");
      } else if (!userData) {
        return [] as RoomParticipant[];
      }

      return {
        ...(participant as RoomParticipant),
        full_name: userData.full_name,
      };
    }),
  );

  revalidatePath(`/room/${roomCode}`);

  return participantDetails as RoomParticipant[];
};

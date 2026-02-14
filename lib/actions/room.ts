"use server";

import { nanoid } from "nanoid";
import { createServerClient } from "../supabase";
import { revalidatePath } from "next/cache";

export async function createRoom(roomData: {
  roomName: string;
  isPrivate: boolean;
  roomPassword?: string;
}) {
  const { isPrivate, roomName, roomPassword } = roomData;

  const user = await (await createServerClient()).auth
    .getUser()
    .then((data) => data.data.user);

  if (!user) {
    throw new Error("Unauthorized");
  }

  // add new room's details to database
  const { data: insertedRoomData, error } = await (
    await createServerClient()
  )
    .from("rooms")
    .insert({
      name: roomName,
      host_id: user.id,
      room_code: nanoid(12),
      is_private: isPrivate,
      password: isPrivate ? roomPassword : null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating room:", error);
    throw new Error("Failed to create room");
  }

  // populate room_participant table with host's details
  const { error: participantError, data } = await (await createServerClient())
    .from("room_participants")
    .insert({
      room_id: insertedRoomData.id,
      user_id: user.id,
      role: "host",
    });

  if (participantError) {
    console.error("Error adding host to room_participants:", participantError);
    throw new Error("Failed to add host to room participants");
  }

  // Return the new room id so the client can perform navigation.
  return insertedRoomData.room_code;
}

// hosts recent rooms
export const fetchHostsRecentRooms = async () => {
  const host = await (await createServerClient()).auth
    .getUser()
    .then((data) => data.data.user);

  if (!host) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await (await createServerClient())
    .from("rooms")
    .select("*")
    .eq("host_id", host.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching recent rooms:", error);
    throw new Error("Failed to fetch recent rooms");
  }

  return data;
};

// fetch ROOM from room_code
export const fetchRoomByCode = async (roomCode: string) => {
  const { data, error } = await (await createServerClient())
    .from("rooms")
    .select("room_code, name, is_private, created_at, host_id, is_playing, id")
    .eq("room_code", roomCode)
    .single();

  if (error) {
    console.error("Error fetching room:", error);
    throw new Error("Failed to fetch room");
  }

  return data;
};

// handle ROOM NAME change
export const handleRoomNameChange = async (
  roomCode: string,
  newRoomName: string,
) => {
  const { error } = await (await createServerClient())
    .from("rooms")
    .update({ name: newRoomName })
    .eq("room_code", roomCode);

  if(error) {
    console.error("Can't update new name ", error)
    throw new Error("Can't update new name")
  }

  revalidatePath(`/lobby/${roomCode}`);
};

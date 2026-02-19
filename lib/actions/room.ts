"use server";

import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { createServerClient } from "../supabase";
import { fetchCurrentUser, fetchUserNameByID } from "./users";
import { addParticipantToRoom } from "./room-participants";

// check if ROOM CODE entered is current user's room or not ?
export async function isRoomOwner(roomCode: string) {
  const user = await fetchCurrentUser();

  const roomDetials = await fetchRoomsBasicDetailsByCode(roomCode);

  return roomDetials.host_id === user.id;
}

export async function createRoom(roomData: {
  roomName: string;
  isPrivate: boolean;
  roomPassword?: string;
}) {
  const { isPrivate, roomName, roomPassword } = roomData;

  const user = await fetchCurrentUser();

  if (isPrivate && (!roomPassword || roomPassword?.trim().length === 0)) {
    console.error("Room password is required");
    throw new Error("Room password is required");
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
  const { error: participantError } = await (await createServerClient())
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
  const host = await fetchCurrentUser();

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
    .select("*")
    .eq("room_code", roomCode)
    .single();

  if (error) {
    console.error("Error fetching room:", error);
    throw new Error("Failed to fetch room");
  }

  return data as Room;
};

// fetch Room's basic details
export const fetchRoomsBasicDetailsByCode = async (roomCode: string) => {
  const { data, error } = await (await createServerClient())
    .from("rooms")
    .select("name, host_id, is_playing")
    .eq("room_code", roomCode)
    .single();

  if (error) {
    console.error("Error fetching rooms:", error);
    throw new Error("Failed to fetch rooms");
  }

  if (!data) {
    console.error("Room not found");
    throw new Error("Room not found");
  }

  return data as {
    room_code: string;
    name: string;
    host_id: string;
    is_playing: boolean;
  };
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

  if (error) {
    console.error("Can't update new name ", error);
    throw new Error("Can't update new name");
  }

  revalidatePath(`/lobby/${roomCode}`);
};

// check if room is private or not
export const isRoomPrivate = async (roomCode: string) => {
  const { data, error } = await (await createServerClient())
    .from("rooms")
    .select("is_private")
    .eq("room_code", roomCode.trim())
    .single();

  if (error) {
    console.error("Error fetching room:", error);
    throw new Error("Failed to fetch room");
  }

  if (!data) {
    console.error("Room not found");
    throw new Error("Check ROOM CODE and try again");
  }

  return data as { is_private: boolean };
};

// checks and basic detials of a room before joining a ROOM by code
export const beforeRoomJoinChecks = async (roomCode: string) => {
  return await fetchRoomsBasicDetailsByCode(roomCode)
    .then(async (data) => {
      // check if current session user is owner itself
      await isRoomOwner(roomCode);

      // get HOST'S NAME from "host_id"
      const hostName = await fetchUserNameByID(data.host_id);

      return {
        ...data,
        host_name: hostName,
      };
    })
    .catch((error) => {
      console.error("Error fetching room:", error);
      throw new Error(error.message);
    });
};

// Join a room with roomCode and password
export const joinRoomByCode = async (roomCode: string, password: string) => {
  const currentUser = await fetchCurrentUser();

  // check if room is private or not
  const isPrivate = await isRoomPrivate(roomCode);

  if (isPrivate.is_private) {
    if (password.trim() === "") {
      throw new Error("Password cannot be empty");
    }
  }

  // add user to room_participant
  await addParticipantToRoom(roomCode, currentUser.id);
};

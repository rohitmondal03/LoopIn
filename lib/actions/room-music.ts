"use server";

import { createServerClient } from "../supabase";
import {
  extractVideoId,
  getVideoDetails,
  parseYouTubeDuration,
} from "../youtube";
import { fetchCurrentUser } from "./users";

export async function getRoomMusicQueue(roomId: string) {
  const { data, error } = await (await createServerClient())
    .from("room_music_queue")
    .select("*")
    .eq("room_id", roomId)
    .order("added_at", { ascending: true });

  if (error) {
    console.error("Error fetching music queue:", error);
    throw new Error("Failed to fetch music queue");
  }

  return data as RoomMusic[];
}

export const addMusicToQueue = async (url: string, roomId: string) => {
  const videoId = extractVideoId(url.trim());

  if (!videoId) {
    console.error("Invalid YouTube URL");
    throw new Error("Invalid YouTube URL");
  }

  const videoData = await getVideoDetails(videoId)
    .then((data) => {
      const youtubeVideoDetails = data.items[0];

      const videoDuration = parseYouTubeDuration(
        youtubeVideoDetails.contentDetails.duration as string,
      );

      return {
        title: youtubeVideoDetails.snippet.title as string,
        video_id: youtubeVideoDetails.id as string,
        duration_seconds: videoDuration,
        thumbnail: youtubeVideoDetails.snippet.thumbnails.default.url as string,
      };
    })
    .catch((error) => {
      console.log(error);
      throw new Error("Failed to fetch video details");
    });

  // get MAX position
  const { data, error } = await (await createServerClient())
    .from("room_music_queue")
    .select("position")
    .eq("room_id", roomId)
    .order("position", { ascending: false })
    .limit(1);

  if (!data) {
    console.error("Room not found");
    throw new Error("Room not found");
  }

  if (error) {
    console.error("Error fetching music queue:", error);
    throw new Error("Failed to fetch music queue");
  }

  const nextPosition: number = data.length ? data[0].position + 1 : 1;
  console.log("next pos", nextPosition);

  // get userId
  const user = await fetchCurrentUser();

  if(!user){
    console.error("User not found");
    throw new Error("User not found");
  }

  // INSERT the new video/song
  const { error: insertError } = await (await createServerClient())
    .from("room_music_queue")
    .insert({
      room_id: roomId,
      position: nextPosition,
      provider: "youtube",
      added_by: user.id,
      ...videoData,
    });

  if(insertError) {
    console.error("Error inserting music queue:", error);
    throw new Error("Failed to insert music queue");
  }
};

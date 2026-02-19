interface Room {
  id: string
  name: string
  mediaType?: "youtube" | "spotify"
  is_private: boolean
  password?: string
  host_id: string
  room_code: string
}

interface RoomParticipant {
  user_id: string
  room_id: string
  joined_at: Date
  role: "host" | "participant"
  full_name?: string
}

interface RoomMessages {
  id: string
  room_id: string
  sender_id: string
  content: string
  created_at: Date
}

interface RoomMusic {
  id: string
  room_id: string
  added_by: string
  provider: string
  video_id: string
  title: string
  thumbnail: string
  duration_seconds: number
  position: number
  is_played: boolean
  added_at: string
}
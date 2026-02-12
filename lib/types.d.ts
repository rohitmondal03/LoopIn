interface Room {
  id: string
  full_name: string
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
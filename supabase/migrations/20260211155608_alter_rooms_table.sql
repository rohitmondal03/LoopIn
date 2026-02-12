ALTER TABLE public.rooms DROP COLUMN IF EXISTS video_id;

CREATE TABLE public.room_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE,

  added_by uuid REFERENCES auth.users(id),

  -- Video details
  provider text CHECK (provider IN ('youtube','spotify')),
  video_id text,              -- YouTube ID or Spotify Track ID
  title text,
  thumbnail text,
  duration_seconds int,

  -- Queue control
  position int,               -- Order in queue
  is_played boolean DEFAULT false,

  created_at timestamptz DEFAULT now()
);


CREATE TABLE public.room_playback_state (
  room_id uuid PRIMARY KEY REFERENCES public.rooms(id) ON DELETE CASCADE,

  current_queue_item_id uuid REFERENCES public.room_queue(id),

  -- Sync data
  started_at timestamptz,   -- server timestamp when play started
  paused_at timestamptz,
  is_playing boolean DEFAULT false,

  updated_at timestamptz DEFAULT now()
);
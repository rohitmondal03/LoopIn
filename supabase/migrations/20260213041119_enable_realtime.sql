drop publication if exists supabase_realtime;
create publication supabase_realtime;

alter publication supabase_realtime 
  add table public.room_participants, public.room_playback_state, public.room_queue;
-- Add room_messages table to realtime publication
alter publication supabase_realtime 
  add table public.room_messages;

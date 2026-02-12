ALTER TABLE public.room_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_playback_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Queue is readable by authenticated users"
ON public.room_queue
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can add their own queue items"
ON public.room_queue
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = added_by);

CREATE POLICY "Only host can update queue"
ON public.room_queue
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.rooms
    WHERE rooms.id = room_queue.room_id
    AND rooms.host_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.rooms
    WHERE rooms.id = room_queue.room_id
    AND rooms.host_id = auth.uid()
  )
);

CREATE POLICY "Only host can delete queue items"
ON public.room_queue
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.rooms
    WHERE rooms.id = room_queue.room_id
    AND rooms.host_id = auth.uid()
  )
);

CREATE POLICY "Playback state readable"
ON public.room_playback_state
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only host can control playback"
ON public.room_playback_state
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.rooms
    WHERE rooms.id = room_playback_state.room_id
    AND rooms.host_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.rooms
    WHERE rooms.id = room_playback_state.room_id
    AND rooms.host_id = auth.uid()
  )
);

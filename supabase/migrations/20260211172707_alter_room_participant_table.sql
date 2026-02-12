ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;

drop policy if exists "Participants visible to room members" on public.room_participants;

CREATE POLICY "Participants visible to room members"
ON public.room_participants
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.room_participants AS rp2
    WHERE rp2.room_id = room_participants.room_id
    AND rp2.user_id = auth.uid()
  )
);

CREATE POLICY "User can join room"
ON public.room_participants
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "User can leave room"
ON public.room_participants
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Host can remove participants"
ON public.room_participants
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.rooms
    WHERE rooms.id = room_id
    AND rooms.host_id = auth.uid()
  )
);

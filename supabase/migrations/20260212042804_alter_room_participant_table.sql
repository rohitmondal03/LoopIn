DROP POLICY "Participants visible to room members"
ON public.room_participants;

CREATE POLICY "Participants visible to room members"
ON public.room_participants
FOR SELECT
TO authenticated
USING (
  room_id IN (
    SELECT id
    FROM public.rooms
    WHERE host_id = auth.uid()
  )
);

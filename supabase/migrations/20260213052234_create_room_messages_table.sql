create table room_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null,
  sender_id uuid not null,
  content text not null,
  timestamp timestamptz not null default now(),

  foreign key (room_id) references rooms (id) on delete cascade,
  foreign key (sender_id) references users (id) on delete cascade
);

create index idx_room_messages_room_id on room_messages (room_id);

CREATE POLICY "Participants can read room messages"
ON public.room_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.room_participants rp
    WHERE rp.room_id = room_messages.room_id
    AND rp.user_id = auth.uid()
  )
);

CREATE POLICY "Participants can send messages"
ON public.room_messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.room_participants rp
    WHERE rp.room_id = room_id
    AND rp.user_id = auth.uid()
  )
);

ALTER TABLE public.room_messages REPLICA IDENTITY FULL;
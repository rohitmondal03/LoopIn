-- 1️⃣ Enable RLS
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;


DROP POLICY IF EXISTS "Participants can read room messages" ON public.room_messages;
DROP POLICY IF EXISTS "Participants can send messages" ON public.room_messages;


-- 2️⃣ SELECT Policy
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

-- 3️⃣ INSERT Policy
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

-- 4️⃣ Realtime requirement
ALTER TABLE public.room_messages REPLICA IDENTITY FULL;

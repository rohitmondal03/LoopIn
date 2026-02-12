-- Allow logged-in users to create rooms
CREATE POLICY "Users can create rooms"
ON public.rooms
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

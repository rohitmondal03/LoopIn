ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rooms"
ON public.rooms
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create rooms"
ON public.rooms
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update room"
ON public.rooms
FOR UPDATE
TO authenticated
USING (auth.uid() = host_id)
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can delete room"
ON public.rooms
FOR DELETE
TO authenticated
USING (auth.uid() = host_id);


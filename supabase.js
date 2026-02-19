
CREATE POLICY "Enable bucket visibility" 
ON storage.buckets FOR SELECT 
USING (true);

CREATE POLICY "Allow Public PDF Uploads" 
ON storage.objects FOR INSERT 
TO anon 
WITH CHECK (
  bucket_id = 'research-files' AND 
  lower(storage.extension(name)) = 'pdf'
);

CREATE POLICY "Allow Public Viewing" 
ON storage.objects FOR SELECT 
TO anon 
USING (bucket_id = 'research-files');

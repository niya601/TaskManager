/*
  # Setup Storage Policies for Profile Pictures

  1. Storage Policies
    - Allow authenticated users to upload their own profile pictures
    - Allow authenticated users to update their own profile pictures  
    - Allow public read access to profile pictures
    - Allow authenticated users to delete their own profile pictures

  2. Security
    - Users can only upload files with their user ID in the filename
    - Public read access for displaying images
    - Proper file naming convention enforced
*/

-- Enable RLS on the storage.objects table (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = split_part(name, '-', 1)
);

-- Policy to allow authenticated users to update their own profile pictures
CREATE POLICY "Users can update their own profile pictures"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = split_part(name, '-', 1)
)
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = split_part(name, '-', 1)
);

-- Policy to allow public read access to profile pictures
CREATE POLICY "Public can view profile pictures"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- Policy to allow authenticated users to delete their own profile pictures
CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = split_part(name, '-', 1)
);
-- Create a public bucket for logos and player photos
insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true);

-- Allow public read access to the files
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'public-assets' );

-- Allow anyone to upload files (We can restrict this to authenticated admins later)
create policy "Anyone can upload"
  on storage.objects for insert
  with check ( bucket_id = 'public-assets' );

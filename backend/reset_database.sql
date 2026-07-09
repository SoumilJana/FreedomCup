-- ========================================================
-- DANGER: DATA WIPE SCRIPT
-- ========================================================
-- This script will permanently delete all Teams, Players, Matches, 
-- Match Events, and all uploaded images from the database.
-- Use this ONLY for testing purposes to start fresh!

-- 1. Wipe all relational data. 
-- Using CASCADE on teams automatically deletes all connected Players, Matches, and Events.
TRUNCATE TABLE teams CASCADE;

-- 2. Wipe all uploaded images from the public-assets bucket.
DELETE FROM storage.objects WHERE bucket_id = 'public-assets';

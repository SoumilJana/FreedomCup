-- ========================================================
-- DANGER: DATA WIPE SCRIPT
-- ========================================================
-- This script will permanently delete all Players, Matches, 
-- and Match Events from the database.
-- It will NOT delete Teams or their logos. Use this ONLY for testing purposes to start fresh!

-- 1. Wipe tournament data (players, matches, events)
-- We truncate players and matches with CASCADE which will also wipe match_events.
-- Teams are intentionally left untouched.
TRUNCATE TABLE players CASCADE;
TRUNCATE TABLE matches CASCADE;

-- Note: We are no longer wiping the public-assets bucket so that team logos remain intact.
-- If you need to delete old player photos, you can do so manually via the Supabase Storage dashboard.

-- Allow teams to exist without a group assigned
ALTER TABLE teams ALTER COLUMN group_name DROP NOT NULL;

-- Add new team details
ALTER TABLE teams ADD COLUMN captain TEXT;
ALTER TABLE teams ADD COLUMN vice_captain TEXT;
ALTER TABLE teams ADD COLUMN retained_player TEXT;

-- Add match order for manual scheduling
ALTER TABLE matches ADD COLUMN match_order INTEGER DEFAULT 0;

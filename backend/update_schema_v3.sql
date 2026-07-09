-- Make jersey_number optional
ALTER TABLE players ALTER COLUMN jersey_number DROP NOT NULL;

-- Make position optional
ALTER TABLE players ALTER COLUMN position DROP NOT NULL;

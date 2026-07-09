-- Update schema to remove coach and add player roles
ALTER TABLE teams
DROP COLUMN IF EXISTS coach;

ALTER TABLE players
DROP COLUMN IF EXISTS is_captain;

ALTER TABLE players
ADD COLUMN squad_role TEXT CHECK (squad_role IN ('Captain', 'Vice Captain', 'Retained', 'Regular')) DEFAULT 'Regular';

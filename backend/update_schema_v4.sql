-- 1. Migrate existing captain, vice_captain, and retained_player from teams to players table

-- Insert Captains (if not already existing in the players table for that team)
INSERT INTO players (team_id, name, squad_role)
SELECT id, captain, 'Captain' 
FROM teams t
WHERE captain IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM players p WHERE p.team_id = t.id AND p.squad_role = 'Captain');

-- Insert Vice Captains
INSERT INTO players (team_id, name, squad_role)
SELECT id, vice_captain, 'Vice Captain' 
FROM teams t
WHERE vice_captain IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM players p WHERE p.team_id = t.id AND p.squad_role = 'Vice Captain');

-- Insert Retained Players
INSERT INTO players (team_id, name, squad_role)
SELECT id, retained_player, 'Retained' 
FROM teams t
WHERE retained_player IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM players p WHERE p.team_id = t.id AND p.squad_role = 'Retained');


-- 2. Drop the text columns from teams since they are now proper players
ALTER TABLE teams DROP COLUMN captain;
ALTER TABLE teams DROP COLUMN vice_captain;
ALTER TABLE teams DROP COLUMN retained_player;

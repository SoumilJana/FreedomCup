ALTER TABLE players DROP CONSTRAINT IF EXISTS players_squad_role_check;
ALTER TABLE players ADD CONSTRAINT players_squad_role_check CHECK (squad_role IN ('Captain', 'Vice Captain', 'Retained', 'Regular', 'Team Owner', 'Representative'));

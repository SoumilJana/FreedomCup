-- ========================================================
-- SEED TEAMS SCRIPT
-- ========================================================
-- Use this script to hardcode your teams and their logos.
-- Since the reset_database.sql script no longer deletes teams,
-- you only need to run this once (or whenever you want to add/modify teams).

-- Insert your teams here. 
-- Since you are storing logos in the frontend/public/logos folder, 
-- you can just use the relative path like '/logos/filename.png'

INSERT INTO teams (name, logo_url) 
VALUES 
  ('Maratha Maharajas', '/logos/maratha.png'),
  ('Spartans FC', '/logos/spartans.png'),
  ('Freedom Fighters', '/logos/freedom.png')
ON CONFLICT (id) DO NOTHING; -- Assuming you might add a UNIQUE constraint, otherwise this is just standard insert.

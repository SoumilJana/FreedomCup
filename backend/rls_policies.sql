-- Allow public write access for admin features to work without authentication

-- Teams
CREATE POLICY "Enable insert for all users" ON "public"."teams" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON "public"."teams" FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON "public"."teams" FOR DELETE USING (true);

-- Players
CREATE POLICY "Enable insert for all users" ON "public"."players" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON "public"."players" FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON "public"."players" FOR DELETE USING (true);

-- Matches
CREATE POLICY "Enable insert for all users" ON "public"."matches" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON "public"."matches" FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON "public"."matches" FOR DELETE USING (true);

-- Match Events
CREATE POLICY "Enable insert for all users" ON "public"."match_events" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON "public"."match_events" FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON "public"."match_events" FOR DELETE USING (true);

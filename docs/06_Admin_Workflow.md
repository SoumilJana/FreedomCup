# 06. Admin Workflow

## Authentication
- There is **no separate admin website**.
- Admins log in via a hidden or secondary login route on the main site.
- Once authenticated via Supabase Auth, role-based permissions activate, and "Edit" buttons appear on public-facing components.

## Admin Capabilities
Admins do **not** directly edit standings, points, or player totals. They can only:
- Update completed matches.
- Add/Edit teams & players.
- Upload logos & photos.
- Create fixtures & update tournament info.

## Match Update Workflow
Immediately after a match concludes, the admin follows this flow:

### 1. Final Score
Input the final goals for Team A and Team B.
- *Knockout Exception*: If a knockout match is tied, a small icon appears. Clicking it allows the admin to input the penalty shootout score to determine the winner.

### 2. Goal Scorers
- Select players from a dropdown.
- Select the number of goals from a dropdown.
- *Own Goal Exception*: If a player scores an own goal, they are selected from the dropdown and flagged as an "Own Goal". This adds to the player's personal stats as an own goal, and correctly adds a point to the opposing team's total match score.

### 3. Cards & MOTM
- **Yellow/Red Cards**: Select players from a dropdown.
- **Man of the Match**: Select a single player from a combined dropdown of both teams.

### 4. Save
Upon clicking save, the database processes the events. The League Table, Top Scorers, Form Guide, and all other derived statistics are instantly and automatically updated on the public frontend.

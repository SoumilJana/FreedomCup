# 02. Database Design

## Technology Stack
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## Core Schema (Entities)

### 1. Teams
- `id` (UUID)
- `name` (String)
- `group` (Enum: 'A', 'B')
- `logo_url` (String)
- `coach` (String, Optional)

### 2. Players
- `id` (UUID)
- `team_id` (UUID, Foreign Key)
- `name` (String)
- `jersey_number` (Integer)
- `position` (String)
- `photo_url` (String)
- `is_captain` (Boolean)

### 3. Matches
- `id` (UUID)
- `stage` (Enum: 'Group', 'Semi-Final', 'Final')
- `team_a_id` (UUID, Foreign Key)
- `team_b_id` (UUID, Foreign Key)
- `match_date` (Timestamp)
- `status` (Enum: 'Scheduled', 'Completed')
- `team_a_score` (Integer)
- `team_b_score` (Integer)
- `team_a_penalties` (Integer, Nullable) - Used for knockout tie-breakers
- `team_b_penalties` (Integer, Nullable) - Used for knockout tie-breakers
- `motm_player_id` (UUID, Foreign Key, Nullable) - Man of the Match

### 4. Match Events
Tracks individual player actions during a match to derive all statistics.
- `id` (UUID)
- `match_id` (UUID, Foreign Key)
- `player_id` (UUID, Foreign Key)
- `team_id` (UUID, Foreign Key)
- `event_type` (Enum: 'Goal', 'Own_Goal', 'Yellow_Card', 'Red_Card')
- `quantity` (Integer) - For grouping multiple goals by a single player in one match

## Derived Data Logic (Views / Queries)
No statistics are stored statically. They are derived dynamically from `Matches` and `Match Events`.

- **League Table**: Calculated by aggregating `Matches` where `status = 'Completed'`. Points (3 for Win, 1 for Draw, 0 for Loss). Tie-breakers apply: `Points -> Goal Diff -> Goals Scored -> H2H -> Fair Play`.
- **Top Scorers**: Sum of `quantity` in `Match Events` where `event_type = 'Goal'`. (Note: `Own_Goal` is tracked separately for the player but counts towards the opponent's team score).
- **Team Form Guide**: Derived by ordering a team's completed matches by date descending and mapping the result to W/D/L.
- **Head-to-Head**: Derived by querying `Matches` where `team_a_id` and `team_b_id` match the two selected teams.

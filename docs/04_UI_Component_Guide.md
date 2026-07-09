# 04. UI Component Guide

## Frontend Tech Stack
- React
- Vite
- Tailwind CSS

## Core Components

### 1. Player Card
- **Normal State**: Displays Player Photo, Name, Jersey Number, and Position.
- **Hover State**: An elegant CSS transition reveals stats: Goals, Cards, Appearances, and MOTM awards.
- **Badges**: A small star or trophy icon `⭐` is displayed next to the player's name if they have won MOTM. Multiples are shown as `⭐ x3`.

### 2. Match Card
- Clean layout with Team Logos, Names, and Score prominently displayed.
- **Completed State**: Detailed list of events (Goals, Cards, MOTM).
- **Knockout Draw State**: If a knockout match ends in a draw, the penalty shootout score is displayed in smaller text below the main score (e.g., `(4 - 3 on penalties)`).
- **Interactive State (Upcoming)**: Clicking reveals the Head-to-Head and stat comparison view.

### 3. Form Guide Indicator
- Small colored squares or circles used in the League Table to represent recent form.
- Green `W`, Yellow `D`, Red `L`.

### 4. Admin Data Entry Forms
- **Dropdown Heavy**: No manual text entry for events.
- Goals: Select `[Player Name]` and `[Number of Goals]`.
- Own Goals: Select `[Player Name]` and toggle an `[Own Goal]` checkbox or select it as a specific event type.
- Penalties: A specific icon/button appears in knockout matches if the score is tied, opening a secondary input for penalty scores.

### 5. Layout & Containers
- Heavy use of CSS Grid and Flexbox.
- Glassmorphism or subtle shadows on cards to create depth against the dark theme.

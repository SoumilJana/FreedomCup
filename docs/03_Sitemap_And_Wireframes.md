# 03. Sitemap and Wireframes

## Sitemap

1. **Homepage**
   - Hero Banner
   - Current Tournament Overview
   - Latest Results & Upcoming Fixtures
   - League Table Preview
   - Top Scorers Snapshot
2. **Teams**
   - **Team Profile Page** (Logo, Group, Stats, Squad List, Fixtures, Results)
3. **Fixtures & Results**
   - List of all upcoming and completed matches.
4. **Knockout Bracket**
   - Visual tree representation of Semi-Finals and Final.
5. **Statistics**
   - Top Goal Scorers, Most Yellow Cards, Most Red Cards, MOTM Awards.

## Core Wireframe Elements

### Navigation
- Top navigation bar linking to all sitemap items.
- "Year/Season" dropdown for historical archive access (Future proofing).

### League Table
- Standard columns: Team, Played, W, D, L, GF, GA, GD, Pts.
- **Form Guide**: A dedicated column showing the last 5 match results as compact visual blocks (e.g., `🟩 W` `🟥 L` `🟨 D`).

### Match Cards (Fixtures & Results)
- **Upcoming Match**: Shows Team A vs Team B. Clicking the card expands to show **Head-to-Head Stats** and current tournament stat comparisons.
- **Completed Match**: Shows final score. Below the score, lists goal scorers, yellow cards, red cards, and MOTM.

### Knockout Bracket Visualization
- A flowchart-style layout showing the progression from the 4 Semi-Finalists to the 2 Finalists, and the ultimate Winner.

### Admin Inline Editing (Protected Route)
- Admin login seamlessly integrates into the frontend. Once authenticated, "Edit" buttons appear on match cards.
- Clicking "Edit" opens a modal or inline form to input match data.

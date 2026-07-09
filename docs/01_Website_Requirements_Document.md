# 01. Website Requirements Document

## Project Goal
Develop a **professional football tournament website** for the **Freedom Cup** that serves as the official platform for the tournament.

The website provides:
- Tournament information
- Fixtures and Results
- League standings
- Team profiles
- Player statistics
- Tournament statistics
- Historical tournament data (for future seasons)

The platform must be **reusable every year**, allowing future editions of the Freedom Cup to use the same website with minimal modifications.

## Tournament Format
- **Teams**: 8
- **Structure**: Divided into 2 Groups (Group A and Group B)
- **Stages**: Group Stage -> Semi Finals -> Final
- *(Note: Knockout structure can be expanded later if required.)*

## Core Principle: One Source of Truth
The website uses **one source of truth**. Admins edit **only the completed match**. Everything else updates automatically.
`Update Match -> Save -> League Table -> Player Goals -> Team Statistics -> Top Scorers -> Cards -> Recent Results`

## Website Philosophy
The website is **not** intended to provide minute-by-minute live match tracking, live timers, or live event feeds.
Instead, the website is updated **immediately after a match concludes**. This significantly simplifies administration while still providing up-to-date tournament information.

## Advanced Features & Edge Cases
- **League Table Tie-Breakers**: If teams have the same points, the sorting hierarchy is: `Points ➔ Goal Difference ➔ Goals Scored ➔ Head-to-Head Result ➔ Fair Play (fewest cards)`.
- **Form Guide**: A visual indicator of a team's last 5 matches (e.g., 🟩 W 🟥 L 🟨 D) is displayed in the league table.
- **Head-to-Head Stats**: Clicking on an upcoming fixture shows Head-to-Head history and a side-by-side comparison of current tournament stats.
- **Player Badges**: Player cards feature a small star/trophy icon if they won "Man of the Match". Multiple awards are shown as `⭐ x3`.
- **Knockout Stage Draws**: A small icon appears after entering the score for knockout rounds. If the score is a draw, clicking the icon reveals a penalty score override to advance the winner.
- **Own Goals**: An own goal adds to the opponent team's score, but the goal is explicitly recorded in the stats of the player who scored the own goal (flagged as an own goal).
- **Match Status**: No forfeits, walkovers, postponements, or abandoned matches are supported in the system.

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Team = Database['public']['Tables']['teams']['Row'];
type Player = Database['public']['Tables']['players']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];
type MatchEvent = Database['public']['Tables']['match_events']['Row'];

export interface TeamStanding {
  id: string;
  name: string;
  logo_url: string | null;
  group_name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface PlayerStats {
  id: string;
  name: string;
  jersey_number: number;
  position: string;
  photo_url: string | null;
  team_name: string;
  stats: {
    goals: number;
    yellow_cards: number;
    red_cards: number;
    motm: number;
    appearances: number;
  };
}

export function useTournamentData() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  
  const [standingsA, setStandingsA] = useState<TeamStanding[]>([]);
  const [standingsB, setStandingsB] = useState<TeamStanding[]>([]);
  const [standingsOverall, setStandingsOverall] = useState<TeamStanding[]>([]);
  
  const [topScorer, setTopScorer] = useState<PlayerStats | null>(null);
  const [starPlayer, setStarPlayer] = useState<PlayerStats | null>(null);
  const [allPlayerStats, setAllPlayerStats] = useState<PlayerStats[]>([]);
  const [latestMatch, setLatestMatch] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, playersRes, matchesRes, eventsRes] = await Promise.all([
        supabase.from('teams').select('*'),
        supabase.from('players').select('*'),
        supabase.from('matches').select('*').order('match_date', { ascending: false }),
        supabase.from('match_events').select('*')
      ]);

      const fetchedTeams = teamsRes.data || [];
      const fetchedPlayers = playersRes.data || [];
      const fetchedMatches = matchesRes.data || [];
      const fetchedEvents = eventsRes.data || [];

      setTeams(fetchedTeams);
      setPlayers(fetchedPlayers);
      setMatches(fetchedMatches);
      setEvents(fetchedEvents);

      // --- CALCULATE STANDINGS ---
      const standingsMap = new Map<string, TeamStanding>();
      
      fetchedTeams.forEach(t => {
        standingsMap.set(t.id, {
          id: t.id,
          name: t.name,
          logo_url: t.logo_url,
          group_name: t.group_name,
          played: 0, won: 0, drawn: 0, lost: 0,
          gf: 0, ga: 0, gd: 0, points: 0,
          form: []
        });
      });

      // Process only completed matches for standings
      const completedMatches = fetchedMatches.filter(m => m.status === 'Completed').reverse(); // reverse to process chronological
      
      completedMatches.forEach(m => {
        if (!m.team_a_id || !m.team_b_id) return;
        const teamA = standingsMap.get(m.team_a_id);
        const teamB = standingsMap.get(m.team_b_id);
        if (!teamA || !teamB) return;

        // Note: For knockout matches, penalties determine winner if tied, but usually standings are group stage only.
        // We will include all matches in the overall standing for now.
        const scoreA = m.team_a_score || 0;
        const scoreB = m.team_b_score || 0;
        
        let winnerA = false, winnerB = false, draw = false;

        if (scoreA > scoreB) winnerA = true;
        else if (scoreB > scoreA) winnerB = true;
        else {
          // tie - check penalties if it's knockout
          if (m.team_a_penalties != null && m.team_b_penalties != null) {
             if (m.team_a_penalties > m.team_b_penalties) winnerA = true;
             else if (m.team_b_penalties > m.team_a_penalties) winnerB = true;
             else draw = true;
          } else {
             draw = true;
          }
        }

        // Update Team A
        teamA.played++;
        teamA.gf += scoreA;
        teamA.ga += scoreB;
        if (winnerA) { teamA.won++; teamA.points += 3; teamA.form.push('W'); }
        else if (draw) { teamA.drawn++; teamA.points += 1; teamA.form.push('D'); }
        else { teamA.lost++; teamA.form.push('L'); }
        teamA.gd = teamA.gf - teamA.ga;
        if (teamA.form.length > 5) teamA.form.shift(); // Keep last 5

        // Update Team B
        teamB.played++;
        teamB.gf += scoreB;
        teamB.ga += scoreA;
        if (winnerB) { teamB.won++; teamB.points += 3; teamB.form.push('W'); }
        else if (draw) { teamB.drawn++; teamB.points += 1; teamB.form.push('D'); }
        else { teamB.lost++; teamB.form.push('L'); }
        teamB.gd = teamB.gf - teamB.ga;
        if (teamB.form.length > 5) teamB.form.shift(); // Keep last 5
      });

      const sortStandings = (arr: TeamStanding[]) => {
        return arr.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.gd !== a.gd) return b.gd - a.gd;
          return b.gf - a.gf;
        });
      };

      const allStandings = Array.from(standingsMap.values());
      
      setStandingsOverall(sortStandings([...allStandings]));
      setStandingsA(sortStandings(allStandings.filter(t => t.group_name === 'A')));
      setStandingsB(sortStandings(allStandings.filter(t => t.group_name === 'B')));

      // --- CALCULATE PLAYER STATS ---
      const playerStatsMap = new Map<string, PlayerStats>();
      
      fetchedPlayers.forEach(p => {
        const team = fetchedTeams.find(t => t.id === p.team_id);
        playerStatsMap.set(p.id, {
          id: p.id,
          name: p.name,
          jersey_number: p.jersey_number,
          position: p.position,
          photo_url: p.photo_url,
          team_name: team?.name || 'Unknown',
          stats: { goals: 0, yellow_cards: 0, red_cards: 0, motm: 0, appearances: 0 }
        });
      });

      // Calculate MOTM
      completedMatches.forEach(m => {
        if (m.motm_player_id) {
          const p = playerStatsMap.get(m.motm_player_id);
          if (p) p.stats.motm++;
        }
      });

      // Calculate Goals & Cards
      fetchedEvents.forEach(e => {
        if (e.player_id && e.event_type !== 'Own_Goal') {
          const p = playerStatsMap.get(e.player_id);
          if (p) {
            if (e.event_type === 'Goal') p.stats.goals += (e.quantity || 1);
            if (e.event_type === 'Yellow_Card') p.stats.yellow_cards += (e.quantity || 1);
            if (e.event_type === 'Red_Card') p.stats.red_cards += (e.quantity || 1);
          }
        }
      });

      const allPlayerStatsArray = Array.from(playerStatsMap.values());
      setAllPlayerStats(allPlayerStatsArray);
      
      // Top Scorer
      const topScorerPlayer = [...allPlayerStatsArray].sort((a, b) => b.stats.goals - a.stats.goals)[0];
      setTopScorer(topScorerPlayer?.stats.goals > 0 ? topScorerPlayer : null);

      // Star Player (Highest MOTM, tie-breaker goals)
      const star = [...allPlayerStatsArray].sort((a, b) => {
        if (b.stats.motm !== a.stats.motm) return b.stats.motm - a.stats.motm;
        return b.stats.goals - a.stats.goals;
      })[0];
      setStarPlayer(star?.stats.motm > 0 || star?.stats.goals > 0 ? star : null);

      // --- LATEST MATCH ---
      const latest = completedMatches[completedMatches.length - 1]; // Because we reversed it earlier, wait no
      // actually completedMatches is reversed (chronological). We want the most recent which is the last one in chronological, i.e. latest date.
      if (latest) {
        const teamA = fetchedTeams.find(t => t.id === latest.team_a_id);
        const teamB = fetchedTeams.find(t => t.id === latest.team_b_id);
        const matchGoals = fetchedEvents.filter(e => e.match_id === latest.id && (e.event_type === 'Goal' || e.event_type === 'Own_Goal'));
        
        const eventsList = matchGoals.map(g => {
           const p = fetchedPlayers.find(pl => pl.id === g.player_id);
           const t = fetchedTeams.find(tm => tm.id === g.team_id);
           return {
             player: p?.name || 'Unknown',
             team: (g.team_id === teamA?.id ? 'A' : 'B') as 'A' | 'B',
             isOwnGoal: g.event_type === 'Own_Goal'
           }
        });

        setLatestMatch({
          status: latest.status as any,
          stage: latest.stage,
          teamA: { name: teamA?.name || 'TBA', score: latest.team_a_score || 0, logo: teamA?.logo_url || '', penalty: latest.team_a_penalties },
          teamB: { name: teamB?.name || 'TBA', score: latest.team_b_score || 0, logo: teamB?.logo_url || '', penalty: latest.team_b_penalties },
          date: new Date(latest.match_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          events: { goals: eventsList }
        });
      }

    } catch (err) {
      console.error("Error fetching tournament data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    teams,
    players,
    matches,
    standingsA,
    standingsB,
    standingsOverall,
    allPlayerStats,
    topScorer,
    starPlayer,
    latestMatch,
    loading,
    refetch: fetchData
  };
}

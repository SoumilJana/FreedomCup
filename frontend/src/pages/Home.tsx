import React from 'react';
import { PlayerCard } from '../components/PlayerCard';
import { LeagueTable } from '../components/LeagueTable';
import { MatchCard } from '../components/MatchCard';

// MOCK DATA
const MOCK_TEAMS_GROUP_A = [
  { id: '1', name: 'Spartans FC', logo_url: '', played: 3, won: 3, drawn: 0, lost: 0, gf: 9, ga: 2, gd: 7, points: 9, form: ['W', 'W', 'W'] as any },
  { id: '2', name: 'Royal Strikers', logo_url: '', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 3, gd: 1, points: 4, form: ['L', 'W', 'D'] as any },
  { id: '3', name: 'City United', logo_url: '', played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 5, gd: -2, points: 4, form: ['W', 'L', 'D'] as any },
  { id: '4', name: 'Phoenix Wanderers', logo_url: '', played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, gd: -6, points: 0, form: ['L', 'L', 'L'] as any },
];

const MOCK_TEAMS_GROUP_B = [
  { id: '5', name: 'Titan Squadron', logo_url: '', played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, gd: 4, points: 7, form: ['W', 'D', 'W'] as any },
  { id: '6', name: 'Neon Knights', logo_url: '', played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 4, gd: 1, points: 6, form: ['L', 'W', 'W'] as any },
  { id: '7', name: 'Gladiators FC', logo_url: '', played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, points: 4, form: ['D', 'L', 'W'] as any },
  { id: '8', name: 'Shadow Rovers', logo_url: '', played: 3, won: 0, drawn: 0, lost: 3, gf: 2, ga: 7, gd: -5, points: 0, form: ['L', 'L', 'L'] as any },
];

const MOCK_TEAMS_OVERALL = [...MOCK_TEAMS_GROUP_A, ...MOCK_TEAMS_GROUP_B];

const MOCK_STAR_PLAYER = {
  name: "Rahul Sharma",
  jersey_number: 10,
  position: "Forward",
  photo_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=600&auto=format&fit=crop",
  stats: { goals: 5, yellow_cards: 1, red_cards: 0, motm: 2, appearances: 3 }
};

const MOCK_TOP_SCORER = {
  name: "Vikram Singh",
  jersey_number: 9,
  position: "Forward",
  photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
  stats: { goals: 7, yellow_cards: 0, red_cards: 0, motm: 1, appearances: 3 }
};

const MOCK_MATCH = {
  status: 'Completed' as const,
  stage: 'Group Stage - Matchday 3',
  teamA: { name: 'Spartans FC', score: 3, logo: '' },
  teamB: { name: 'City United', score: 1, logo: '' },
  date: 'Oct 15, 2026',
  events: {
    goals: [
      { player: 'R. Sharma', team: 'A' as const },
      { player: 'R. Sharma', team: 'A' as const },
      { player: 'A. Patel', team: 'A' as const },
      { player: 'V. Singh', team: 'B' as const },
    ]
  }
};

export function Home() {
  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white">
          The Stage is Set for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-purple-400">
            Freedom Cup 2026
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Explore the standings, dive into player stats, and track every result as 8 teams battle for ultimate glory.
        </p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Standings */}
        <div className="xl:col-span-2 space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-brand-purple rounded-full block"></span>
              Group A Standings
            </h2>
            <LeagueTable teams={MOCK_TEAMS_GROUP_A} />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-brand-purple rounded-full block"></span>
              Group B Standings
            </h2>
            <LeagueTable teams={MOCK_TEAMS_GROUP_B} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-8 bg-brand-dark rounded-full block"></span>
                Overall Standings
              </h2>
            </div>
            <LeagueTable teams={MOCK_TEAMS_OVERALL} />
          </div>

        </div>

        {/* Right Column: Featured Player & Result */}
        <div className="space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-8 bg-yellow-500 rounded-full block"></span>
                Top Scorer
              </h2>
              <div className="flex justify-center xl:justify-start">
                <PlayerCard player={MOCK_TOP_SCORER} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-8 bg-purple-500 rounded-full block"></span>
                Star Player
              </h2>
              <div className="flex justify-center xl:justify-start">
                <PlayerCard player={MOCK_STAR_PLAYER} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full block"></span>
              Latest Result
            </h2>
            <div className="flex justify-center xl:justify-start">
              <MatchCard match={MOCK_MATCH} />
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}

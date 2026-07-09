import React from 'react';
import { PlayerCard } from '../components/PlayerCard';
import { LeagueTable } from '../components/LeagueTable';
import { MatchCard } from '../components/MatchCard';

// MOCK DATA
const MOCK_TEAMS = [
  { id: '1', name: 'Spartans FC', logo_url: '', played: 5, won: 4, drawn: 1, lost: 0, gf: 12, ga: 3, gd: 9, points: 13, form: ['W', 'W', 'D', 'W', 'W'] as any },
  { id: '2', name: 'Royal Strikers', logo_url: '', played: 5, won: 3, drawn: 1, lost: 1, gf: 8, ga: 5, gd: 3, points: 10, form: ['W', 'L', 'W', 'D', 'W'] as any },
  { id: '3', name: 'City United', logo_url: '', played: 5, won: 2, drawn: 2, lost: 1, gf: 6, ga: 6, gd: 0, points: 8, form: ['D', 'W', 'D', 'L', 'W'] as any },
  { id: '4', name: 'Phoenix Wanderers', logo_url: '', played: 5, won: 0, drawn: 0, lost: 5, gf: 2, ga: 14, gd: -12, points: 0, form: ['L', 'L', 'L', 'L', 'L'] as any },
];

const MOCK_PLAYER = {
  name: "Rahul Sharma",
  jersey_number: 10,
  position: "Forward",
  photo_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=600&auto=format&fit=crop",
  stats: { goals: 7, yellow_cards: 1, red_cards: 0, motm: 2, appearances: 5 }
};

const MOCK_MATCH = {
  status: 'Completed' as const,
  stage: 'Group Stage - Matchday 5',
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Standings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-brand-purple rounded-full block"></span>
              Group A Standings
            </h2>
            <button className="text-sm font-medium text-brand-purple hover:text-purple-400 transition-colors">View Full Table &rarr;</button>
          </div>
          <LeagueTable teams={MOCK_TEAMS} />
        </div>

        {/* Right Column: Featured Player & Result */}
        <div className="space-y-10">
          
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-yellow-500 rounded-full block"></span>
              Star Player
            </h2>
            <div className="flex justify-center lg:justify-start">
              <PlayerCard player={MOCK_PLAYER} />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full block"></span>
              Latest Result
            </h2>
            <MatchCard match={MOCK_MATCH} />
          </div>

        </div>
      </div>
      
    </div>
  );
}

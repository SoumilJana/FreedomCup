import React from 'react';
import { PlayerCard } from '../components/PlayerCard';
import { LeagueTable } from '../components/LeagueTable';
import { MatchCard } from '../components/MatchCard';
import { useTournamentData } from '../hooks/useTournamentData';

export function Home() {
  const { standingsA, standingsB, standingsOverall, topScorer, starPlayer, latestMatch, loading } = useTournamentData();

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

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading Tournament Data...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Standings */}
          <div className="xl:col-span-2 space-y-12">

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-8 bg-brand-dark rounded-full block"></span>
                  Overall Standings
                </h2>
              </div>
              <LeagueTable teams={standingsOverall} />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-8 bg-brand-purple rounded-full block"></span>
                Group A Standings
              </h2>
              <LeagueTable teams={standingsA} />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-8 bg-brand-purple rounded-full block"></span>
                Group B Standings
              </h2>
              <LeagueTable teams={standingsB} />
            </div>

          </div>

          {/* Right Column: Featured Player & Result */}
          <div className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-8">
              {topScorer && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-yellow-500 rounded-full block"></span>
                    Top Scorer
                  </h2>
                  <div className="flex justify-center xl:justify-start">
                    <PlayerCard player={topScorer} />
                  </div>
                </div>
              )}

              {starPlayer && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-purple-500 rounded-full block"></span>
                    Star Player
                  </h2>
                  <div className="flex justify-center xl:justify-start">
                    <PlayerCard player={starPlayer} />
                  </div>
                </div>
              )}
            </div>

            {latestMatch && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-8 bg-blue-500 rounded-full block"></span>
                  Latest Result
                </h2>
                <div className="flex justify-center xl:justify-start">
                  <MatchCard match={latestMatch} />
                </div>
              </div>
            )}
            
            {!latestMatch && !topScorer && !starPlayer && (
               <div className="p-8 bg-gray-900 border border-gray-800 rounded-xl text-center text-gray-500">
                  Waiting for the first match to complete to calculate stats!
               </div>
            )}

          </div>
        </div>
      )}
      
    </div>
  );
}

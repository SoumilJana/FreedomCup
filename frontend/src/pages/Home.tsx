import { PlayerCard } from '../components/PlayerCard';
import { LeagueTable } from '../components/LeagueTable';
import { MatchCard } from '../components/MatchCard';
import { useTournamentData } from '../hooks/useTournamentData';
import { HeroBanner } from '../components/HeroBanner';

export function Home() {
  const { teams, standingsA, standingsB, topScorer, starPlayer, latestMatch, upcomingMatch, loading } = useTournamentData();

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <HeroBanner />

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading Tournament Data...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-16">
          {/* Left Column: Standings */}
          <div className="xl:col-span-2 space-y-12">

            {standingsA.length === 0 && standingsB.length === 0 && teams.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-brand-purple rounded-full block"></span>
                    Participating Teams
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {teams.map(team => (
                    <a key={team.id} href={`/team/${team.id}`} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:border-brand-purple transition-colors">
                      <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                        {team.logo_url ? (
                          <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-gray-500">{team.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="text-white font-bold text-center">{team.name}</div>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <>

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
              </>
            )}

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

            {upcomingMatch && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-8 bg-brand-purple rounded-full block"></span>
                  Upcoming Match
                </h2>
                <div className="flex justify-center xl:justify-start">
                  <MatchCard match={upcomingMatch} />
                </div>
              </div>
            )}
            
            {!latestMatch && !upcomingMatch && !topScorer && !starPlayer && (
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

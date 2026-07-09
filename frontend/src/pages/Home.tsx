import { useState, useEffect } from 'react';
import { PlayerCard } from '../components/PlayerCard';
import { LeagueTable } from '../components/LeagueTable';
import { MatchCard } from '../components/MatchCard';
import { useTournamentData } from '../hooks/useTournamentData';

const heroImages = [
  '/herobanner/herobanner1.png',
  '/herobanner/herobanner2.jpg'
];

export function Home() {
  const { teams, standingsA, standingsB, standingsOverall, topScorer, starPlayer, latestMatch, loading } = useTournamentData();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl h-[250px] sm:h-[350px] md:h-[450px] lg:h-[600px]">
        {heroImages.map((src, index) => (
          <img 
            key={src}
            src={src} 
            alt={`Freedom Cup 2026 Banner ${index + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`} 
          />
        ))}

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImage ? 'bg-brand-purple w-8 shadow-[0_0_10px_rgba(139,92,246,0.8)]' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading Tournament Data...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
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

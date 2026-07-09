import { Link } from 'react-router-dom';
import { useTournamentData } from '../hooks/useTournamentData';

export function Teams() {
  const { teams, loading } = useTournamentData();

  return (
    <div className="py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
          <span className="text-white">The</span>{' '}
          <span className="text-brand-purple">Teams</span>
        </h1>
        <p className="text-gray-400 uppercase tracking-[0.25em] font-bold text-sm md:text-lg">
          Meet the contenders of 2026
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading Teams...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full px-4 sm:px-6 mx-auto">
          {teams.map(team => (
            <Link 
              key={team.id} 
              to={`/team/${team.id}`} 
              className="relative bg-[#111116] border border-gray-800/60 rounded-3xl p-6 sm:p-8 flex flex-col items-center group hover:border-brand-purple/80 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:-translate-y-1 transition-all duration-500 aspect-square"
            >
              {/* Top Half: Logo */}
              <div className="w-full flex-1 flex items-start justify-center min-h-0">
                <div className="h-full aspect-square rounded-full border-2 border-gray-800/80 bg-gray-950/50 flex items-center justify-center overflow-hidden group-hover:border-yellow-500 group-hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] group-hover:scale-105 transition-all duration-500 relative z-10">
                  <img 
                    src={team.logo_url || "/teamlogo/gujratmascot.png"} 
                    alt={team.name} 
                    className="w-[70%] h-[70%] object-contain group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
              </div>
              
              {/* Bottom Half: Content */}
              <div className="z-10 w-full flex-1 flex flex-col items-center justify-end min-h-0 pt-4">
                <div className="flex-1 flex items-center justify-center w-full">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-white uppercase leading-tight tracking-wide text-center m-0">{team.name}</h2>
                </div>
                <div className="shrink-0 mt-2">
                  <span className="inline-block px-5 py-1.5 rounded-full border border-brand-purple/30 text-brand-purple text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-brand-purple/10">
                    GROUP {team.group_name || ''}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

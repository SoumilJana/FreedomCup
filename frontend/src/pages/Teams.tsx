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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {teams.map(team => (
            <Link 
              key={team.id} 
              to={`/team/${team.id}`} 
              className="relative bg-[#111116] border border-gray-800/60 rounded-3xl p-8 flex flex-col items-center text-center group hover:border-brand-purple/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all duration-500 h-80"
            >
              {/* Circular Logo */}
              <div className="w-32 h-32 rounded-full border-2 border-gray-800/80 bg-gray-950/50 flex items-center justify-center overflow-hidden mb-6 group-hover:border-brand-purple/30 transition-colors duration-500 shrink-0">
                <img 
                  src={team.logo_url || "/teamlogo/gujratmascot.png"} 
                  alt={team.name} 
                  className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              
              {/* Content */}
              <div className="z-10 w-full flex flex-col items-center justify-between flex-1">
                <h2 className="text-lg md:text-xl font-black text-white uppercase leading-tight tracking-wide mb-3">{team.name}</h2>
                {team.group_name && (
                  <span className="inline-block px-4 py-1 rounded-full border border-brand-purple/30 text-brand-purple text-xs font-bold uppercase tracking-widest bg-brand-purple/10">
                    Group {team.group_name}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

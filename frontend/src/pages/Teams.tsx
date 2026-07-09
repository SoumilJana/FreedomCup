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
              className="bg-gray-950/50 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 hover:border-brand-purple/50 hover:bg-gray-900 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-32 h-32 rounded-full bg-gray-950 border border-gray-800 flex items-center justify-center overflow-hidden shadow-2xl p-3 group-hover:scale-105 transition-transform duration-300">
                {team.logo_url ? (
                  <img src={team.logo_url} alt={team.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-3xl font-bold text-gray-500">{team.name.charAt(0)}</span>
                )}
              </div>
              <div className="text-center space-y-3">
                <h2 className="text-white font-black uppercase tracking-wide text-xl leading-tight">
                  {team.name}
                </h2>
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

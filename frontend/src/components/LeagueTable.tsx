
import { Link } from 'react-router-dom';

type MatchResult = 'W' | 'D' | 'L';

interface TeamStats {
  id: string;
  name: string;
  logo_url: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: MatchResult[];
}

interface LeagueTableProps {
  teams: TeamStats[];
}

export function LeagueTable({ teams }: LeagueTableProps) {
  // Sort logic (Points -> GD -> GF)
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });

  const getFormColor = (result: MatchResult) => {
    switch (result) {
      case 'W': return 'bg-green-500';
      case 'D': return 'bg-yellow-500';
      case 'L': return 'bg-red-500';
    }
  };

  return (
    <div className="overflow-x-auto bg-[#171717] rounded-xl border border-[#2a2a2a] shadow-2xl">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-[11px] font-black tracking-[0.15em] uppercase bg-[#0d0d0d] text-gray-500 border-b border-[#2a2a2a]">
          <tr>
            <th className="px-6 py-4">Pos</th>
            <th className="px-6 py-4">Club</th>
            <th className="px-4 py-4 text-center">MP</th>
            <th className="px-4 py-4 text-center hidden sm:table-cell">W</th>
            <th className="px-4 py-4 text-center hidden sm:table-cell">D</th>
            <th className="px-4 py-4 text-center hidden sm:table-cell">L</th>
            <th className="px-4 py-4 text-center hidden md:table-cell">GF</th>
            <th className="px-4 py-4 text-center hidden md:table-cell">GA</th>
            <th className="px-4 py-4 text-center">GD</th>
            <th className="px-6 py-4 text-center text-white">Pts</th>
            <th className="px-6 py-4 text-center hidden lg:table-cell">Form</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a]">
          {sortedTeams.map((team, index) => {
            // Subtle dark yellow/amber background for top 2 spots
            const rowBg = index < 2 ? 'bg-[#1e1c15]' : 'bg-[#171717]';
            
            return (
              <tr key={team.id} className={`${rowBg} hover:bg-[#252525] transition-colors group`}>
                <td className={`px-6 py-4 font-black text-xl ${index < 2 ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0 shadow-lg group-hover:border-yellow-500/50 transition-colors">
                      {team.logo_url ? (
                        <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-gray-500">{team.name.charAt(0)}</span>
                      )}
                    </div>
                    <Link to={`/team/${team.id}`} className="font-bold text-sm text-white uppercase tracking-wider hover:text-yellow-400 transition-colors">
                      {team.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-bold text-base text-gray-400">{team.played}</td>
                <td className="px-4 py-4 text-center font-bold text-base text-gray-400 hidden sm:table-cell">{team.won}</td>
                <td className="px-4 py-4 text-center font-bold text-base text-gray-400 hidden sm:table-cell">{team.drawn}</td>
                <td className="px-4 py-4 text-center font-bold text-base text-gray-400 hidden sm:table-cell">{team.lost}</td>
                <td className="px-4 py-4 text-center font-bold text-base text-gray-400 hidden md:table-cell">{team.gf}</td>
                <td className="px-4 py-4 text-center font-bold text-base text-gray-400 hidden md:table-cell">{team.ga}</td>
                <td className="px-4 py-4 text-center font-bold text-base text-gray-300">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                <td className="px-6 py-4 text-center font-black text-xl text-yellow-400">{team.points}</td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="flex items-center justify-center gap-1.5">
                    {team.form.map((res, i) => (
                      <div 
                        key={i} 
                        className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-black text-white shadow-sm ${getFormColor(res)}`}
                        title={res}
                      >
                        {res}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

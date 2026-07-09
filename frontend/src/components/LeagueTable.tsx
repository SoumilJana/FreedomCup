import React from 'react';
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
    <div className="overflow-x-auto bg-gray-900 rounded-xl border border-gray-800 shadow-xl">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-xs uppercase bg-gray-950/50 text-gray-400 border-b border-gray-800">
          <tr>
            <th className="px-6 py-4 font-semibold">Pos</th>
            <th className="px-6 py-4 font-semibold">Club</th>
            <th className="px-4 py-4 text-center font-semibold">MP</th>
            <th className="px-4 py-4 text-center font-semibold hidden sm:table-cell">W</th>
            <th className="px-4 py-4 text-center font-semibold hidden sm:table-cell">D</th>
            <th className="px-4 py-4 text-center font-semibold hidden sm:table-cell">L</th>
            <th className="px-4 py-4 text-center font-semibold hidden md:table-cell">GF</th>
            <th className="px-4 py-4 text-center font-semibold hidden md:table-cell">GA</th>
            <th className="px-4 py-4 text-center font-semibold">GD</th>
            <th className="px-6 py-4 text-center font-bold text-white">Pts</th>
            <th className="px-6 py-4 text-center font-semibold hidden lg:table-cell">Form</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {sortedTeams.map((team, index) => (
            <tr key={team.id} className="hover:bg-gray-800/30 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-500">{index + 1}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                    {team.logo_url ? (
                      <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-gray-500">{team.name.charAt(0)}</span>
                    )}
                  </div>
                  <Link to={`/team/${team.id}`} className="font-semibold text-white hover:text-brand-purple transition-colors">
                    {team.name}
                  </Link>
                </div>
              </td>
              <td className="px-4 py-4 text-center">{team.played}</td>
              <td className="px-4 py-4 text-center hidden sm:table-cell">{team.won}</td>
              <td className="px-4 py-4 text-center hidden sm:table-cell">{team.drawn}</td>
              <td className="px-4 py-4 text-center hidden sm:table-cell">{team.lost}</td>
              <td className="px-4 py-4 text-center hidden md:table-cell">{team.gf}</td>
              <td className="px-4 py-4 text-center hidden md:table-cell">{team.ga}</td>
              <td className="px-4 py-4 text-center font-medium">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
              <td className="px-6 py-4 text-center font-bold text-brand-purple">{team.points}</td>
              <td className="px-6 py-4 hidden lg:table-cell">
                <div className="flex items-center justify-center gap-1">
                  {team.form.map((res, i) => (
                    <div 
                      key={i} 
                      className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold text-white ${getFormColor(res)}`}
                      title={res}
                    >
                      {res}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

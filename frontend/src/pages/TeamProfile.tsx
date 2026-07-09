import { useParams } from 'react-router-dom';
import { useTournamentData } from '../hooks/useTournamentData';
import { PlayerCard } from '../components/PlayerCard';

export function TeamProfile() {
  const { id } = useParams<{ id: string }>();
  const { teams, loading } = useTournamentData();

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading Team Data...</div>;
  }

  const team = teams.find(t => t.id === id);
  if (!team) {
    return <div className="text-center py-20 text-red-500">Team not found!</div>;
  }

  // Find players for this team. Since allPlayerStats doesn't have squad_role directly, 
  // we actually need to grab the raw players array to check squad_role, OR we can add squad_role to PlayerStats.
  // Let's import raw players from the hook to check roles. Wait, I didn't export raw players? Yes I did.
  return <TeamProfileContent team={team} teamId={id!} />;
}

// Separate component so we can use the raw players array from a fresh hook call or pass it down.
// Since useTournamentData provides `players` (raw) and `allPlayerStats`, we can combine them.
function TeamProfileContent({ team, teamId }: { team: any, teamId: string }) {
  const { players, allPlayerStats, standingsOverall } = useTournamentData();
  
  const teamStandings = standingsOverall.find(s => s.id === teamId);
  const teamRawPlayers = players.filter(p => p.team_id === teamId);
  
  // Combine raw player (for squad_role) and calculated stats
  const squad = teamRawPlayers.map(rp => {
    const stats = allPlayerStats.find(ps => ps.id === rp.id);
    return {
      ...stats,
      squad_role: rp.squad_role,
      name: rp.name,
      jersey_number: rp.jersey_number,
      position: rp.position,
      photo_url: rp.photo_url,
      stats: stats?.stats || { goals: 0, yellow_cards: 0, red_cards: 0, motm: 0, appearances: 0 }
    };
  });

  const captain = squad.find(p => p.squad_role === 'Captain');
  const viceCaptain = squad.find(p => p.squad_role === 'Vice Captain');
  const retained = squad.find(p => p.squad_role === 'Retained');
  const regulars = squad.filter(p => !['Captain', 'Vice Captain', 'Retained'].includes(p.squad_role || ''));

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
        <div className="w-32 h-32 bg-gray-950 rounded-full flex items-center justify-center border-4 border-gray-800 overflow-hidden">
          {team.logo_url ? (
            <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-gray-700 font-black">{team.name.charAt(0)}</span>
          )}
        </div>
        <div className="text-center md:text-left">
          <div className="text-brand-purple font-bold text-sm tracking-widest uppercase mb-1">
            {team.group_name ? `Group ${team.group_name}` : 'Unassigned'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">{team.name}</h1>
          
          {teamStandings && (
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <div className="bg-gray-950 px-4 py-2 rounded border border-gray-800 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Points</div>
                <div className="text-xl font-bold text-white">{teamStandings.points}</div>
              </div>
              <div className="bg-gray-950 px-4 py-2 rounded border border-gray-800 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Played</div>
                <div className="text-xl font-bold text-white">{teamStandings.played}</div>
              </div>
              <div className="bg-gray-950 px-4 py-2 rounded border border-gray-800 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Goal Diff</div>
                <div className="text-xl font-bold text-white">{teamStandings.gd > 0 ? `+${teamStandings.gd}` : teamStandings.gd}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leadership & Retained Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-yellow-500 rounded-full block"></span>
          Key Personnel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {captain && (
            <PlayerCard player={captain as any} />
          )}
          {viceCaptain && (
            <PlayerCard player={viceCaptain as any} />
          )}
          {retained && (
            <PlayerCard player={retained as any} />
          )}
          {!captain && !viceCaptain && !retained && (
             <div className="col-span-full text-gray-500 py-4">No key personnel assigned yet.</div>
          )}
        </div>
      </div>

      {/* Full Squad */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-gray-500 rounded-full block"></span>
          Squad
        </h2>
        {regulars.length === 0 ? (
          <div className="text-gray-500 py-4">No regular squad players assigned yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regulars.map(p => (
              <PlayerCard key={p.id} player={p as any} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

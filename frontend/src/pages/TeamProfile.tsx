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

  const teamOwner = squad.find(p => p.squad_role?.includes('Owner'));
  const representatives = squad.filter(p => p.squad_role?.includes('Representative'));
  const captain = squad.find(p => p.squad_role === 'Captain');
  const viceCaptain = squad.find(p => p.squad_role === 'Vice Captain');
  const retained = squad.find(p => p.squad_role === 'Retained');
  const regulars = squad.filter(p => !p.squad_role?.includes('Owner') && !p.squad_role?.includes('Representative'));
  
  const getPosGroup = (pos: string) => regulars
    .filter(p => p.position === pos)
    .sort((a, b) => {
      const roleOrder: Record<string, number> = { 'Captain': 1, 'Vice Captain': 2, 'Retained': 3 };
      const orderA = roleOrder[a.squad_role || ''] || 99;
      const orderB = roleOrder[b.squad_role || ''] || 99;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name);
    });
  
  const forwards = getPosGroup('Forward');
  const midfielders = getPosGroup('Midfielder');
  const defenders = getPosGroup('Defender');
  const goalkeepers = getPosGroup('Goalkeeper');
  
  const unassigned = regulars
    .filter(p => !['Forward', 'Midfielder', 'Defender', 'Goalkeeper'].includes(p.position || ''))
    .sort((a, b) => {
      const roleOrder: Record<string, number> = { 'Captain': 1, 'Vice Captain': 2, 'Retained': 3 };
      const orderA = roleOrder[a.squad_role || ''] || 99;
      const orderB = roleOrder[b.squad_role || ''] || 99;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name);
    });

  const squadGroups = [forwards, midfielders, defenders, goalkeepers, unassigned].filter(g => g.length > 0);

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-[#111116] border border-gray-800/60 p-6 md:px-10 md:py-8 rounded-3xl overflow-hidden shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="relative w-36 h-36 bg-gray-900/50 rounded-full flex items-center justify-center border border-gray-700/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 p-3">
          {team.logo_url ? (
            <img src={team.logo_url} alt={team.name} className="w-full h-full object-contain drop-shadow-2xl" />
          ) : (
            <span className="text-4xl text-gray-700 font-black">{team.name.charAt(0)}</span>
          )}
        </div>
        
        <div className="text-center md:text-left z-10">
          <div className="inline-block px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-full text-brand-purple font-bold text-[10px] tracking-widest uppercase mb-3">
            {team.group_name ? `Group ${team.group_name}` : 'Unassigned'}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md mb-5">{team.name}</h1>
          
          {teamStandings && (
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-white/5 backdrop-blur-md px-5 py-2 rounded-xl border border-white/10 text-center min-w-[100px]">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Points</div>
                <div className="text-2xl font-black text-white">{teamStandings.points}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md px-5 py-2 rounded-xl border border-white/10 text-center min-w-[100px]">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Played</div>
                <div className="text-2xl font-black text-white">{teamStandings.played}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md px-5 py-2 rounded-xl border border-white/10 text-center min-w-[100px]">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Goal Diff</div>
                <div className="text-2xl font-black text-white">{teamStandings.gd > 0 ? `+${teamStandings.gd}` : teamStandings.gd}</div>
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
        <div className="flex flex-wrap justify-center md:justify-start gap-6">
          {captain && (
            <PlayerCard player={captain as any} />
          )}
          {viceCaptain && (
            <PlayerCard player={viceCaptain as any} />
          )}
          {retained && (
            <PlayerCard player={retained as any} />
          )}
          {/* Break to new row if possible, or just let it wrap naturally */}
          <div className="basis-full h-0 hidden md:block"></div>
          {teamOwner && (
            <PlayerCard player={teamOwner as any} />
          )}
          {representatives.map(rep => (
            <PlayerCard key={rep.id} player={rep as any} />
          ))}

          {!teamOwner && representatives.length === 0 && !captain && !viceCaptain && !retained && (
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
        {squadGroups.length === 0 ? (
          <div className="text-gray-500 py-4">No regular squad players assigned yet.</div>
        ) : (
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            {squadGroups.map((group, groupIdx) => {
              const isLast = groupIdx === squadGroups.length - 1;
              return (
                <div key={groupIdx} className="contents">
                  {group.map(p => (
                    <PlayerCard key={p.id} player={p as any} />
                  ))}
                  {!isLast && <div className="basis-full h-0"></div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

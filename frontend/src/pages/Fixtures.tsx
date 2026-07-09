import { useTournamentData } from '../hooks/useTournamentData';
import { MatchCard } from '../components/MatchCard';

export function Fixtures() {
  const { matches, teams, standingsA, standingsB, loading } = useTournamentData();

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading Fixtures...</div>;
  }

  // Helper function to get team position string
  const getTeamPosition = (teamId: string) => {
    const teamObj = teams.find(t => t.id === teamId);
    if (!teamObj) return undefined;
    
    if (teamObj.group_name === 'A') {
       const pos = standingsA.findIndex(t => t.id === teamId) + 1;
       return pos > 0 ? `Grp A - ${pos}` : undefined;
    } else if (teamObj.group_name === 'B') {
       const pos = standingsB.findIndex(t => t.id === teamId) + 1;
       return pos > 0 ? `Grp B - ${pos}` : undefined;
    }
    return undefined;
  };

  const formattedMatches = matches.map(m => {
    const teamA = teams.find(t => t.id === m.team_a_id);
    const teamB = teams.find(t => t.id === m.team_b_id);
    return {
      id: m.id,
      status: m.status as any,
      stage: m.stage,
      teamA: { 
        name: teamA?.name || 'TBA', 
        score: m.team_a_score, 
        logo: teamA?.logo_url || '', 
        position: teamA ? getTeamPosition(teamA.id) : undefined 
      },
      teamB: { 
        name: teamB?.name || 'TBA', 
        score: m.team_b_score, 
        logo: teamB?.logo_url || '', 
        position: teamB ? getTeamPosition(teamB.id) : undefined 
      },
      date: new Date(m.match_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      penalties: (m.team_a_penalties !== null && m.team_b_penalties !== null) 
        ? { teamA: m.team_a_penalties, teamB: m.team_b_penalties } 
        : undefined,
    };
  });

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black italic tracking-tight text-white flex items-center gap-3">
          <span className="w-2 h-10 bg-brand-purple rounded-full block"></span>
          Tournament Fixtures
        </h1>
      </div>

      {formattedMatches.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-500">
          No fixtures scheduled yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formattedMatches.map(match => (
            <div key={match.id} className="flex justify-center">
              <MatchCard match={match} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

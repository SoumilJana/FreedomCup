

interface MatchCardProps {
  match: {
    status: 'Scheduled' | 'Completed';
    stage: string;
    teamA: { name: string; score: number | null; logo: string };
    teamB: { name: string; score: number | null; logo: string };
    date: string;
    penalties?: { teamA: number; teamB: number };
    events?: {
      goals: { player: string; team: 'A' | 'B'; time?: string }[];
    };
  };
}

export function MatchCard({ match }: MatchCardProps) {
  const isCompleted = match.status === 'Completed';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors shadow-lg max-w-md w-full">
      <div className="bg-gray-950/50 px-4 py-2 border-b border-gray-800 flex justify-between items-center text-xs font-semibold text-gray-400 tracking-wider uppercase">
        <span>{match.stage}</span>
        <span>{match.date}</span>
      </div>
      
      <div className="p-6 flex items-center justify-between">
        {/* Team A */}
        <div className="flex flex-col items-center gap-3 w-1/3">
          <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
            {match.teamA.logo ? (
              <img src={match.teamA.logo} alt={match.teamA.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-gray-500">{match.teamA.name.charAt(0)}</span>
            )}
          </div>
          <span className="font-bold text-white text-center text-sm">{match.teamA.name}</span>
        </div>

        {/* Score / vs */}
        <div className="flex flex-col items-center justify-center w-1/3">
          {isCompleted ? (
            <>
              <div className="flex items-center gap-3 text-3xl font-black text-white">
                <span>{match.teamA.score}</span>
                <span className="text-gray-600 text-xl">-</span>
                <span>{match.teamB.score}</span>
              </div>
              {match.penalties && (
                <div className="text-xs text-brand-purple font-medium mt-1">
                  ({match.penalties.teamA}-{match.penalties.teamB} pens)
                </div>
              )}
            </>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-950 border border-gray-800 flex items-center justify-center">
              <span className="text-gray-500 font-bold text-sm">VS</span>
            </div>
          )}
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center gap-3 w-1/3">
          <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
            {match.teamB.logo ? (
              <img src={match.teamB.logo} alt={match.teamB.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-gray-500">{match.teamB.name.charAt(0)}</span>
            )}
          </div>
          <span className="font-bold text-white text-center text-sm">{match.teamB.name}</span>
        </div>
      </div>

      {/* Goal Scorers Preview */}
      {isCompleted && match.events?.goals && match.events.goals.length > 0 && (
        <div className="bg-gray-950/30 px-6 py-3 border-t border-gray-800/50 flex justify-between text-xs text-gray-400">
          <div className="flex flex-col items-start gap-1">
            {match.events.goals.filter(g => g.team === 'A').map((g, i) => (
              <span key={i}>{g.player} ⚽</span>
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            {match.events.goals.filter(g => g.team === 'B').map((g, i) => (
              <span key={i}>⚽ {g.player}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

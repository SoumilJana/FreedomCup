
import { Star, Target, Activity, Square } from 'lucide-react';

interface PlayerCardProps {
  player: {
    name: string;
    jersey_number: number;
    position: string;
    photo_url: string;
    squad_role?: string;
    stats: {
      goals: number;
      yellow_cards: number;
      red_cards: number;
      motm: number;
      appearances: number;
    };
  };
}

export function PlayerCard({ player }: PlayerCardProps) {
  const isStaff = player.squad_role?.includes('Owner') || player.squad_role?.includes('Representative');

  return (
    <div className={`relative w-64 h-80 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 ${!isStaff ? 'group transition-all duration-300 hover:border-brand-purple hover:shadow-[0_0_20px_rgba(76,29,149,0.3)]' : ''}`}>
      {/* Background Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center ${!isStaff ? 'transition-transform duration-500 group-hover:scale-110' : ''}`}
        style={{ backgroundImage: `url(${player.photo_url || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=600&auto=format&fit=crop'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
      </div>

      {/* Normal View Content */}
      <div className={`absolute inset-0 p-4 flex flex-col justify-end ${!isStaff ? 'transition-opacity duration-300 group-hover:opacity-0' : ''}`}>
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {player.name}
              {!isStaff && player.stats.motm > 0 && (
                <span className="flex items-center text-yellow-400 text-sm bg-gray-900/80 px-1.5 py-0.5 rounded border border-yellow-500/30">
                  <Star size={12} className="fill-yellow-400 mr-1" /> x{player.stats.motm}
                </span>
              )}
            </h3>
            <p className={`text-gray-400 text-xs font-medium tracking-wider ${!isStaff ? 'uppercase' : ''}`}>
              {player.squad_role && player.squad_role !== 'Regular'
                ? (player.squad_role === 'Retained' ? 'Retained Player' : 
                   player.squad_role?.includes('Representative') ? 'Representative' :
                   player.squad_role?.includes('Owner') ? 'Team Owner' :
                   player.squad_role)
                : player.position}
            </p>
          </div>
          <span className="text-5xl font-black text-brand-purple drop-shadow-md">{player.jersey_number}</span>
        </div>
      </div>

      {/* Hover View Stats (Hidden by default, slides up on hover) */}
      {!isStaff && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent p-5 flex flex-col -translate-x-full transition-transform duration-300 group-hover:translate-x-0">
          
          {/* Top Badge */}
          <div className="flex justify-between items-start min-h-[28px]">
            {player.squad_role && player.squad_role !== 'Regular' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-purple"></div>
                <span className="text-[9px] font-bold tracking-widest text-gray-300 uppercase">
                  {player.squad_role === 'Retained' ? 'Retained Player' : player.squad_role}
                </span>
              </div>
            )}
          </div>

          {/* Huge Number Background */}
          <div className="absolute top-4 right-4 text-8xl font-black text-transparent opacity-80 select-none pointer-events-none" style={{ WebkitTextStroke: '2px rgba(167, 139, 250, 0.8)' }}>
            {player.jersey_number}
          </div>

          {/* Spacer to push content down */}
          <div className="flex-1"></div>

          {/* Name & Position */}
          <div className="mb-4">
            <h3 className="text-3xl font-black text-white leading-none tracking-tight mb-1">
              {player.name.split(' ').map((part, i) => <div key={i}>{part}</div>)}
            </h3>
            <p className="text-xs font-bold text-brand-purple tracking-widest uppercase">{player.position}</p>
            <div className="w-6 h-0.5 bg-brand-purple/50 mt-2"></div>
          </div>

          {/* Stats */}
          <div className="space-y-2.5 mb-4">
            <div className="flex items-center justify-between border-b border-gray-800/60 pb-1.5">
              <div className="flex items-center gap-3 text-brand-purple">
                <Target size={12} />
                <span className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">Goals</span>
              </div>
              <span className="text-xs font-bold text-white">{player.stats.goals}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800/60 pb-1.5">
              <div className="flex items-center gap-3 text-brand-purple">
                <Activity size={12} />
                <span className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">Played</span>
              </div>
              <span className="text-xs font-bold text-white">{player.stats.appearances}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800/60 pb-1.5">
              <div className="flex items-center gap-3 text-brand-purple">
                <Square size={12} />
                <span className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">Cards</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold">
                <span className="text-yellow-500">{player.stats.yellow_cards}</span>
                <span className="text-gray-600">/</span>
                <span className="text-red-500">{player.stats.red_cards}</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800/60 pb-1.5">
              <div className="flex items-center gap-3 text-brand-purple">
                <Star size={12} />
                <span className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">MOTM</span>
              </div>
              <span className="text-xs font-bold text-white">{player.stats.motm}</span>
            </div>
          </div>


        </div>
      )}
    </div>
  );
}

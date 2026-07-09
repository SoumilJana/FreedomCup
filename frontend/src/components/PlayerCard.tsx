import React from 'react';
import { Star } from 'lucide-react';

interface PlayerCardProps {
  player: {
    name: string;
    jersey_number: number;
    position: string;
    photo_url: string;
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
  return (
    <div className="relative group w-64 h-80 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 transition-all duration-300 hover:border-brand-purple hover:shadow-[0_0_20px_rgba(76,29,149,0.3)]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${player.photo_url || 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=600&auto=format&fit=crop'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
      </div>

      {/* Normal View Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end transition-opacity duration-300 group-hover:opacity-0">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {player.name}
              {player.stats.motm > 0 && (
                <span className="flex items-center text-yellow-400 text-sm bg-gray-900/80 px-1.5 py-0.5 rounded border border-yellow-500/30">
                  <Star size={12} className="fill-yellow-400 mr-1" /> x{player.stats.motm}
                </span>
              )}
            </h3>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{player.position}</p>
          </div>
          <span className="text-4xl font-black text-brand-purple/40">{player.jersey_number}</span>
        </div>
      </div>

      {/* Hover View Stats (Hidden by default, slides up on hover) */}
      <div className="absolute inset-0 bg-gray-950/90 p-6 flex flex-col justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-1">{player.name}</h3>
        <p className="text-brand-purple font-medium mb-6">{player.position}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-lg p-3 text-center border border-gray-800">
            <span className="block text-2xl font-bold text-white">{player.stats.goals}</span>
            <span className="text-xs text-gray-400 uppercase">Goals</span>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 text-center border border-gray-800">
            <span className="block text-2xl font-bold text-white">{player.stats.appearances}</span>
            <span className="text-xs text-gray-400 uppercase">Played</span>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 text-center border border-gray-800">
            <div className="flex justify-center gap-2 text-lg font-bold">
              <span className="text-yellow-500">{player.stats.yellow_cards}</span>
              <span className="text-gray-600">/</span>
              <span className="text-red-500">{player.stats.red_cards}</span>
            </div>
            <span className="text-xs text-gray-400 uppercase">Cards</span>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 text-center border border-yellow-500/20">
            <span className="block text-2xl font-bold text-yellow-400">{player.stats.motm}</span>
            <span className="text-xs text-yellow-500/70 uppercase">MOTM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

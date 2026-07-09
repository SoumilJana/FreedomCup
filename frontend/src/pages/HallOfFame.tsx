
const founders = [
  { name: 'Founder One', role: 'Tournament Director', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Founder Two', role: 'Operations Head', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Founder Three', role: 'Technical Lead', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Founder Four', role: 'Event Coordinator', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400' }
];

const pastWinners = [
  { year: 'Season 4', team: 'Defending Champions', image: 'https://images.unsplash.com/photo-1574629810360-7efbb1925713?auto=format&fit=crop&q=80&w=600&h=400' },
  { year: 'Season 3', team: 'Legends FC', image: 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?auto=format&fit=crop&q=80&w=600&h=400' },
  { year: 'Season 2', team: 'City Strikers', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=600&h=400' },
  { year: 'Season 1', team: 'Pioneer United', image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=600&h=400' }
];

const pastRunnerUps = [
  { year: 'Season 4', team: 'Silver Strikers', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600&h=400' },
  { year: 'Season 3', team: 'FC Phoenix', image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=600&h=400' },
  { year: 'Season 2', team: 'Metro Knights', image: 'https://images.unsplash.com/photo-1551280857-2b9ebf241519?auto=format&fit=crop&q=80&w=600&h=400' },
  { year: 'Season 1', team: 'Originals FC', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=600&h=400' }
];

export function HallOfFame() {
  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">
          Hall of <span className="text-brand-purple">Fame</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Honoring the visionaries who started it all and the champions who etched their names into Freedom Cup history.
        </p>
      </div>

      {/* Founders Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent flex-1" />
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-center">Our Founders</h2>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent flex-1" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {founders.map((founder, idx) => (
            <div key={idx} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-brand-purple/50 transition-all duration-300 group">
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={founder.image} 
                  alt={founder.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white">{founder.name}</h3>
                  <p className="text-brand-purple font-medium">{founder.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Winners Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-900 to-transparent flex-1" />
          <h2 className="text-2xl font-bold text-yellow-500 uppercase tracking-widest text-center">Champions</h2>
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-900 to-transparent flex-1" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pastWinners.map((winner, idx) => (
            <div key={idx} className="bg-gradient-to-br from-yellow-900/20 to-gray-900/50 backdrop-blur-sm border border-yellow-900/30 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 group">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={winner.image} 
                  alt={winner.team} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
                <div className="absolute top-4 right-4 bg-yellow-500 text-gray-950 font-black px-3 py-1 rounded-full text-sm">
                  {winner.year}
                </div>
              </div>
              <div className="p-6 text-center -mt-8 relative z-10">
                <div className="w-16 h-16 mx-auto bg-gray-950 border-2 border-yellow-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2.5a.75.75 0 01.75.75v1.892a7.001 7.001 0 015.422 5.093c.123.418.175.856.175 1.303 0 1.932-1.568 3.5-3.5 3.5h-5.75c-1.932 0-3.5-1.568-3.5-3.5 0-.447.052-.885.175-1.303a7.001 7.001 0 015.422-5.093V3.25A.75.75 0 0110 2.5zM7.5 16.5a2.5 2.5 0 005 0h-5z" clipRule="evenodd" />
                    <path d="M10 2a1 1 0 011 1v1.171a7.994 7.994 0 014.28 2.585l1.666-1.666a1 1 0 111.414 1.414l-1.666 1.666a8.006 8.006 0 011.583 3.916 5.006 5.006 0 01-1.353 3.336L16.2 16.2a1 1 0 01-1.414-1.414l.724-.724A3.003 3.003 0 0013.5 13H13v-1h.5a1 1 0 011 1v.793a6.002 6.002 0 00-1.848-8.835l-1.415 1.415a1 1 0 11-1.414-1.414l1.415-1.415A6.006 6.006 0 0011 4.542V3a1 1 0 01-1-1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">{winner.team}</h3>
                <p className="text-gray-400 mt-1">Tournament Champions</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Runner Ups Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1" />
          <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest text-center">Runner Ups</h2>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pastRunnerUps.map((runner, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-800/20 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-500/50 transition-all duration-300 group">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={runner.image} 
                  alt={runner.team} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
                <div className="absolute top-4 right-4 bg-gray-500 text-gray-950 font-black px-3 py-1 rounded-full text-sm">
                  {runner.year}
                </div>
              </div>
              <div className="p-6 text-center -mt-8 relative z-10">
                <div className="w-16 h-16 mx-auto bg-gray-950 border-2 border-gray-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-gray-500/20">
                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2.5a.75.75 0 01.75.75v1.892a7.001 7.001 0 015.422 5.093c.123.418.175.856.175 1.303 0 1.932-1.568 3.5-3.5 3.5h-5.75c-1.932 0-3.5-1.568-3.5-3.5 0-.447.052-.885.175-1.303a7.001 7.001 0 015.422-5.093V3.25A.75.75 0 0110 2.5zM7.5 16.5a2.5 2.5 0 005 0h-5z" clipRule="evenodd" />
                    <path d="M10 2a1 1 0 011 1v1.171a7.994 7.994 0 014.28 2.585l1.666-1.666a1 1 0 111.414 1.414l-1.666 1.666a8.006 8.006 0 011.583 3.916 5.006 5.006 0 01-1.353 3.336L16.2 16.2a1 1 0 01-1.414-1.414l.724-.724A3.003 3.003 0 0013.5 13H13v-1h.5a1 1 0 011 1v.793a6.002 6.002 0 00-1.848-8.835l-1.415 1.415a1 1 0 11-1.414-1.414l1.415-1.415A6.006 6.006 0 0011 4.542V3a1 1 0 01-1-1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">{runner.team}</h3>
                <p className="text-gray-400 mt-1">2nd Place Finish</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

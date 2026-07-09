import { motion } from 'framer-motion';

const pastSeasons = [
  {
    id: 1,
    name: 'Season 1',
    isFoundingBatch: true,
    finalScore: '0 - 0',
    champion: { team: 'Pioneer United', image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=600&h=400' },
    runnerUp: { team: 'Originals FC', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=600&h=400' },
    awards: {
      mot: 'TBD Player',
      goldenGlove: 'TBD Player',
      bestDefender: 'TBD Player',
      goldenBoot: 'TBD Player'
    }
  },
  {
    id: 2,
    name: 'Season 2',
    isFoundingBatch: false,
    finalScore: '0 - 0',
    champion: { team: 'City Strikers', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=600&h=400' },
    runnerUp: { team: 'Metro Knights', image: 'https://images.unsplash.com/photo-1551280857-2b9ebf241519?auto=format&fit=crop&q=80&w=600&h=400' },
    awards: {
      mot: 'TBD Player',
      goldenGlove: 'TBD Player',
      bestDefender: 'TBD Player',
      goldenBoot: 'TBD Player'
    }
  },
  {
    id: 3,
    name: 'Season 3',
    isFoundingBatch: false,
    finalScore: '0 - 0',
    champion: { team: 'Legends FC', image: 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?auto=format&fit=crop&q=80&w=600&h=400' },
    runnerUp: { team: 'FC Phoenix', image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=600&h=400' },
    awards: {
      mot: 'TBD Player',
      goldenGlove: 'TBD Player',
      bestDefender: 'TBD Player',
      goldenBoot: 'TBD Player'
    }
  },
  {
    id: 4,
    name: 'Season 4',
    isFoundingBatch: false,
    finalScore: '0 - 0',
    champion: { team: 'Defending Champions', image: 'https://images.unsplash.com/photo-1574629810360-7efbb1925713?auto=format&fit=crop&q=80&w=600&h=400' },
    runnerUp: { team: 'Silver Strikers', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600&h=400' },
    awards: {
      mot: 'TBD Player',
      goldenGlove: 'TBD Player',
      bestDefender: 'TBD Player',
      goldenBoot: 'TBD Player'
    }
  },
  {
    id: 5,
    name: 'Season 5',
    isFoundingBatch: false,
    finalScore: '0 - 0',
    champion: { team: 'TBD Champion', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=600&h=400' },
    runnerUp: { team: 'TBD Runner Up', image: 'https://images.unsplash.com/photo-1574629810360-7efbb1925713?auto=format&fit=crop&q=80&w=600&h=400' },
    awards: {
      mot: 'TBD Player',
      goldenGlove: 'TBD Player',
      bestDefender: 'TBD Player',
      goldenBoot: 'TBD Player'
    }
  }
];

export function HallOfFame() {
  return (
    <div className="bg-gray-950 min-h-screen pb-24">
      {/* Header */}
      <div className="text-center space-y-4 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black italic tracking-tighter text-white"
        >
          Hall of <span className="text-brand-purple">Fame</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl mx-auto px-4"
        >
          Honoring the champions who etched their names into Freedom Cup history.
        </motion.p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* The central line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-800 -translate-x-1/2 rounded-full" />

        <div className="space-y-24">
          {pastSeasons.map((season, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div 
                key={season.id} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-brand-purple shadow-[0_0_15px_rgba(139,92,246,0.5)] -translate-x-1/2 mt-8 md:mt-0 z-10" />

                {/* Content Side */}
                <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-16' : 'md:pl-16'}`}>
                  
                  <div className={`flex flex-col gap-6 ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                    
                    {/* Season Header */}
                    <div className={`flex flex-col gap-2 ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                      <div className="flex items-center gap-3">
                        <h2 className="text-4xl font-black text-white italic tracking-tighter">
                          {season.name}
                        </h2>
                        {season.isFoundingBatch && (
                          <span className="bg-brand-purple/20 text-brand-purple border border-brand-purple/30 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                            Founding Batch
                          </span>
                        )}
                      </div>
                      
                      {/* Final Score */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg shadow-inner">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Final Score</span>
                        <span className="text-xl font-black text-white">{season.finalScore}</span>
                      </div>
                    </div>

                    <div className="w-full grid grid-cols-1 gap-4">
                      
                      {/* Champion Card */}
                      <div className="bg-gradient-to-br from-yellow-900/20 to-gray-900/50 backdrop-blur-sm border border-yellow-900/30 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 group">
                        <div className="h-40 overflow-hidden relative">
                          <img 
                            src={season.champion.image} 
                            alt={season.champion.team} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
                          <div className="absolute top-4 right-4 bg-yellow-500 text-gray-950 font-black px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2.5a.75.75 0 01.75.75v1.892a7.001 7.001 0 015.422 5.093c.123.418.175.856.175 1.303 0 1.932-1.568 3.5-3.5 3.5h-5.75c-1.932 0-3.5-1.568-3.5-3.5 0-.447.052-.885.175-1.303a7.001 7.001 0 015.422-5.093V3.25A.75.75 0 0110 2.5zM7.5 16.5a2.5 2.5 0 005 0h-5z" clipRule="evenodd" />
                              <path d="M10 2a1 1 0 011 1v1.171a7.994 7.994 0 014.28 2.585l1.666-1.666a1 1 0 111.414 1.414l-1.666 1.666a8.006 8.006 0 011.583 3.916 5.006 5.006 0 01-1.353 3.336L16.2 16.2a1 1 0 01-1.414-1.414l.724-.724A3.003 3.003 0 0013.5 13H13v-1h.5a1 1 0 011 1v.793a6.002 6.002 0 00-1.848-8.835l-1.415 1.415a1 1 0 11-1.414-1.414l1.415-1.415A6.006 6.006 0 0011 4.542V3a1 1 0 01-1-1z" />
                            </svg>
                            Champion
                          </div>
                        </div>
                        <div className="p-4 bg-gray-900/80">
                          <h3 className="text-xl font-bold text-white">{season.champion.team}</h3>
                        </div>
                      </div>

                      {/* Runner Up Card */}
                      <div className="bg-gradient-to-br from-gray-800/20 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-500/50 transition-all duration-300 group">
                        <div className="p-4 flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-300">{season.runnerUp.team}</h3>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-800 px-2 py-1 rounded">Runner Up</span>
                        </div>
                      </div>

                      {/* Awards Section */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 flex flex-col gap-1 hover:bg-gray-800/50 transition-colors">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-purple">Player of Tournament</span>
                          <span className="text-sm font-medium text-white truncate">{season.awards.mot}</span>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 flex flex-col gap-1 hover:bg-gray-800/50 transition-colors">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-yellow-500">Golden Boot</span>
                          <span className="text-sm font-medium text-white truncate">{season.awards.goldenBoot}</span>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 flex flex-col gap-1 hover:bg-gray-800/50 transition-colors">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Golden Glove</span>
                          <span className="text-sm font-medium text-white truncate">{season.awards.goldenGlove}</span>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 flex flex-col gap-1 hover:bg-gray-800/50 transition-colors">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Best Defender</span>
                          <span className="text-sm font-medium text-white truncate">{season.awards.bestDefender}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Empty Side for Desktop alignment */}
                <div className="hidden md:block w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

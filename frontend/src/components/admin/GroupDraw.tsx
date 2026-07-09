import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type Team = Database['public']['Tables']['teams']['Row'];

type DrawPhase = 'idle' | 'spinning' | 'landed' | 'complete';

interface DrawnTeam {
  team: Team;
  group: 'A' | 'B';
}

export function GroupDraw() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [phase, setPhase] = useState<DrawPhase>('idle');
  const [drawnTeams, setDrawnTeams] = useState<DrawnTeam[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(-1);
  // The team currently displayed in the spinning reel
  const [reelTeam, setReelTeam] = useState<Team | null>(null);
  const [reelSpeed, setReelSpeed] = useState<'fast' | 'medium' | 'slow' | 'stopped'>('fast');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const { data } = await supabase.from('teams').select('*').order('name');
    if (data) setTeams(data);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      timeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const clearTimers = () => {
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
      spinIntervalRef.current = null;
    }
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Spin the reel through teams, slow down, and land on the target
  const spinAndReveal = useCallback((targetTeam: Team, onComplete: () => void) => {
    clearTimers();
    setPhase('spinning');
    setReelSpeed('fast');

    let tick = 0;
    const totalTicks = 24; // total cycles before landing

    spinIntervalRef.current = setInterval(() => {
      // Pick a random team to show (avoid showing the target too early)
      let displayTeam: Team;
      if (tick < totalTicks - 1) {
        const others = teams.filter(t => t.id !== targetTeam.id);
        displayTeam = others.length > 0
          ? others[Math.floor(Math.random() * others.length)]
          : targetTeam;
      } else {
        displayTeam = targetTeam;
      }
      setReelTeam(displayTeam);

      // Slow down phases
      if (tick === 12) {
        setReelSpeed('medium');
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = setInterval(() => {
          tick++;
          const others = teams.filter(t => t.id !== targetTeam.id);
          if (tick < totalTicks - 1) {
            setReelTeam(others[Math.floor(Math.random() * others.length)] || targetTeam);
          }
          if (tick === 18) {
            setReelSpeed('slow');
            if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
            spinIntervalRef.current = setInterval(() => {
              tick++;
              if (tick < totalTicks - 1) {
                const o = teams.filter(t => t.id !== targetTeam.id);
                setReelTeam(o[Math.floor(Math.random() * o.length)] || targetTeam);
              }
              if (tick >= totalTicks) {
                if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
                spinIntervalRef.current = null;
                // Land on the target
                setReelTeam(targetTeam);
                setReelSpeed('stopped');
                const t = setTimeout(() => {
                  onComplete();
                }, 300);
                timeoutsRef.current.push(t);
              }
            }, 350);
          }
        }, 180);
        return;
      }
      tick++;
    }, 80);
  }, [teams]);

  const startDraw = useCallback(() => {
    if (teams.length === 0) return;

    setDrawnTeams([]);
    setCurrentRevealIndex(-1);
    setReelTeam(null);
    setSaved(false);

    const shuffledTeams = shuffleArray(teams);
    const startWithA = Math.random() < 0.5;
    const assignments: DrawnTeam[] = shuffledTeams.map((team, index) => ({
      team,
      group: (index % 2 === 0) === startWithA ? 'A' : 'B',
    }));

    setDrawnTeams(assignments);
    setCurrentRevealIndex(0);

    // Kick off the first spin
    spinAndReveal(assignments[0].team, () => {
      setPhase('landed');
    });
  }, [teams, spinAndReveal]);

  // When phase becomes 'landed', show the group badge for a moment, then move to next
  useEffect(() => {
    if (phase !== 'landed' || currentRevealIndex < 0) return;

    // After showing the landed card with group for 2s, proceed
    const timer = setTimeout(() => {
      const nextIndex = currentRevealIndex + 1;
      if (nextIndex >= drawnTeams.length) {
        setPhase('complete');
        setReelTeam(null);
      } else {
        setCurrentRevealIndex(nextIndex);
        // Spin for the next team
        spinAndReveal(drawnTeams[nextIndex].team, () => {
          setPhase('landed');
        });
      }
    }, 2000);

    timeoutsRef.current.push(timer);
    return () => clearTimeout(timer);
  }, [phase, currentRevealIndex, drawnTeams, spinAndReveal]);

  const saveToDatabase = async () => {
    setSaving(true);
    try {
      for (const drawn of drawnTeams) {
        await supabase
          .from('teams')
          .update({ group_name: drawn.group })
          .eq('id', drawn.team.id);
      }
      setSaved(true);
      // Refresh local teams so the rest of the app sees updates
      await fetchTeams();
    } catch (err) {
      console.error('Error saving groups:', err);
    } finally {
      setSaving(false);
    }
  };

  const resetDraw = () => {
    clearTimers();
    setPhase('idle');
    setDrawnTeams([]);
    setCurrentRevealIndex(-1);
    setReelTeam(null);
    setReelSpeed('fast');
    setSaved(false);
  };

  const resetAllGroups = async () => {
    setResetting(true);
    try {
      await supabase.from('teams').update({ group_name: null }).not('id', 'is', null);
      await fetchTeams();
      resetDraw();
    } catch (err) {
      console.error('Error resetting groups:', err);
    } finally {
      setResetting(false);
    }
  };

  // Which teams are already placed in group columns
  const revealedCount = phase === 'complete'
    ? drawnTeams.length
    : phase === 'landed'
      ? currentRevealIndex // don't add the landed one yet — it's still on the reel
      : Math.max(0, currentRevealIndex);

  const groupA = drawnTeams.slice(0, revealedCount).filter(d => d.group === 'A');
  const groupB = drawnTeams.slice(0, revealedCount).filter(d => d.group === 'B');

  const currentDrawn = currentRevealIndex >= 0 && currentRevealIndex < drawnTeams.length
    ? drawnTeams[currentRevealIndex]
    : null;

  const isSpinning = phase === 'spinning' || phase === 'landed';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 p-8">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">GROUP DRAW</h2>
          <p className="text-gray-400 text-sm mb-6">
            {phase === 'idle' && 'Click start to randomly assign teams to groups'}
            {phase === 'spinning' && `Drawing team ${currentRevealIndex + 1} of ${drawnTeams.length}...`}
            {phase === 'landed' && `Team ${currentRevealIndex + 1} of ${drawnTeams.length} assigned!`}
            {phase === 'complete' && 'Draw complete!'}
          </p>

          {phase === 'idle' && (
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={startDraw}
                disabled={teams.length === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-12 py-4 bg-gradient-to-r from-brand-purple to-indigo-500 text-white font-black text-lg rounded-xl shadow-lg shadow-brand-purple/30 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10">START DRAW</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-brand-purple"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
              <motion.button
                onClick={resetAllGroups}
                disabled={resetting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-lg rounded-xl transition-colors disabled:opacity-50"
              >
                {resetting ? 'Resetting...' : 'Reset All Groups'}
              </motion.button>
            </div>
          )}

          {phase === 'complete' && (
            <div className="flex gap-4 justify-center flex-wrap">
              {!saved ? (
                <motion.button
                  onClick={saveToDatabase}
                  disabled={saving}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : '✓ Save Groups'}
                </motion.button>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-8 py-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold rounded-xl"
                >
                  ✓ Groups Saved!
                </motion.div>
              )}
              <motion.button
                onClick={resetDraw}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl transition-colors"
              >
                Redraw
              </motion.button>
              <motion.button
                onClick={resetAllGroups}
                disabled={resetting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {resetting ? 'Resetting...' : 'Reset All Groups'}
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Slot Machine Reel — the central draw card */}
      <AnimatePresence>
        {isSpinning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Glow ring */}
              <motion.div
                className="absolute -inset-4 rounded-3xl"
                animate={{
                  boxShadow: phase === 'landed'
                    ? currentDrawn?.group === 'A'
                      ? '0 0 60px rgba(56,189,248,0.4), 0 0 120px rgba(56,189,248,0.1)'
                      : '0 0 60px rgba(245,158,11,0.4), 0 0 120px rgba(245,158,11,0.1)'
                    : '0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(139,92,246,0.1)',
                }}
                transition={{ duration: 0.3 }}
              />

              {/* The card itself */}
              <motion.div
                className={`relative w-72 rounded-2xl border-2 overflow-hidden transition-colors duration-300 ${
                  phase === 'landed'
                    ? currentDrawn?.group === 'A'
                      ? 'border-sky-500 bg-gray-900'
                      : 'border-amber-500 bg-gray-900'
                    : 'border-brand-purple/60 bg-gray-900'
                }`}
                animate={
                  reelSpeed === 'fast'
                    ? { y: [0, -4, 0, 4, 0] }
                    : reelSpeed === 'medium'
                      ? { y: [0, -2, 0, 2, 0] }
                      : {}
                }
                transition={
                  reelSpeed === 'fast'
                    ? { duration: 0.1, repeat: Infinity }
                    : reelSpeed === 'medium'
                      ? { duration: 0.18, repeat: Infinity }
                      : {}
                }
              >
                {/* Top accent bar */}
                <div
                  className={`h-1.5 transition-colors duration-300 ${
                    phase === 'landed'
                      ? currentDrawn?.group === 'A'
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600'
                        : 'bg-gradient-to-r from-amber-500 to-orange-600'
                      : 'bg-gradient-to-r from-brand-purple to-indigo-500'
                  }`}
                />

                <div className="p-6">
                  {/* Status label */}
                  <div className="text-center mb-4">
                    {phase === 'spinning' && (
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="text-xs font-bold uppercase tracking-[0.3em] text-brand-purple"
                      >
                        Randomizing
                      </motion.span>
                    )}
                    {phase === 'landed' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400"
                      >
                        ✓ Selected
                      </motion.span>
                    )}
                  </div>

                  {/* Team logo area */}
                  <div className="flex justify-center mb-4">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={reelTeam?.id || 'empty'}
                        initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          filter: 'blur(0px)',
                          scale: reelSpeed === 'stopped' ? [1, 1.1, 1] : 1,
                        }}
                        exit={{ y: -40, opacity: 0, filter: 'blur(8px)' }}
                        transition={{
                          duration: reelSpeed === 'fast' ? 0.06 : reelSpeed === 'medium' ? 0.12 : 0.25,
                          scale: { delay: 0.1, duration: 0.4 },
                        }}
                        className="w-24 h-24 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center"
                      >
                        {reelTeam?.logo_url ? (
                          <img src={reelTeam.logo_url} alt={reelTeam.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-black text-gray-600">
                            {reelTeam?.name?.charAt(0) || '?'}
                          </span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Team name */}
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={reelTeam?.id || 'empty'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reelSpeed === 'fast' ? 0.05 : 0.15 }}
                      className="text-center mb-4"
                    >
                      <div className={`text-xl font-black text-white transition-all ${
                        reelSpeed === 'fast' ? 'blur-[1px]' : reelSpeed === 'medium' ? 'blur-[0.5px]' : ''
                      }`}>
                        {reelTeam?.name || '...'}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Group assignment badge — only shown when landed */}
                  <div className="h-14 flex items-center justify-center">
                    <AnimatePresence>
                      {phase === 'landed' && currentDrawn && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          className={`px-8 py-2.5 rounded-xl text-lg font-black ${
                            currentDrawn.group === 'A'
                              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/40'
                              : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/40'
                          }`}
                        >
                          GROUP {currentDrawn.group}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {phase === 'spinning' && (
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                            className="w-2 h-2 rounded-full bg-brand-purple"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Counter */}
                <div className="px-6 pb-4 text-center">
                  <span className="text-xs text-gray-500 font-medium">
                    {currentRevealIndex + 1} / {drawnTeams.length}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Columns */}
      {(isSpinning || phase === 'complete') && (
        <div className="grid grid-cols-2 gap-6">
          {/* Group A */}
          <div className="rounded-xl border border-sky-500/30 bg-gradient-to-b from-sky-500/10 to-transparent p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-sky-500/30">
                A
              </div>
              <h3 className="text-lg font-bold text-white">Group A</h3>
              <span className="ml-auto text-sm text-sky-400 font-medium">{groupA.length} teams</span>
            </div>
            <div className="space-y-3 min-h-[200px]">
              <AnimatePresence>
                {groupA.map((drawn) => (
                  <motion.div
                    key={drawn.team.id}
                    initial={{ opacity: 0, x: -60, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/80 border border-gray-800 hover:border-sky-500/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {drawn.team.logo_url ? (
                        <img src={drawn.team.logo_url} alt={drawn.team.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-gray-500">{drawn.team.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="font-semibold text-white text-sm">{drawn.team.name}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {groupA.length === 0 && (
                <div className="flex items-center justify-center h-[200px] text-gray-600 text-sm">
                  Waiting for draw...
                </div>
              )}
            </div>
          </div>

          {/* Group B */}
          <div className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-amber-500/30">
                B
              </div>
              <h3 className="text-lg font-bold text-white">Group B</h3>
              <span className="ml-auto text-sm text-amber-400 font-medium">{groupB.length} teams</span>
            </div>
            <div className="space-y-3 min-h-[200px]">
              <AnimatePresence>
                {groupB.map((drawn) => (
                  <motion.div
                    key={drawn.team.id}
                    initial={{ opacity: 0, x: 60, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/80 border border-gray-800 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {drawn.team.logo_url ? (
                        <img src={drawn.team.logo_url} alt={drawn.team.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-gray-500">{drawn.team.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="font-semibold text-white text-sm">{drawn.team.name}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {groupB.length === 0 && (
                <div className="flex items-center justify-center h-[200px] text-gray-600 text-sm">
                  Waiting for draw...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Idle — show teams or existing group assignments */}
      {phase === 'idle' && (() => {
        const existingA = teams.filter(t => t.group_name === 'A');
        const existingB = teams.filter(t => t.group_name === 'B');
        const hasExistingGroups = existingA.length > 0 || existingB.length > 0;

        if (hasExistingGroups) {
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Current Group Assignments
                </h3>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-medium">
                  ✓ Saved
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Existing Group A */}
                <div className="rounded-xl border border-sky-500/30 bg-gradient-to-b from-sky-500/10 to-transparent p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-sky-500/30">
                      A
                    </div>
                    <h3 className="text-lg font-bold text-white">Group A</h3>
                    <span className="ml-auto text-sm text-sky-400 font-medium">{existingA.length} teams</span>
                  </div>
                  <div className="space-y-3">
                    {existingA.map(team => (
                      <div key={team.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/80 border border-gray-800">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {team.logo_url ? (
                            <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-gray-500">{team.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="font-semibold text-white text-sm">{team.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Existing Group B */}
                <div className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-amber-500/30">
                      B
                    </div>
                    <h3 className="text-lg font-bold text-white">Group B</h3>
                    <span className="ml-auto text-sm text-amber-400 font-medium">{existingB.length} teams</span>
                  </div>
                  <div className="space-y-3">
                    {existingB.map(team => (
                      <div key={team.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/80 border border-gray-800">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {team.logo_url ? (
                            <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-gray-500">{team.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="font-semibold text-white text-sm">{team.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Teams in draw ({teams.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {teams.map(team => (
                <div key={team.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-950 border border-gray-800">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {team.logo_url ? (
                      <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-gray-500">{team.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-300 truncate">{team.name}</span>
                </div>
              ))}
            </div>
            {teams.length === 0 && (
              <p className="text-gray-500 text-center py-8">No teams found. Add teams first.</p>
            )}
          </div>
        );
      })()}
    </div>
  );
}

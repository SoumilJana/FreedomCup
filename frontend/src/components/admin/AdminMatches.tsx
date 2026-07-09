import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type Team = Database['public']['Tables']['teams']['Row'];
type Player = Database['public']['Tables']['players']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];

export function AdminMatches() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Selected Match for Editing
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  // Match Edit State
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [penaltiesA, setPenaltiesA] = useState<number>(0);
  const [penaltiesB, setPenaltiesB] = useState<number>(0);
  const [motmPlayerId, setMotmPlayerId] = useState<string>('');
  
  // New Match State
  const [newMatchTeamA, setNewMatchTeamA] = useState('');
  const [newMatchTeamB, setNewMatchTeamB] = useState('');
  const [newMatchStage, setNewMatchStage] = useState('Group');
  const [newMatchOrder, setNewMatchOrder] = useState<number>(1);
  
  // Match Events State
  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({ type: 'Goal', playerId: '', teamId: '' });

  const fetchData = async () => {
    const [tRes, pRes, mRes] = await Promise.all([
      supabase.from('teams').select('*').order('name'),
      supabase.from('players').select('*').order('name'),
      supabase.from('matches').select('*').order('match_order', { ascending: true }).order('match_date', { ascending: true })
    ]);
    if (tRes.data) setTeams(tRes.data);
    if (pRes.data) setPlayers(pRes.data);
    if (mRes.data) setMatches(mRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatchTeamA || !newMatchTeamB) return;
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.from('matches').insert({
        team_a_id: newMatchTeamA,
        team_b_id: newMatchTeamB,
        stage: newMatchStage,
        match_date: new Date().toISOString(),
        match_order: newMatchOrder,
        status: 'Scheduled'
      });
      if (error) throw error;
      setMessage('Match added successfully!');
      fetchData();
      setNewMatchTeamA('');
      setNewMatchTeamB('');
      setNewMatchOrder(prev => prev + 1);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openMatchEditor = async (m: Match) => {
    setSelectedMatch(m);
    setScoreA(m.team_a_score || 0);
    setScoreB(m.team_b_score || 0);
    setPenaltiesA(m.team_a_penalties || 0);
    setPenaltiesB(m.team_b_penalties || 0);
    setMotmPlayerId(m.motm_player_id || '');

    // Fetch existing events
    const { data } = await supabase.from('match_events').select('*').eq('match_id', m.id);
    setEvents(data || []);
  };

  const addEvent = () => {
    if (!newEvent.playerId || !newEvent.teamId) return;
    setEvents([...events, { ...newEvent, tempId: Math.random().toString() }]);
    setNewEvent({ type: 'Goal', playerId: '', teamId: '' });
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const saveMatch = async () => {
    if (!selectedMatch) return;
    setLoading(true);
    setMessage('');
    try {
      // 1. Update Match record
      const isTied = scoreA === scoreB;
      
      const { error: matchError } = await supabase.from('matches')
        .update({
          status: 'Completed',
          team_a_score: scoreA,
          team_b_score: scoreB,
          team_a_penalties: isTied ? penaltiesA : null,
          team_b_penalties: isTied ? penaltiesB : null,
          motm_player_id: motmPlayerId || null
        })
        .eq('id', selectedMatch.id);
      
      if (matchError) throw matchError;

      // 2. Delete old events and insert new ones
      await supabase.from('match_events').delete().eq('match_id', selectedMatch.id);
      
      if (events.length > 0) {
        const eventsToInsert = events.map(e => ({
          match_id: selectedMatch.id,
          player_id: e.playerId || e.player_id,
          team_id: e.teamId || e.team_id,
          event_type: e.type || e.event_type,
          quantity: 1
        }));
        const { error: eventError } = await supabase.from('match_events').insert(eventsToInsert);
        if (eventError) throw eventError;
      }

      setMessage('Match saved and completed!');
      setSelectedMatch(null);
      fetchData();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteMatch = async (matchId: string) => {
    if (!matchId) {
      alert("Error: Match ID is missing.");
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await supabase.from('match_events').delete().eq('match_id', matchId);
      const { error } = await supabase.from('matches').delete().eq('id', matchId);
      if (error) throw error;
      
      setMessage('Match deleted successfully!');
      setConfirmDeleteId(null);
      await fetchData();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (selectedMatch) {
    const teamA = teams.find(t => t.id === selectedMatch.team_a_id);
    const teamB = teams.find(t => t.id === selectedMatch.team_b_id);
    const playingRoles = ['Regular', 'Captain', 'Vice Captain', 'Retained'];
    const matchPlayers = players.filter(p => (p.team_id === teamA?.id || p.team_id === teamB?.id) && playingRoles.includes(p.squad_role || 'Regular'));
    const isTied = scoreA === scoreB;

    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit Match: {teamA?.name} vs {teamB?.name}</h2>
          <button onClick={() => setSelectedMatch(null)} className="text-gray-400 hover:text-white">Cancel</button>
        </div>

        {/* Score Inputs */}
        <div className="grid grid-cols-2 gap-8 bg-gray-950 p-6 rounded-lg border border-gray-800">
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-bold text-white">{teamA?.name}</h3>
            <input type="number" min="0" value={scoreA} onChange={e => setScoreA(parseInt(e.target.value) || 0)} className="w-24 text-center bg-gray-900 border border-gray-700 rounded p-2 text-2xl text-white outline-none focus:border-brand-purple" />
            
            {isTied && (
               <div className="pt-4 border-t border-gray-800">
                 <label className="block text-sm text-gray-400 mb-1">Penalty Score</label>
                 <input type="number" min="0" value={penaltiesA} onChange={e => setPenaltiesA(parseInt(e.target.value) || 0)} className="w-24 text-center bg-gray-900 border border-gray-700 rounded p-2 text-xl text-yellow-400 outline-none" />
               </div>
            )}
          </div>
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-bold text-white">{teamB?.name}</h3>
            <input type="number" min="0" value={scoreB} onChange={e => setScoreB(parseInt(e.target.value) || 0)} className="w-24 text-center bg-gray-900 border border-gray-700 rounded p-2 text-2xl text-white outline-none focus:border-brand-purple" />
            
            {isTied && (
               <div className="pt-4 border-t border-gray-800">
                 <label className="block text-sm text-gray-400 mb-1">Penalty Score</label>
                 <input type="number" min="0" value={penaltiesB} onChange={e => setPenaltiesB(parseInt(e.target.value) || 0)} className="w-24 text-center bg-gray-900 border border-gray-700 rounded p-2 text-xl text-yellow-400 outline-none" />
               </div>
            )}
          </div>
        </div>

        {/* MOTM */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-400">Man of the Match</label>
          <select value={motmPlayerId} onChange={e => setMotmPlayerId(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none">
            <option value="">Select a player...</option>
            {matchPlayers.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.team_id === teamA?.id ? teamA?.name : teamB?.name})</option>
            ))}
          </select>
        </div>

        {/* Events Builder */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">Match Events (Goals, Cards)</h3>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-xs text-gray-400">Event Type</label>
              <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white">
                <option value="Goal">Goal</option>
                <option value="Own_Goal">Opponent Own Goal</option>
                <option value="Yellow_Card">Yellow Card</option>
                <option value="Red_Card">Red Card</option>
              </select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs text-gray-400">Team Awarded To</label>
              <select value={newEvent.teamId} onChange={e => setNewEvent({...newEvent, teamId: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white">
                <option value="">Select...</option>
                <option value={teamA?.id}>{teamA?.name}</option>
                <option value={teamB?.id}>{teamB?.name}</option>
              </select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs text-gray-400">Player</label>
              <select value={newEvent.playerId} onChange={e => setNewEvent({...newEvent, playerId: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white">
                <option value="">Select...</option>
                {matchPlayers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button onClick={addEvent} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
              Add Event
            </button>
          </div>

          <div className="space-y-2 mt-4">
            {events.map((e, idx) => {
              const p = players.find(pl => pl.id === (e.playerId || e.player_id));
              const t = teams.find(tm => tm.id === (e.teamId || e.team_id));
              return (
                <div key={idx} className="flex justify-between items-center bg-gray-950 p-3 rounded border border-gray-800">
                  <span className="text-white">
                    <span className="text-brand-purple font-bold mr-2">[{e.type || e.event_type}]</span>
                    {p?.name} <span className="text-gray-500 text-sm">({t?.name})</span>
                  </span>
                  <button onClick={() => removeEvent(idx)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                </div>
              );
            })}
          </div>
        </div>

        <button disabled={loading} onClick={saveMatch} className="w-full bg-brand-purple hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg mt-8 transition-colors">
          {loading ? 'Saving...' : 'Save & Complete Match'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Create Manual Match</h3>
        <form onSubmit={handleAddMatch} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Team A</label>
            <select required value={newMatchTeamA} onChange={e => setNewMatchTeamA(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white">
              <option value="">Select Team...</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name} {t.group_name ? `(Gr ${t.group_name})` : ''}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Team B</label>
            <select required value={newMatchTeamB} onChange={e => setNewMatchTeamB(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white">
              <option value="">Select Team...</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name} {t.group_name ? `(Gr ${t.group_name})` : ''}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Stage</label>
            <select value={newMatchStage} onChange={e => setNewMatchStage(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white">
              <option value="Group">Group Stage</option>
              <option value="Semi-Final">Semi-Final</option>
              <option value="Final">Final</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Match Order (Sorting)</label>
            <input required type="number" min="1" value={newMatchOrder} onChange={e => setNewMatchOrder(parseInt(e.target.value) || 1)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white" />
          </div>
          <div className="flex items-end">
            <button disabled={loading} type="submit" className="w-full bg-brand-purple hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg transition-colors">
              {loading ? 'Adding...' : 'Add Match'}
            </button>
          </div>
        </form>
      </div>

      {matches.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center space-y-4">
          <p className="text-gray-400">No matches found in the system. Create one above.</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Tournament Matches</h3>
          <div className="space-y-3">
            {matches.map(m => {
              const tA = teams.find(t => t.id === m.team_a_id);
              const tB = teams.find(t => t.id === m.team_b_id);
              return (
                <div key={m.id} className="flex items-center justify-between bg-gray-950 p-4 rounded-lg border border-gray-800">
                  <div className="flex-1">
                    <div className="text-xs text-brand-purple font-bold mb-1">{m.stage}</div>
                    <div className="text-white font-medium">{tA?.name} vs {tB?.name}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    {m.status === 'Completed' ? (
                      <div className="text-xl font-black text-white bg-gray-800 px-4 py-1 rounded">
                        {m.team_a_score} - {m.team_b_score}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm font-medium uppercase tracking-wider bg-gray-800/50 px-3 py-1 rounded">Scheduled</span>
                    )}
                    <button onClick={() => openMatchEditor(m)} className="text-brand-purple hover:text-white transition-colors text-sm font-medium">
                      {m.status === 'Completed' ? 'Edit Match' : 'Record Result'}
                    </button>
                    {confirmDeleteId === m.id ? (
                      <div className="flex gap-2 items-center ml-2">
                        <span className="text-xs text-gray-400">Sure?</span>
                        <button onClick={() => deleteMatch(m.id)} className="text-red-500 hover:text-red-400 transition-colors text-sm font-medium">Yes</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(m.id)} className="text-red-500 hover:text-red-400 transition-colors text-sm font-medium ml-2">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}

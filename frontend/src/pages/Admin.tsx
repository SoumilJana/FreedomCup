import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Team = Database['public']['Tables']['teams']['Row'];

export function Admin() {
  const [activeTab, setActiveTab] = useState<'teams' | 'players'>('teams');
  const [teams, setTeams] = useState<Team[]>([]);
  
  // Team Form State
  const [teamName, setTeamName] = useState('');
  const [teamGroup, setTeamGroup] = useState<'A' | 'B'>('A');
  const [teamCoach, setTeamCoach] = useState('');
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  
  // Player Form State
  const [playerTeamId, setPlayerTeamId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerJersey, setPlayerJersey] = useState('');
  const [playerPosition, setPlayerPosition] = useState('Forward');
  const [playerPhoto, setPlayerPhoto] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch teams for the player dropdown
  useEffect(() => {
    async function fetchTeams() {
      const { data } = await supabase.from('teams').select('*').order('name');
      if (data) setTeams(data);
      if (data && data.length > 0 && !playerTeamId) setPlayerTeamId(data[0].id);
    }
    fetchTeams();
  }, []);

  const handleFileUpload = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public-assets')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('public-assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let logo_url = null;
      if (teamLogo) {
        logo_url = await handleFileUpload(teamLogo, 'logos');
      }

      const { error } = await supabase.from('teams').insert({
        name: teamName,
        group_name: teamGroup,
        coach: teamCoach || null,
        logo_url
      });

      if (error) throw error;
      setMessage('Team added successfully!');
      
      // Reset form
      setTeamName('');
      setTeamCoach('');
      setTeamLogo(null);
      
      // Refresh team list
      const { data } = await supabase.from('teams').select('*').order('name');
      if (data) setTeams(data);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!playerTeamId) throw new Error('Please select a team');

      let photo_url = null;
      if (playerPhoto) {
        photo_url = await handleFileUpload(playerPhoto, 'players');
      }

      const { error } = await supabase.from('players').insert({
        team_id: playerTeamId,
        name: playerName,
        jersey_number: parseInt(playerJersey),
        position: playerPosition,
        photo_url
      });

      if (error) throw error;
      setMessage('Player added successfully!');
      
      // Reset form
      setPlayerName('');
      setPlayerJersey('');
      setPlayerPhoto(null);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
        <span className="w-2 h-8 bg-brand-purple rounded-full block"></span>
        Admin Dashboard
      </h1>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'teams' ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          Add New Team
        </button>
        <button 
          onClick={() => setActiveTab('players')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'players' ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          Add New Player
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'}`}>
          {message}
        </div>
      )}

      {activeTab === 'teams' && (
        <form onSubmit={handleAddTeam} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Team Name *</label>
              <input required type="text" value={teamName} onChange={e => setTeamName(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none" placeholder="e.g. Spartans FC" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Group *</label>
              <select value={teamGroup} onChange={e => setTeamGroup(e.target.value as 'A' | 'B')} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none">
                <option value="A">Group A</option>
                <option value="B">Group B</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Coach Name</label>
              <input type="text" value={teamCoach} onChange={e => setTeamCoach(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none" placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Team Logo Image</label>
              <input type="file" accept="image/*" onChange={e => setTeamLogo(e.target.files?.[0] || null)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-800 file:text-gray-300" />
            </div>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-brand-purple hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Add Team'}
          </button>
        </form>
      )}

      {activeTab === 'players' && (
        <form onSubmit={handleAddPlayer} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-400">Assign to Team *</label>
              <select value={playerTeamId} onChange={e => setPlayerTeamId(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none">
                <option value="">Select a team...</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} (Group {t.group_name})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Player Name *</label>
              <input required type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none" placeholder="e.g. Rahul Sharma" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Jersey Number *</label>
              <input required type="number" value={playerJersey} onChange={e => setPlayerJersey(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none" placeholder="e.g. 10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Position *</label>
              <select value={playerPosition} onChange={e => setPlayerPosition(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none">
                <option value="Forward">Forward</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Defender">Defender</option>
                <option value="Goalkeeper">Goalkeeper</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Player Photo Image</label>
              <input type="file" accept="image/*" onChange={e => setPlayerPhoto(e.target.files?.[0] || null)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-800 file:text-gray-300" />
            </div>
          </div>
          <button disabled={loading || !playerTeamId} type="submit" className="w-full bg-brand-purple hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Add Player'}
          </button>
        </form>
      )}
    </div>
  );
}

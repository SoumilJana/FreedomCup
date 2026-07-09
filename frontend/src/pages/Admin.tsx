import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import { AdminMatches } from '../components/admin/AdminMatches';

type Team = Database['public']['Tables']['teams']['Row'];

export function Admin() {
  const [activeTab, setActiveTab] = useState<'players' | 'groups' | 'matches'>('players');
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('adminAuth') === 'true'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Player Form State
  const [playerTeamId, setPlayerTeamId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerJersey, setPlayerJersey] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [playerRole, setPlayerRole] = useState('Regular');
  const [playerPhoto, setPlayerPhoto] = useState<File | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState('new');
  const [confirmDeletePlayer, setConfirmDeletePlayer] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch teams and players for the player dropdown
  useEffect(() => {
    async function fetchData() {
      const { data: teamsData } = await supabase.from('teams').select('*').order('name');
      if (teamsData) setTeams(teamsData);
      if (teamsData && teamsData.length > 0 && !playerTeamId) setPlayerTeamId(teamsData[0].id);

      const { data: playersData } = await supabase.from('players').select('*').order('name');
      if (playersData) setPlayers(playersData);
    }
    fetchData();
  }, []);

  const handlePlayerSelection = (playerId: string) => {
    setSelectedPlayerId(playerId);
    if (playerId === 'new') {
      setPlayerName('');
      setPlayerJersey('');
      setPlayerPosition('');
      setPlayerRole('Regular');
      setPlayerPhoto(null);
    } else {
      const p = players.find(p => p.id === playerId);
      if (p) {
        setPlayerName(p.name);
        setPlayerJersey(p.jersey_number ? p.jersey_number.toString() : '');
        setPlayerPosition(p.position || '');
        setPlayerRole(p.squad_role || 'Regular');
        setPlayerPhoto(null);
      }
    }
  };

  const handleFileUpload = async (file: File, path: string) => {
    let uploadFile = file;
    let fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Attempt compression
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/jpeg'
      };
      uploadFile = await imageCompression(file, options);
      fileExt = 'jpg'; // We force it to be jpeg during compression
    } catch (error) {
      console.warn("Image compression failed, using original file:", error);
    }

    // Include Date.now() to absolutely guarantee cache busting on URL change
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public-assets')
      .upload(filePath, uploadFile, {
        contentType: uploadFile.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('public-assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
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

      const playerData: any = {
        team_id: playerTeamId,
        name: playerName,
        jersey_number: playerJersey ? parseInt(playerJersey) : null,
        position: playerPosition || null,
        squad_role: playerRole
      };
      
      if (photo_url) {
        playerData.photo_url = photo_url;
      }

      if (selectedPlayerId === 'new') {
        const { error } = await supabase.from('players').insert(playerData);
        if (error) throw error;
        setMessage('Player added successfully!');
      } else {
        const { error } = await supabase.from('players').update(playerData).eq('id', selectedPlayerId);
        if (error) throw error;
        setMessage('Player updated successfully!');
      }
      
      // Refresh players list
      const { data: playersData } = await supabase.from('players').select('*').order('name');
      if (playersData) setPlayers(playersData);
      
      handlePlayerSelection('new');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId || selectedPlayerId === 'new') return;
    
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.from('players').delete().eq('id', selectedPlayerId);
      if (error) throw error;
      
      setMessage('Player deleted successfully!');
      setConfirmDeletePlayer(false);
      
      // Refresh players list
      const { data: playersData } = await supabase.from('players').select('*').order('name');
      if (playersData) setPlayers(playersData);
      
      handlePlayerSelection('new');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-brand-purple rounded-full block"></span>
            Admin Login
          </h1>
          {loginError && <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg mb-4 text-sm">{loginError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-400">Username</label>
              <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Password</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none mt-1" />
            </div>
            <button type="submit" className="w-full bg-brand-purple hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
        <span className="w-2 h-8 bg-brand-purple rounded-full block"></span>
        Admin Dashboard
      </h1>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('players')}
          className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'players' ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          Add New Player
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'groups' ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          Assign Groups
        </button>
        <button 
          onClick={() => setActiveTab('matches')}
          className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'matches' ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          Match Management
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'}`}>
          {message}
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Assign Teams to Groups</h2>
          <div className="grid gap-4">
            {teams.map(team => (
              <div key={team.id} className="flex items-center justify-between p-4 bg-gray-950 rounded-lg border border-gray-800">
                <div className="font-medium text-white">{team.name}</div>
                <select 
                  value={team.group_name || ''} 
                  onChange={async (e) => {
                    const newGroup = e.target.value || null;
                    const { data, error } = await supabase.from('teams').update({ group_name: newGroup }).eq('id', team.id).select();
                    if (error) {
                      alert(`Error updating group: ${error.message}`);
                    } else if (!data || data.length === 0) {
                      alert(`Error: The group update failed. Please check your Supabase RLS policies for the 'teams' table to ensure you have an UPDATE policy allowed.`);
                      // Revert local state by triggering a re-render with existing team data
                      setTeams([...teams]);
                    } else {
                      setTeams(teams.map(t => t.id === team.id ? { ...t, group_name: newGroup } : t));
                    }
                  }}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-brand-purple outline-none"
                >
                  <option value="">Unassigned</option>
                  <option value="A">Group A</option>
                  <option value="B">Group B</option>
                </select>
              </div>
            ))}
            {teams.length === 0 && (
              <div className="text-gray-400 text-center py-4">No teams added yet.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'players' && (
        <form onSubmit={handleAddPlayer} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-400">Assign to Team *</label>
              <select value={playerTeamId} onChange={e => { setPlayerTeamId(e.target.value); handlePlayerSelection('new'); }} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none">
                <option value="">Select a team...</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} {t.group_name ? `(Group ${t.group_name})` : '(Unassigned)'}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-400">Player</label>
              <select value={selectedPlayerId} onChange={e => handlePlayerSelection(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none">
                <option value="new">+ Add New Player</option>
                {players.filter(p => p.team_id === playerTeamId).map(p => (
                  <option key={p.id} value={p.id}>Edit: {p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Player Name *</label>
              <input required type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none" placeholder="e.g. Rahul Sharma" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Jersey Number</label>
              <input type="number" value={playerJersey} onChange={e => setPlayerJersey(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none" placeholder="e.g. 10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Position</label>
              <select value={playerPosition} onChange={e => setPlayerPosition(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none">
                <option value="">Unassigned</option>
                <option value="Forward">Forward</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Defender">Defender</option>
                <option value="Goalkeeper">Goalkeeper</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Squad Role *</label>
              <select value={playerRole} onChange={e => setPlayerRole(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-brand-purple outline-none">
                <option value="Regular">Regular Player</option>
                <option value="Captain">Captain</option>
                <option value="Vice Captain">Vice Captain</option>
                <option value="Retained">Retained Player</option>
                <option value="Team Owner">Team Owner</option>
                <option value="Representative">Representative</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Player Photo Image</label>
              <input type="file" accept="image/*" onChange={e => setPlayerPhoto(e.target.files?.[0] || null)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-800 file:text-gray-300" />
            </div>
          </div>
          <div className="flex gap-4">
            <button disabled={loading || !playerTeamId} type="submit" className="flex-1 bg-brand-purple hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : (selectedPlayerId === 'new' ? 'Add Player' : 'Update Player')}
            </button>
            {selectedPlayerId !== 'new' && (
              confirmDeletePlayer ? (
                <div className="flex gap-2">
                  <button disabled={loading} type="button" onClick={handleDeletePlayer} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50">
                    Yes, Delete
                  </button>
                  <button disabled={loading} type="button" onClick={() => setConfirmDeletePlayer(false)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                </div>
              ) : (
                <button disabled={loading} type="button" onClick={() => setConfirmDeletePlayer(true)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50">
                  Delete
                </button>
              )
            )}
          </div>
        </form>
      )}

      {activeTab === 'matches' && <AdminMatches />}
    </div>
  );
}

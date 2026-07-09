import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { TeamProfile } from './pages/TeamProfile';
import { Teams } from './pages/Teams';
import { Fixtures } from './pages/Fixtures';
import { HallOfFame } from './pages/HallOfFame';
import { Trophy, Users, Calendar, Award, Settings } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-gray-50 flex flex-col relative pb-32">
        {/* Top Header Section */}
        <header className="pt-6 px-4 sm:px-8 absolute top-0 w-full z-50 flex justify-between items-start pointer-events-none">
          <div className="w-10"></div> {/* Spacer for alignment */}
          
          {/* Centered Logo */}
          <div className="flex flex-col items-center pointer-events-auto">
            <Link to="/" className="flex flex-col items-center hover:opacity-80 transition-opacity gap-1 relative group">
              <img src="/logo.png" alt="Freedom Cup Logo" className="h-20 sm:h-24 w-auto drop-shadow-[0_0_10px_rgba(250,204,21,0.2)]" />
              <div className="text-[10px] sm:text-xs font-bold text-brand-purple tracking-[0.3em] uppercase">
                5 Years Forged
              </div>
            </Link>
          </div>

          {/* Top Right Admin Icon */}
          <div className="pointer-events-auto mt-2">
            <Link to="/admin" className="text-gray-500 hover:text-white transition-colors block p-2" title="Admin Login">
              <Settings className="w-6 h-6" />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/team/:id" element={<TeamProfile />} />
            <Route path="/hall-of-fame" element={<HallOfFame />} />
          </Routes>
        </main>
        
        {/* Floating Pill Navigation */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          <nav className="flex items-center gap-2 p-2 bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-full shadow-2xl">
            <NavLink 
              to="/" 
              className={({isActive}) => `
                flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300
                ${isActive ? 'bg-yellow-400 text-gray-950 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
              `}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline uppercase tracking-wider text-xs">Home</span>
            </NavLink>

            <NavLink 
              to="/teams" 
              className={({isActive}) => `
                flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300
                ${isActive ? 'bg-yellow-400 text-gray-950 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
              `}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline uppercase tracking-wider text-xs">Teams</span>
            </NavLink>

            <NavLink 
              to="/fixtures" 
              className={({isActive}) => `
                flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300
                ${isActive ? 'bg-yellow-400 text-gray-950 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
              `}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline uppercase tracking-wider text-xs">Fixtures</span>
            </NavLink>

            <NavLink 
              to="/hall-of-fame" 
              className={({isActive}) => `
                flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300
                ${isActive ? 'bg-yellow-400 text-gray-950 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
              `}
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline uppercase tracking-wider text-xs">Hall of Fame</span>
            </NavLink>
          </nav>
        </div>

      </div>
    </Router>
  );
}

export default App;

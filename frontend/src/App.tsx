import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { TeamProfile } from './pages/TeamProfile';
import { Teams } from './pages/Teams';
import { Fixtures } from './pages/Fixtures';
import { HallOfFame } from './pages/HallOfFame';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-gray-50 flex flex-col">
        {/* Navigation */}
        <header className="border-b border-gray-900 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src="/logo.png" alt="Freedom Cup Logo" className="h-10 w-auto" />
                <h1 className="text-2xl font-black italic tracking-tighter text-white hidden sm:block">
                  Freedom <span className="text-brand-purple">Cup</span>
                </h1>
              </Link>
              <nav className="hidden md:flex gap-6">
                <NavLink to="/" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-white hover:text-brand-purple' : 'text-gray-400 hover:text-white'}`}>Home</NavLink>
                <NavLink to="/teams" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-white hover:text-brand-purple' : 'text-gray-400 hover:text-white'}`}>Teams</NavLink>
                <NavLink to="/fixtures" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-white hover:text-brand-purple' : 'text-gray-400 hover:text-white'}`}>Fixtures</NavLink>
                <NavLink to="/hall-of-fame" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-white hover:text-brand-purple' : 'text-gray-400 hover:text-white'}`}>Hall of Fame</NavLink>
              </nav>
            </div>
            <div>
              {/* Admin portal link */}
              <Link to="/admin" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Admin Login</Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/team/:id" element={<TeamProfile />} />
            <Route path="/hall-of-fame" element={<HallOfFame />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-gray-900 py-8 mt-16 text-center text-sm text-gray-600">
          &copy; 2026 Freedom Cup Tournament. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;

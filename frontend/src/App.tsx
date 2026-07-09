import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-gray-50">
        <header className="border-b border-gray-800 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Freedom <span className="text-brand-purple">Cup</span>
          </h1>
        </header>
        <main className="p-4 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<div className="mt-10 text-center">Frontend Scaffolding Complete!</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

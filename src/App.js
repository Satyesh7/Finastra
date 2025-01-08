import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import MutualFundPage from './components/MutualFundPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mutual-funds" element={<MutualFundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
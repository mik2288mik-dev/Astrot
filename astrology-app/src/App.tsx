import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import NatalChart from './components/NatalChart';
import Horoscope from './components/Horoscope';
import Games from './components/Games';
import More from './components/More';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/home" /> : <Login onLogin={() => setIsAuthenticated(true)} />
          } />
          <Route path="/home" element={
            isAuthenticated ? <Home /> : <Navigate to="/login" />
          } />
          <Route path="/profile" element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" />
          } />
          <Route path="/natal-chart" element={
            isAuthenticated ? <NatalChart /> : <Navigate to="/login" />
          } />
          <Route path="/horoscope" element={
            isAuthenticated ? <Horoscope /> : <Navigate to="/login" />
          } />
          <Route path="/games" element={
            isAuthenticated ? <Games /> : <Navigate to="/login" />
          } />
          <Route path="/more" element={
            isAuthenticated ? <More /> : <Navigate to="/login" />
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import { SensorManagement } from './components/SensorManagement'; // Importa desde su archivo

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sensor-management" element={<SensorManagement />} />
      </Routes>
    </Router>
  );
}
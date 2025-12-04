import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import { SensorManagement } from './components/SensorManagement';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sensor-managenemt" element={<SensorManagement />} />
      </Routes>
      <Toaster />
    </Router>
  );
}
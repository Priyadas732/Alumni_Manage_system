import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';    // ← new import
import GatewayLoginRegister from './pages/GatewayLoginRegister';
import RoleSelectionProfileSetup from './pages/RoleSelectionProfileSetup';
import ConnectHub from './pages/ConnectHub';
import CommunicationsHub from './pages/CommunicationsHub';
import ExperienceFeed from './pages/ExperienceFeed';
import MyRequestsTracker from './pages/MyRequestsTracker';
import InteractionModals from './pages/InteractionModals';
import Profile from './pages/Profile';
import Landing from './pages/Landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GatewayLoginRegister />} />
        
        {/* Protected Routes */}
        <Route path="/setup"          element={<ProtectedRoute><RoleSelectionProfileSetup /></ProtectedRoute>} />
        <Route path="/hub"            element={<ProtectedRoute><ConnectHub /></ProtectedRoute>} />
        <Route path="/communications" element={<ProtectedRoute><CommunicationsHub /></ProtectedRoute>} />
        <Route path="/feed"           element={<ProtectedRoute><ExperienceFeed /></ProtectedRoute>} />
        <Route path="/requests"       element={<ProtectedRoute><MyRequestsTracker /></ProtectedRoute>} />
        <Route path="/modals"         element={<ProtectedRoute><InteractionModals /></ProtectedRoute>} />
        <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

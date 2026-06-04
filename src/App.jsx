import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GatewayLoginRegister from './pages/GatewayLoginRegister';
import RoleSelectionProfileSetup from './pages/RoleSelectionProfileSetup';
import ConnectHub from './pages/ConnectHub';
import CommunicationsHub from './pages/CommunicationsHub';
import ExperienceFeed from './pages/ExperienceFeed';
import MyRequestsTracker from './pages/MyRequestsTracker';
import InteractionModals from './pages/InteractionModals';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<GatewayLoginRegister />} />
        <Route path="/setup" element={<RoleSelectionProfileSetup />} />
        <Route path="/hub" element={<ConnectHub />} />
        <Route path="/communications" element={<CommunicationsHub />} />
        <Route path="/feed" element={<ExperienceFeed />} />
        <Route path="/requests" element={<MyRequestsTracker />} />
        <Route path="/modals" element={<InteractionModals />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

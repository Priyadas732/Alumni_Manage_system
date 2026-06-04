import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StudentProfile from '../components/StudentProfile';
import AlumniProfile from '../components/AlumniProfile';

export default function Profile() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role) {
      navigate('/login');
      return;
    }
    setUserRole(role);
    try {
      const data = JSON.parse(localStorage.getItem('userProfile') || '{}');
      setProfileData(data);
    } catch (e) {
      console.error('Failed to parse user profile', e);
    }
  }, [navigate]);

  const handleSave = (updatedProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setProfileData(updatedProfile);
  };

  if (!userRole) {
    return null; // Don't render content while redirecting
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="My Profile" 
          showSearch={false}
        />
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-gutter md:p-margin bg-surface flex justify-center items-start py-margin">
          {userRole === 'student' ? (
            <StudentProfile profile={profileData} onSave={handleSave} />
          ) : (userRole === 'alumni' || userRole === 'alumnus') ? (
            <AlumniProfile profile={profileData} onSave={handleSave} />
          ) : (
            <div className="text-center p-xl">
              <p className="text-error font-body-md">Invalid user role. Please register or log in again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

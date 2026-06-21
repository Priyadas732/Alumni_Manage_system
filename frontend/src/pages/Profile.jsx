import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StudentProfile from '../components/StudentProfile';
import AlumniProfile from '../components/AlumniProfile';
import { userAPI } from '../api';

export default function Profile() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userRole) {
      navigate('/login');
      return;
    }
    
    userAPI.getProfile()
      .then(data => {
        setProfileData(data.user || {});
      })
      .catch(err => {
        console.error('Failed to load profile', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userRole, navigate]);

  const handleSave = async (updatedProfile) => {
    try {
      // Map avatar to avatarUrl for the backend
      if (updatedProfile.avatar) {
        updatedProfile.avatarUrl = updatedProfile.avatar;
      }
      
      const data = await userAPI.updateProfile(updatedProfile);
      setProfileData(data.user);
      
      // Update local storage user just in case name/avatar changed
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...localUser, ...data.user }));
      
      // Notify TopBar to update
      window.dispatchEvent(new Event('profileUpdated'));
      
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
  };

  if (!userRole) {
    return null;
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
          {loading ? (
             <div className="text-center p-xl text-on-surface-variant font-body-lg">Loading profile...</div>
          ) : userRole === 'student' ? (
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

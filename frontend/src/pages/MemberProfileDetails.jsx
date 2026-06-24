import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { userAPI, chatAPI, requestAPI } from '../api';
import UserAvatar from '../components/UserAvatar';

export default function MemberProfileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const data = await userAPI.getUserById(id);
        setMember(data.user);
      } catch (err) {
        setError(err.message || 'Failed to load member profile');
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const handleSendMessage = async () => {
    if (!member) return;
    setActionLoading(true);
    try {
      const data = await chatAPI.startConversation(member.id);
      navigate(`/communications?conversation=${data.conversation?.id || data.id || data.conversationId}`);
    } catch (err) {
      alert('Error starting conversation: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConnect = async (type) => {
    if (!member) return;
    setActionLoading(true);
    try {
      await requestAPI.sendRequest(member.id, type, `Hi ${member.name}, I'd love to connect with you on AlumniConnect!`, '', '');
      alert('Connection request sent successfully!');
    } catch (err) {
      alert('Failed to send request: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
          <TopBar onMenuClick={() => setIsSidebarOpen(true)} title="Member Profile" showSearch={false} />
          <div className="flex-1 flex items-center justify-center bg-surface">
            <p className="text-on-surface-variant font-body-lg">Loading profile details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
          <TopBar onMenuClick={() => setIsSidebarOpen(true)} title="Member Profile" showSearch={false} />
          <div className="flex-1 flex items-center justify-center bg-surface p-xl text-center">
            <div className="space-y-md">
              <p className="text-error font-body-lg">{error || 'Member not found'}</p>
              <button 
                onClick={() => navigate('/hub')}
                className="px-xl py-sm bg-primary text-on-primary font-bold rounded-lg hover:brightness-110 transition-all cursor-pointer shadow-sm text-sm"
              >
                Back to Directory
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback skills based on major/industry
  const getSkills = () => {
    const branch = (member.branch || '').toLowerCase();
    if (branch.includes('computer') || branch.includes('software') || branch.includes('it') || branch.includes('information')) {
      return ['System Design', 'Cloud Computing', 'Kubernetes', 'Python', 'Go', 'Microservices', 'AWS Architect', 'PostgreSQL', 'React'];
    }
    if (branch.includes('financial') || branch.includes('finance') || branch.includes('business')) {
      return ['Financial Analysis', 'Risk Management', 'Capital Markets', 'Investment Strategy', 'Excel VBA', 'Asset Valuation'];
    }
    if (branch.includes('art') || branch.includes('design') || branch.includes('entertainment')) {
      return ['UI/UX Design', 'Visual Branding', 'Figma', 'Illustration', 'Creative Direction', 'Adobe Creative Suite'];
    }
    return ['Leadership', 'Problem Solving', 'Strategic Planning', 'Team Collaboration', 'Public Speaking', 'Analytical Thinking'];
  };

  const isAlumni = member.role === 'ALUMNI';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#edf8fc]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        {/* Search Header */}
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="Directory" 
          showSearch={false} 
        />
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-gutter md:p-margin bg-[#edf8fc] space-y-lg">
          
          {/* 1. Header Banner & Avatar Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden relative">
            {/* Banner Background */}
            <div className="h-40 bg-gradient-to-r from-blue-500 via-[#0a58ca] to-sky-400"></div>

            {/* Profile Info Overlay Row */}
            <div className="px-lg pb-lg pt-24 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
              <UserAvatar user={member} className="absolute -top-16 left-lg w-28 h-28 border-4 border-white shadow-lg" rounded="rounded-2xl" />

              {/* Name and headline */}
              <div className="md:pl-32 pt-2 md:pt-0">
                <h1 className="text-2xl font-extrabold text-[#0f2942] tracking-tight">{member.name}</h1>
                <p className="text-sm text-slate-500 font-bold mt-[2px]">
                  {isAlumni 
                    ? `${member.jobTitle || 'Professional'} at ${member.company || 'Not Specified'}`
                    : `Student / Candidate at ${member.college || 'Not Specified'}`
                  }
                </p>
                <p className="text-xs text-slate-400 font-bold flex items-center gap-[4px] mt-[4px]">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {member.location || 'San Francisco, CA'}
                </p>
              </div>

              {/* Connect Actions */}
              <div className="flex items-center gap-sm shrink-0 w-full md:w-auto mt-sm md:mt-0">
                {!isAlumni && (
                  <button 
                    onClick={() => handleConnect('MENTORSHIP')}
                    disabled={actionLoading}
                    className="flex-1 md:flex-none px-xl py-sm bg-[#0a58ca] hover:bg-[#084ea6] text-white font-bold rounded-lg shadow-sm transition-all text-sm cursor-pointer whitespace-nowrap"
                  >
                    Connect
                  </button>
                )}
                {isAlumni && (
                  <>
                    <button 
                      onClick={() => handleConnect('MENTORSHIP')}
                      disabled={actionLoading || !member.openToMentoring}
                      className={`flex-1 md:flex-none px-xl py-sm font-bold rounded-lg shadow-sm transition-all text-sm whitespace-nowrap ${
                        member.openToMentoring 
                          ? 'bg-white border border-[#0a58ca] text-[#0a58ca] hover:bg-[#0a58ca]/5 cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      Connect
                    </button>
                    <button 
                      onClick={() => handleConnect('REFERRAL')}
                      disabled={actionLoading || !member.openToReferrals}
                      className={`flex-1 md:flex-none px-xl py-sm font-bold rounded-lg shadow-sm transition-all text-sm whitespace-nowrap ${
                        member.openToReferrals 
                          ? 'bg-[#0a58ca] hover:bg-[#084ea6] text-white cursor-pointer'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Request Referral
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 2. Two Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            
            {/* Left Column (Bio, Experience, Education) */}
            <div className="lg:col-span-2 space-y-lg">
              
              {/* About Card */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-lg space-y-md">
                <h2 className="text-lg font-bold text-[#0f2942]">About</h2>
                <p className="text-[#4a5568] text-sm leading-relaxed">
                  {member.bio || `Passionate ${isAlumni ? 'professional' : 'student'} focusing on ${member.branch || 'engineering fields'}. Interested in networking, mentorship opportunities, and discussing industry trends. Stanford graduate, tech enthusiast, and lifelong learner.`}
                </p>
              </div>

              {/* Experience Card */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-lg space-y-md">
                <h2 className="text-lg font-bold text-[#0f2942]">Experience</h2>
                
                <div className="space-y-lg relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {isAlumni && member.jobTitle ? (
                    <div className="flex gap-md items-start relative pl-8">
                      <div className="absolute left-[7px] top-[6px] w-[20px] h-[20px] rounded-full bg-blue-100 border-4 border-white flex items-center justify-center z-10 shrink-0"></div>
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <span className="material-symbols-outlined text-md">business_center</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0f2942]">{member.jobTitle}</h3>
                        <p className="text-xs text-[#0a58ca] font-bold">{member.company || 'Not specified'}</p>
                        {member.gradYear && (
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-[2px]">Since {member.gradYear}</p>
                        )}
                        {member.bio && (
                          <p className="text-slate-500 text-xs mt-xs leading-relaxed">{member.bio}</p>
                        )}
                      </div>
                    </div>
                  ) : !isAlumni && member.college ? (
                    <div className="flex gap-md items-start relative pl-8">
                      <div className="absolute left-[7px] top-[6px] w-[20px] h-[20px] rounded-full bg-blue-100 border-4 border-white flex items-center justify-center z-10 shrink-0"></div>
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <span className="material-symbols-outlined text-md">school</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0f2942]">Student</h3>
                        <p className="text-xs text-[#0a58ca] font-bold">{member.college}</p>
                        {member.branch && (
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-[2px]">{member.branch}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">No experience details available.</p>
                  )}
                </div>
              </div>

              {/* Education Card */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-lg space-y-md">
                <h2 className="text-lg font-bold text-[#0f2942]">Education</h2>
                
                <div className="flex gap-md items-start pl-xs">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <span className="material-symbols-outlined text-xl">school</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0f2942]">{member.college || 'Stanford University'}</h3>
                    <p className="text-xs text-[#0a58ca] font-bold">B.S. {member.branch || 'Computer Science & Engineering'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-[2px]">Class of {member.gradYear || '2018'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Open to Connect, Skills, Mutual Connections) */}
            <div className="col-span-1 space-y-lg">
              
              {/* Availability Panel */}
              <div className="bg-[#004e8c] text-white rounded-xl shadow-sm p-lg space-y-lg">
                <div className="flex items-center gap-xs border-b border-white/10 pb-sm">
                  <span className="material-symbols-outlined text-white text-xl">verified</span>
                  <h2 className="text-sm font-bold uppercase tracking-wider">Open to Connect</h2>
                </div>

                {isAlumni && member.openToMentoring && (
                  <div className="space-y-sm bg-white/10 p-md rounded-lg">
                    <span className="bg-emerald-500 text-white font-bold text-[9px] tracking-wider px-md py-[2px] rounded-full uppercase">
                      Available Mentorship
                    </span>
                    <p className="text-xs text-blue-50 leading-relaxed">
                      {member.name} is currently open to mentoring recent graduates or students interested in {member.branch || 'their industry'}.
                    </p>
                  </div>
                )}

                <button 
                  onClick={handleSendMessage}
                  disabled={actionLoading}
                  className="w-full bg-white hover:bg-slate-50 text-[#004e8c] font-bold py-sm rounded-lg transition-all text-xs cursor-pointer shadow-sm flex items-center justify-center gap-xs"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  Send Message
                </button>
              </div>

              {/* Skills Panel */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-lg space-y-md">
                <h2 className="text-md font-extrabold text-[#0f2942] uppercase tracking-wide border-b border-slate-100 pb-sm">Expertise</h2>
                
                <div className="flex flex-wrap gap-xs">
                  {getSkills().map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-blue-50/50 border border-blue-100 text-[#0a58ca] font-bold text-xs px-md py-xs rounded-lg uppercase tracking-wide"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Info Panel */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-lg space-y-md">
                <h2 className="text-md font-extrabold text-[#0f2942] uppercase tracking-wide border-b border-slate-100 pb-sm">Quick Info</h2>
                
                <div className="space-y-sm text-xs text-slate-600">
                  {member.email && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">mail</span>
                      <span className="font-semibold truncate">{member.email}</span>
                    </div>
                  )}
                  {member.gradYear && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">event</span>
                      <span className="font-semibold">Class of {member.gradYear}</span>
                    </div>
                  )}
                  {member.location && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                      <span className="font-semibold">{member.location}</span>
                    </div>
                  )}
                  {!member.email && !member.gradYear && !member.location && (
                    <p className="text-slate-400">No additional info available.</p>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

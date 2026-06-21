import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { requestAPI } from '../api';

export default function MyRequestsTracker() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dbRequests, setDbRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  
  // Filtering States
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Referrals', 'Mentorship'
  const [statusFilter, setStatusFilter] = useState('All Statuses'); // 'All Statuses', 'Pending', 'Accepted', 'Completed', 'Withdrawn'
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const mockRequests = [
    {
      id: 'mock-1',
      type: 'REFERRAL',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Hi Marcus, I noticed a PM role open at Acme Corp...',
      targetRole: 'Product Manager',
      user: {
        name: 'Marcus Chen',
        jobTitle: 'Senior Product Manager',
        company: 'Acme Corp',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }
    },
    {
      id: 'mock-2',
      type: 'MENTORSHIP',
      status: 'ACCEPTED',
      createdAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Hi Sarah, I would love to connect for mentorship...',
      focusArea: 'Career Transition',
      user: {
        name: 'Dr. Sarah Jenkins',
        jobTitle: 'Director of Data Science',
        company: 'TechNova',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
      }
    },
    {
      id: 'mock-3',
      type: 'REFERRAL',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 67 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Hi Alex, here is my resume for the frontend opening...',
      targetRole: 'Senior Frontend Dev',
      user: {
        name: 'Alex Rivera',
        jobTitle: 'Engineering Lead',
        company: 'GlobalStack',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      }
    },
    {
      id: 'mock-4',
      type: 'MENTORSHIP',
      status: 'WITHDRAWN',
      createdAt: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Hi Leila, I wanted to ask about portfolio reviews...',
      focusArea: 'Portfolio Review',
      user: {
        name: 'Leila Varma',
        jobTitle: 'UX Design Lead',
        company: 'StudioBloom',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
      }
    }
  ];

  useEffect(() => {
    requestAPI.getMyRequests()
      .then(data => {
        setDbRequests(data.requests || []);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const formattedDb = dbRequests.map(req => {
      const user = req.receiver || req.sender || {};
      return {
        ...req,
        user: {
          name: user.name || 'Member',
          jobTitle: user.jobTitle || (user.role === 'STUDENT' ? 'Student' : 'Professional'),
          company: user.company || user.college || 'AlumniConnect',
          avatarUrl: user.avatarUrl || user.avatar
        },
        targetRole: req.type === 'REFERRAL' ? (req.message || 'Software Engineer') : undefined,
        focusArea: req.type === 'MENTORSHIP' ? (req.message || 'General Career Coaching') : undefined
      };
    });
    setRequests([...formattedDb, ...mockRequests]);
  }, [dbRequests]);

  const handleUpdateStatus = async (id, newStatus) => {
    if (id.startsWith('mock-')) {
      setRequests(prev => prev.map(req => {
        if (req.id === id) {
          return { ...req, status: newStatus };
        }
        return req;
      }));
      alert(`Request status updated to ${newStatus.toLowerCase()} successfully!`);
      return;
    }

    try {
      await requestAPI.updateStatus(id, newStatus);
      setDbRequests(prev => prev.map(req => {
        if (req.id === id) {
          return { ...req, status: newStatus };
        }
        return req;
      }));
      alert(`Request status updated successfully!`);
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleArchive = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    alert('Request archived successfully!');
  };

  const filteredRequests = requests.filter(req => {
    // 1. Tab filter (All, Referrals, Mentorship)
    if (activeTab === 'Referrals' && req.type !== 'REFERRAL') return false;
    if (activeTab === 'Mentorship' && req.type !== 'MENTORSHIP') return false;

    // 2. Status dropdown filter
    if (statusFilter !== 'All Statuses') {
      const currentStatus = req.status.toLowerCase();
      const filter = statusFilter.toLowerCase();
      
      if (filter === 'withdrawn') {
        return currentStatus === 'withdrawn' || currentStatus === 'rejected';
      }
      return currentStatus === filter;
    }

    return true;
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#edf8fc]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="AlumniConnect" 
          showSearch={false}
        />
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-gutter md:p-margin bg-[#edf8fc] pb-10">
          <div className="max-w-6xl mx-auto space-y-lg">
            
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-extrabold text-[#0f2942] tracking-tight mb-[4px]">My Requests</h1>
              <p className="text-[#4a5568] text-sm font-semibold">Track and manage your referral and mentorship requests.</p>
            </div>
            
            {/* Filters & Controls Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md pt-2">
              {/* Type Pill Tabs */}
              <div className="bg-slate-200/50 p-1 rounded-xl flex gap-1 border border-slate-200/20">
                {['All', 'Referrals', 'Mentorship'].map(tab => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-slate-800 font-extrabold shadow-sm border border-slate-200/50'
                          : 'text-slate-500 hover:text-slate-800 font-semibold'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
              
              {/* Custom Statuses Dropdown */}
              <div className="relative self-stretch sm:self-auto">
                <button 
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full sm:w-auto flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer shadow-sm justify-between min-w-[140px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">filter_list</span>
                    {statusFilter}
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-slate-500">expand_more</span>
                </button>
                {isStatusDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 min-w-[160px] animate-fade-in">
                    {['All Statuses', 'Pending', 'Accepted', 'Completed', 'Withdrawn'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setIsStatusDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg pt-2">
              {filteredRequests.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2 block">inbox</span>
                  <p className="text-slate-500 font-semibold">You don't have any requests matching these filters.</p>
                </div>
              )}

              {filteredRequests.map(req => {
                const isMentorship = req.type === 'MENTORSHIP';
                const status = req.status.toLowerCase();
                
                // Color configuration based on status
                let statusBadgeStyle = 'bg-slate-50 text-slate-600 border border-slate-200/50';
                let statusText = req.status.charAt(0) + req.status.slice(1).toLowerCase();
                let showDot = true;

                if (status === 'pending') {
                  statusBadgeStyle = 'bg-orange-50 text-orange-600 border border-orange-100/50';
                } else if (status === 'accepted') {
                  statusBadgeStyle = 'bg-emerald-50 text-emerald-600 border border-emerald-100/50';
                } else if (status === 'completed') {
                  statusBadgeStyle = 'bg-slate-100 text-slate-600 border border-slate-200/50';
                  showDot = false;
                } else if (status === 'withdrawn' || status === 'rejected') {
                  statusBadgeStyle = 'bg-red-50 text-red-600 border border-red-100/50';
                  statusText = 'Withdrawn';
                }

                return (
                  <div key={req.id} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:shadow-md transition-all flex flex-col gap-5 relative overflow-hidden group">
                    {/* Header line with badges */}
                    <div className="flex justify-between items-center w-full z-10">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 border ${
                        isMentorship 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                          : 'bg-blue-50 text-blue-600 border-blue-100/50'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {isMentorship ? 'school' : 'work'}
                        </span>
                        {isMentorship ? 'Mentorship' : 'Referral Request'}
                      </span>
                      
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 ${statusBadgeStyle}`}>
                        {showDot && (
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            status === 'pending' ? 'bg-orange-500' : status === 'accepted' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}></span>
                        )}
                        {statusText}
                      </span>
                    </div>
                    
                    {/* User profile row */}
                    <div className="flex gap-4 items-center z-10">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-50 flex items-center justify-center font-bold text-slate-600 shadow-sm">
                        {req.user?.avatarUrl ? (
                          <img alt={req.user.name} className="w-full h-full object-cover" src={req.user.avatarUrl}/>
                        ) : (
                          req.user?.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-[#0f2942] truncate">{req.user?.name || 'Unknown'}</h3>
                        <p className="text-slate-500 text-xs font-semibold truncate mt-0.5">{req.user?.jobTitle || 'Member'}</p>
                        <p className="flex items-center gap-1 text-[#3b82f6] text-xs font-bold mt-1">
                          <span className="material-symbols-outlined text-[14px]">folder</span>
                          {req.user?.company}
                        </p>
                      </div>
                    </div>
                    
                    {/* Inner Target Specs Box */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex justify-between items-center gap-4 z-10">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {isMentorship ? 'Focus Area' : 'Target Role'}
                        </span>
                        <span className="text-xs font-extrabold text-slate-700 truncate max-w-[200px]">
                          {isMentorship ? (req.focusArea || 'Career Coaching') : (req.targetRole || 'Software Engineer')}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted</span>
                        <span className="text-xs font-bold text-slate-500">
                          {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions row */}
                    <div className="mt-auto flex gap-3 z-10 pt-1">
                      {status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(req.id, 'WITHDRAWN')}
                            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm text-center"
                          >
                            Withdraw
                          </button>
                          <button 
                            onClick={() => alert('Opening details details modal...')}
                            className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm text-center"
                          >
                            View Details
                          </button>
                        </>
                      )}
                      {status === 'accepted' && (
                        <>
                          <button 
                            onClick={() => navigate('/communications')}
                            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm text-center"
                          >
                            Message
                          </button>
                          <button 
                            onClick={() => alert('Opening details details modal...')}
                            className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm text-center"
                          >
                            View Details
                          </button>
                        </>
                      )}
                      {status === 'completed' && (
                        <>
                          <button 
                            onClick={() => handleArchive(req.id)}
                            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm text-center"
                          >
                            Archive
                          </button>
                          <button 
                            onClick={() => alert('Opening summary view...')}
                            className="flex-1 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm text-center"
                          >
                            View Summary
                          </button>
                        </>
                      )}
                      {(status === 'withdrawn' || status === 'rejected') && (
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'PENDING')}
                          className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm text-center"
                        >
                          Re-submit Request
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Load More Pagination */}
            <div className="flex justify-center mt-10 pt-4">
              <button 
                onClick={() => alert("Loading more requests...")}
                className="flex items-center gap-1.5 bg-white px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm cursor-pointer shadow-sm"
              >
                Load More
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

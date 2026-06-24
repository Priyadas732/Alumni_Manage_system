import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { requestAPI } from '../api';
import UserAvatar from '../components/UserAvatar';

export default function MyRequestsTracker() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dbRequests, setDbRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering States
  const [activeTab, setActiveTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  useEffect(() => {
    requestAPI.getMyRequests()
      .then(data => {
        const combined = [
          ...(data.sent || []).map(r => ({ ...r, isSent: true })),
          ...(data.received || []).map(r => ({ ...r, isSent: false }))
        ];
        combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDbRequests(combined);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const formatted = dbRequests.map(req => {
      const user = req.isSent ? (req.receiver || {}) : (req.sender || {});
      return {
        ...req,
        user: {
          name: user.name || 'Member',
          jobTitle: user.jobTitle || (user.role === 'ALUMNI' ? 'Alumni' : user.branch || 'Student'),
          company: user.company || user.college || 'AlumniConnect',
          avatarUrl: user.avatarUrl || user.avatar
        },
        targetRole: req.type === 'REFERRAL' ? (req.jobLink || req.message || 'Not specified') : undefined,
        focusArea: req.type === 'MENTORSHIP' ? (req.message || 'General Career Coaching') : undefined
      };
    });
    setRequests(formatted);
  }, [dbRequests]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await requestAPI.updateStatus(id, newStatus);
      setDbRequests(prev => prev.map(req =>
        req.id === id ? { ...req, status: newStatus } : req
      ));
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleArchive = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'Referrals' && req.type !== 'REFERRAL') return false;
    if (activeTab === 'Mentorship' && req.type !== 'MENTORSHIP') return false;
    if (statusFilter !== 'All Statuses') {
      const s = req.status.toLowerCase();
      const f = statusFilter.toLowerCase();
      if (f === 'withdrawn') return s === 'withdrawn' || s === 'rejected';
      return s === f;
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
        <div className="flex-1 overflow-y-auto p-gutter md:p-margin bg-[#edf8fc] pb-10">
          <div className="max-w-6xl mx-auto space-y-lg">

            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-extrabold text-[#0f2942] tracking-tight mb-[4px]">My Requests</h1>
              <p className="text-[#4a5568] text-sm font-semibold">Track and manage your referral and mentorship requests.</p>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md pt-2">
              <div className="bg-slate-200/50 p-1 rounded-xl flex gap-1 border border-slate-200/20">
                {['All', 'Referrals', 'Mentorship'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white text-slate-800 font-extrabold shadow-sm border border-slate-200/50'
                        : 'text-slate-500 hover:text-slate-800 font-semibold'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

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
                  <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 min-w-[160px]">
                    {['All Statuses', 'Pending', 'Accepted', 'Completed', 'Withdrawn'].map(s => (
                      <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setIsStatusDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg pt-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 flex flex-col gap-5 animate-pulse">
                    <div className="flex justify-between">
                      <div className="h-6 w-28 bg-slate-200 rounded-full" />
                      <div className="h-6 w-20 bg-slate-200 rounded-full" />
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="bg-slate-100 rounded-xl h-14" />
                    <div className="flex gap-3">
                      <div className="flex-1 h-9 bg-slate-100 rounded-xl" />
                      <div className="flex-1 h-9 bg-slate-200 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Requests Grid */}
            {!loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg pt-2">
                {filteredRequests.length === 0 && (
                  <div className="col-span-full text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <span className="material-symbols-outlined text-[56px] text-slate-300 mb-3 block">inbox</span>
                    <h3 className="text-slate-700 font-bold text-base mb-1">No requests yet</h3>
                    <p className="text-slate-500 font-semibold text-sm">
                      {activeTab === 'All' && statusFilter === 'All Statuses'
                        ? "You haven't sent or received any requests. Visit the directory to connect!"
                        : "No requests match the selected filters."}
                    </p>
                    {activeTab === 'All' && statusFilter === 'All Statuses' && (
                      <button
                        onClick={() => navigate('/hub')}
                        className="mt-4 bg-[#3b82f6] text-white font-bold px-6 py-2 rounded-xl text-xs hover:bg-[#2563eb] transition-all cursor-pointer"
                      >
                        Browse Directory
                      </button>
                    )}
                  </div>
                )}

                {filteredRequests.map(req => {
                  const isMentorship = req.type === 'MENTORSHIP';
                  const status = req.status.toLowerCase();

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
                    statusText = status === 'rejected' ? 'Rejected' : 'Withdrawn';
                  }

                  return (
                    <div key={req.id} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:shadow-md transition-all flex flex-col gap-5">
                      {/* Header */}
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 border ${
                            isMentorship
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50'
                              : 'bg-blue-50 text-blue-600 border-blue-100/50'
                          }`}>
                            <span className="material-symbols-outlined text-[14px]">
                              {isMentorship ? 'school' : 'work'}
                            </span>
                            {isMentorship ? 'Mentorship' : 'Referral'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            req.isSent
                              ? 'bg-slate-50 text-slate-500 border-slate-200'
                              : 'bg-violet-50 text-violet-600 border-violet-100'
                          }`}>
                            {req.isSent ? '↑ Sent' : '↓ Received'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 ${statusBadgeStyle}`}>
                          {showDot && (
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status === 'pending' ? 'bg-orange-500' : status === 'accepted' ? 'bg-emerald-500' : 'bg-red-500'
                            }`} />
                          )}
                          {statusText}
                        </span>
                      </div>

                      {/* User Info */}
                      <div className="flex gap-4 items-center">
                          <UserAvatar user={req.user} className="w-14 h-14" rounded="rounded-2xl" />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-bold text-[#0f2942] truncate">{req.user?.name || 'Unknown'}</h3>
                          <p className="text-slate-500 text-xs font-semibold truncate mt-0.5">{req.user?.jobTitle || 'Member'}</p>
                          <p className="flex items-center gap-1 text-[#3b82f6] text-xs font-bold mt-1">
                            <span className="material-symbols-outlined text-[14px]">business_center</span>
                            {req.user?.company}
                          </p>
                        </div>
                      </div>

                      {/* Details Box */}
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex justify-between items-center gap-4">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {isMentorship ? 'Message' : 'Target Role / Job'}
                          </span>
                          <span className="text-xs font-extrabold text-slate-700 truncate max-w-[220px]">
                            {isMentorship ? (req.focusArea || 'Career Coaching') : (req.targetRole || 'Not specified')}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5 items-end shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted</span>
                          <span className="text-xs font-bold text-slate-500">
                            {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex gap-3 pt-1">
                        {/* Received + Pending → Accept / Reject */}
                        {!req.isSent && status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                              className="flex-1 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                            >
                              Accept
                            </button>
                          </>
                        )}

                        {/* Sent + Pending → Withdraw / View Profile */}
                        {req.isSent && status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'WITHDRAWN')}
                              className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                            >
                              Withdraw
                            </button>
                            <button
                              onClick={() => navigate(`/directory/${req.receiverId}`)}
                              className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                            >
                              View Profile
                            </button>
                          </>
                        )}

                        {/* Accepted → Message / Mark Complete */}
                        {status === 'accepted' && (
                          <>
                            <button
                              onClick={() => navigate('/communications')}
                              className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                            >
                              Message
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'COMPLETED')}
                              className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                            >
                              Mark Complete
                            </button>
                          </>
                        )}

                        {/* Completed → Archive */}
                        {status === 'completed' && (
                          <>
                            <button
                              onClick={() => handleArchive(req.id)}
                              className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                            >
                              Archive
                            </button>
                            <button
                              onClick={() => navigate('/hub')}
                              className="flex-1 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                            >
                              Directory
                            </button>
                          </>
                        )}

                        {/* Withdrawn / Rejected */}
                        {(status === 'withdrawn' || status === 'rejected') && (
                          <button
                            onClick={() => navigate(req.isSent ? '/hub' : `/directory/${req.senderId}`)}
                            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                          >
                            {req.isSent ? 'Browse Directory' : 'View Sender Profile'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

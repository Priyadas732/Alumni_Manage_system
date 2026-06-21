import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { requestAPI, chatAPI } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Alex');
  const [pendingCount, setPendingCount] = useState(8);

  useEffect(() => {
    // Get current user name
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.name) {
      setUserName(currentUser.name.split(' ')[0]);
    }

    // Fetch real pending requests count
    requestAPI.getMyRequests()
      .then(data => {
        const pending = (data.requests || []).filter(r => r.status === 'PENDING').length;
        if (pending > 0) {
          setPendingCount(pending);
        }
      })
      .catch(err => console.error(err));
  }, []);

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
          <div className="max-w-7xl mx-auto space-y-lg">
            
            {/* Welcome Header */}
            <div>
              <h1 className="text-3xl font-extrabold text-[#0f2942] tracking-tight mb-[4px]">
                Welcome back, {userName}!
              </h1>
              <p className="text-slate-500 text-sm font-semibold">
                You have {pendingCount} mentorship requests and 2 upcoming networking mixers this week.
              </p>
            </div>
            
            {/* Row of 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
              {/* Card 1: Total Connections */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/50 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">+12%</span>
                </div>
                <div className="mt-4">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Connections</span>
                  <span className="text-2xl font-black text-[#0f2942] block mt-1">142</span>
                </div>
              </div>

              {/* Card 2: Pending Requests */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/50 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#005cb8] flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
                  </div>
                  <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-md border border-red-100/50">3 New</span>
                </div>
                <div className="mt-4">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Pending Requests</span>
                  <span className="text-2xl font-black text-[#0f2942] block mt-1">
                    {pendingCount < 10 ? `0${pendingCount}` : pendingCount}
                  </span>
                </div>
              </div>

              {/* Card 3: Upcoming Events */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/50 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Upcoming Events</span>
                  <span className="text-2xl font-black text-[#0f2942] block mt-1">05</span>
                </div>
              </div>

              {/* Card 4: Profile Views */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/50 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">+24%</span>
                </div>
                <div className="mt-4">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Profile Views</span>
                  <span className="text-2xl font-black text-[#0f2942] block mt-1">2.4k</span>
                </div>
              </div>
            </div>

            {/* Middle Section (2 Columns Grid: 2/3 wider left, 1/3 narrower right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
              
              {/* Left Side Panels */}
              <div className="lg:col-span-2 space-y-lg">
                
                {/* Panel 1: Mentorship Overview (Solid blue container) */}
                <div className="bg-gradient-to-r from-[#005cb8] to-[#3b82f6] text-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-12 -mt-12 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex justify-between items-center z-10">
                    <h2 className="text-lg font-extrabold tracking-tight">Mentorship Overview</h2>
                    <button 
                      onClick={() => navigate('/requests')}
                      className="bg-white/20 hover:bg-white/30 text-white font-bold py-1.5 px-4 rounded-xl text-xs transition-all border border-white/25 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 z-10">
                    {/* User Item 1 */}
                    <div className="bg-white/10 border border-white/10 p-4 rounded-xl flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20">
                        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Sarah" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black truncate">Sarah Chen</h4>
                        <p className="text-[10px] text-blue-100 truncate mt-0.5">Mentor • Sr. Eng @ Google</p>
                        <p className="text-[9px] text-emerald-400 font-extrabold flex items-center gap-1 mt-1 leading-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Session Scheduled: Tomorrow
                        </p>
                      </div>
                    </div>
                    {/* User Item 2 */}
                    <div className="bg-white/10 border border-white/10 p-4 rounded-xl flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20">
                        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Marcus" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black truncate">Marcus Reed</h4>
                        <p className="text-[10px] text-blue-100 truncate mt-0.5">Mentee • CS Junior</p>
                        <p className="text-[9px] text-blue-200 font-bold mt-1.5 leading-none">
                          Next Milestone: Portfolio Review
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel 2: Recent Activity Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h2 className="text-base font-extrabold text-[#0f2942]">Recent Activity</h2>
                    <button 
                      onClick={() => alert("All activity marked as read!")}
                      className="text-[#3b82f6] hover:underline text-xs font-extrabold cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Activity Item 1 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                          <strong className="text-slate-800 font-bold">Jordan Smith</strong> requested a referral for the <strong className="text-slate-800 font-bold">Product Design</strong> role at Meta.
                        </p>
                        <span className="text-slate-400 text-[10px] font-bold uppercase mt-1 block">2 hours ago</span>
                      </div>
                    </div>

                    {/* Activity Item 2 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 shadow-inner">
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                      </div>
                      <div className="min-w-0 flex-1 flex justify-between items-start gap-2">
                        <div>
                          <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                            <strong className="text-slate-800 font-bold">Dr. Eleanor Rigby</strong> sent you a direct message regarding the upcoming Tech Summit.
                          </p>
                          <span className="text-slate-400 text-[10px] font-bold uppercase mt-1 block">5 hours ago</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-[#3b82f6] shrink-0 mt-1.5 select-none" title="Unread"></span>
                      </div>
                    </div>

                    {/* Activity Item 3 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-inner">
                        <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                          You've reached <strong className="text-slate-800 font-bold">50 endorsed skills</strong>! Check out who endorsed you lately.
                        </p>
                        <span className="text-slate-400 text-[10px] font-bold uppercase mt-1 block">Yesterday</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Panels */}
              <div className="lg:col-span-1 space-y-lg">
                
                {/* Panel 1: Upcoming Events timeline */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm flex flex-col gap-4">
                  <h3 className="text-xs font-black text-[#0f2942] uppercase tracking-wider">Upcoming Events</h3>

                  <div className="flex flex-col relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-100 gap-5 pl-1">
                    {/* Event item 1 */}
                    <div className="flex gap-4 items-start relative">
                      <div className="absolute left-[8px] top-[6px] w-[8px] h-[8px] rounded-full bg-[#005cb8] border-2 border-white ring-2 ring-[#005cb8]/25 z-10 shrink-0"></div>
                      <div className="pl-6 min-w-0">
                        <span className="text-[10px] font-black text-[#3b82f6] uppercase tracking-wider block">July 15, 6:00 PM</span>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug mt-0.5">AI & Ethics Alumni Mixer</h4>
                        <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-[2px] mt-1 leading-none">
                          <span className="material-symbols-outlined text-[12px]">location_on</span>
                          Virtual • Zoom
                        </p>
                      </div>
                    </div>
                    {/* Event item 2 */}
                    <div className="flex gap-4 items-start relative">
                      <div className="absolute left-[8px] top-[6px] w-[8px] h-[8px] rounded-full bg-slate-300 border-2 border-white z-10 shrink-0"></div>
                      <div className="pl-6 min-w-0">
                        <span className="text-[10px] font-black text-[#3b82f6] uppercase tracking-wider block">July 22, 10:00 AM</span>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug mt-0.5">Career Fair: Tech 2024</h4>
                        <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-[2px] mt-1 leading-none">
                          <span className="material-symbols-outlined text-[12px]">location_on</span>
                          Grand Hall, Building B
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert("Browsing all events...")}
                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-[#3b82f6] font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer mt-1 text-center"
                  >
                    Browse All Events
                  </button>
                </div>

                {/* Panel 2: Recommended for You */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm flex flex-col gap-4">
                  <h3 className="text-xs font-black text-[#0f2942] uppercase tracking-wider">Recommended for You</h3>

                  <div className="flex flex-col gap-4">
                    {/* Rec item 1 */}
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Anish" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">Anish Kapoor</h4>
                          <p className="text-[9px] text-slate-400 font-semibold truncate leading-none mt-0.5">Shared Interest: Machine Learning</p>
                          <p className="text-[8px] text-[#3b82f6] font-black uppercase mt-1 leading-none">8 Mutual Connections</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert("Connection request sent to Anish Kapoor!")}
                        className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] hover:border-[#3b82f6]/30 flex items-center justify-center text-slate-500 transition-colors shrink-0 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                      </button>
                    </div>
                    {/* Rec item 2 */}
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Yuna" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">Yuna Kim</h4>
                          <p className="text-[9px] text-slate-400 font-semibold truncate leading-none mt-0.5">Class of '18 • UX Lead @ Airbnb</p>
                          <p className="text-[8px] text-emerald-600 font-black uppercase mt-1 leading-none">Alumni Mentor</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert("Connection request sent to Yuna Kim!")}
                        className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] hover:border-[#3b82f6]/30 flex items-center justify-center text-slate-500 transition-colors shrink-0 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert("Opening more suggestions...")}
                    className="w-full bg-[#f1f5f9] hover:bg-slate-200 text-[#475569] font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer mt-1 text-center"
                  >
                    See More Suggestions
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

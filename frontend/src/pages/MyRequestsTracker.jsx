import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { requestAPI } from '../api';

export default function MyRequestsTracker() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    requestAPI.getMyRequests().then(data => setRequests(data.requests || []));
  }, []);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="LegacyBridge" 
          showSearch={false}
        />
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-margin bg-surface pb-gutter">
          <div className="max-w-6xl mx-auto space-y-xl">
            {/* Page Header */}
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">My Requests</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Track and manage your referral and mentorship requests.</p>
            </div>
            
            {/* Filters & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
              {/* Type Filters */}
              <div className="flex flex-wrap gap-xs bg-surface-container-low p-xs rounded-lg border border-outline-variant/30">
                <button className="px-md py-xs rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md transition-colors border border-transparent shadow-sm cursor-pointer">All</button>
                <button className="px-md py-xs rounded-full text-on-surface-variant hover:bg-surface-container-high font-label-md text-label-md transition-colors border border-transparent cursor-pointer">Referrals</button>
                <button className="px-md py-xs rounded-full text-on-surface-variant hover:bg-surface-container-high font-label-md text-label-md transition-colors border border-transparent cursor-pointer">Mentorship</button>
              </div>
              
              {/* Status Filters */}
              <div className="flex gap-md items-center">
                <span className="font-label-md text-label-md text-on-surface-variant">Status:</span>
                <select className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-lg text-body-lg rounded-lg px-md py-xs focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer">
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            {/* Requests Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              
              {requests.length === 0 && (
                <div className="col-span-full text-center py-xl bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-md block">inbox</span>
                  <p className="font-body-lg text-on-surface-variant">You don't have any requests yet.</p>
                </div>
              )}

              {requests.map(req => {
                const isMentorship = req.type === 'MENTORSHIP';
                const isPending = req.status === 'PENDING';
                const isAccepted = req.status === 'ACCEPTED';
                const user = req.receiver || req.sender; // Depending on if they sent or received it (assuming backend populates this)

                return (
                  <div key={req.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-lg hover:border-primary/30 hover:shadow-lg transition-all flex flex-col relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none ${isMentorship ? 'bg-secondary/5' : 'bg-primary/5'}`}></div>
                    
                    <div className="flex justify-between items-start mb-md z-10">
                      <div className="flex items-center gap-sm bg-surface-container-low py-xs px-sm rounded-full border border-outline-variant/30">
                        <span className={`material-symbols-outlined text-[16px] ${isMentorship ? 'text-secondary' : 'text-primary'}`} data-icon={isMentorship ? 'school' : 'work'}>
                          {isMentorship ? 'school' : 'work'}
                        </span>
                        <span className="font-label-md text-label-md text-on-surface">
                          {isMentorship ? 'Mentorship' : 'Referral Request'}
                        </span>
                      </div>
                      <div className="flex items-center gap-xs">
                        <span className={`w-2 h-2 rounded-full ${isPending ? 'bg-tertiary-container animate-pulse' : isAccepted ? 'bg-secondary' : 'bg-outline'}`}></span>
                        <span className={`font-label-md text-label-md ${isPending ? 'text-tertiary' : isAccepted ? 'text-secondary' : 'text-on-surface-variant'}`}>
                          {req.status.charAt(0) + req.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-md mb-md z-10">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/30 bg-surface-variant flex items-center justify-center font-bold">
                        {user?.avatarUrl ? (
                          <img alt={user.name} className="w-full h-full object-cover" src={user.avatarUrl}/>
                        ) : (
                          user?.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[18px] leading-snug font-bold text-on-surface">{user?.name || 'Unknown'}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">{user?.jobTitle || 'Member'}</p>
                        <p className="font-label-md text-label-md text-primary mt-xs font-semibold">{user?.company || user?.college}</p>
                      </div>
                    </div>
                    
                    <div className="bg-surface-container-low rounded-lg p-md mb-md z-10 border border-outline-variant/10">
                      <div className="grid grid-cols-2 gap-sm">
                        <div>
                          <div className="font-label-md text-label-md text-on-surface-variant mb-[2px]">Message</div>
                          <div className="font-body-md text-body-md text-on-surface font-medium truncate">{req.message || 'No message'}</div>
                        </div>
                        <div>
                          <div className="font-label-md text-label-md text-on-surface-variant mb-[2px]">Submitted</div>
                          <div className="font-body-md text-body-md text-on-surface">{new Date(req.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex gap-md z-10">
                      {isPending && (
                        <button 
                          onClick={() => requestAPI.updateStatus(req.id, 'REJECTED').then(() => window.location.reload())}
                          className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md py-sm rounded-lg border border-outline-variant/50 transition-colors cursor-pointer"
                        >
                          Withdraw/Reject
                        </button>
                      )}
                      {isPending && (
                        <button 
                          onClick={() => requestAPI.updateStatus(req.id, 'ACCEPTED').then(() => window.location.reload())}
                          className="flex-1 bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] font-label-md text-label-md py-sm rounded-lg transition-colors shadow-sm cursor-pointer"
                        >
                          Accept
                        </button>
                      )}
                      {isAccepted && (
                        <button className="flex-1 bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] font-label-md text-label-md py-sm rounded-lg transition-colors shadow-sm cursor-pointer">
                          Message
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination / Load More (Subtle) */}
            <div className="flex justify-center pt-md border-t border-outline-variant/20">
              <button className="text-primary hover:text-on-primary-fixed-variant font-label-md text-label-md flex items-center gap-xs transition-colors font-semibold cursor-pointer">
                Load More <span className="material-symbols-outlined text-[16px]" data-icon="expand_more">expand_more</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

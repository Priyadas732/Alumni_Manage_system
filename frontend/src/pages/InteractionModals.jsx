import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const connectionsList = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Senior Product Designer',
    company: 'TechFlow Industries',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    openToReferrals: true,
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Senior Product Manager',
    company: 'Acme Corp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    openToReferrals: true,
  },
  {
    id: 3,
    name: 'David Chen',
    role: 'Director of Engineering',
    company: 'Stark Financial Group',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    openToReferrals: false,
  },
  {
    id: 4,
    name: 'Alicia Martinez',
    role: 'Data Scientist',
    company: 'QuantHealth Analytics',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    openToReferrals: true,
  }
];

export default function InteractionModals() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'connect', 'referral', or null
  const [selectedConnection, setSelectedConnection] = useState(null);

  // Form states
  const [connectMessage, setConnectMessage] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [fitMessage, setFitMessage] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openModal = (type, conn) => {
    setSelectedConnection(conn);
    setActiveModal(type);
    
    // Reset form states
    setConnectMessage('');
    setJobLink('');
    setFitMessage('');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedConnection(null);
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    alert(`Connection request sent to ${selectedConnection.name}!`);
    closeModal();
  };

  const handleSendReferral = (e) => {
    e.preventDefault();
    alert(`Referral request for ${selectedConnection.name} submitted successfully!`);
    closeModal();
  };

  const filteredConnections = connectionsList.filter(conn => 
    conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="LegacyBridge" 
          showSearch={false}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-margin relative bg-surface">
          <div className="max-w-5xl mx-auto space-y-xl">
            {/* Header */}
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Interaction Hub</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Search your network connections to send connection or formal referral requests.</p>
            </div>
            
            {/* Search Input */}
            <div className="relative flex items-center bg-surface-container-lowest rounded-lg px-md py-sm border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all w-full max-w-2xl">
              <span className="material-symbols-outlined text-on-surface-variant mr-sm">search</span>
              <input 
                type="text" 
                placeholder="Search connections by name, role, or company..." 
                className="flex-1 min-w-0 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 text-body-md font-body-md outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Connections Grid */}
            {filteredConnections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {filteredConnections.map(conn => (
                  <div key={conn.id} className="bg-surface-container-lowest rounded-xl p-margin flex flex-col gap-md border border-outline-variant/30 hover:shadow-md transition-all group relative">
                    <div className="flex gap-md items-center">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/30">
                        <img alt={conn.name} className="w-full h-full object-cover" src={conn.avatar}/>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[18px] leading-snug font-bold text-on-surface group-hover:text-primary transition-colors">{conn.name}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">{conn.role}</p>
                        <p className="font-label-md text-label-md text-primary mt-xs font-semibold">{conn.company}</p>
                      </div>
                    </div>
                    
                    <div className="mt-xs flex gap-sm border-t border-outline-variant/20 pt-md">
                      <button 
                        onClick={() => navigate('/communications')}
                        className="flex-1 border border-outline text-on-surface rounded-lg py-sm font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-center gap-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        Message
                      </button>
                      <button 
                        onClick={() => openModal('referral', conn)}
                        className={`flex-1 rounded-lg py-sm font-label-md text-label-md transition-all font-medium cursor-pointer flex items-center justify-center gap-xs ${
                          conn.openToReferrals 
                            ? 'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-sm'
                            : 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed border border-outline-variant/20'
                        }`}
                        disabled={!conn.openToReferrals}
                      >
                        Request Referral
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-xl bg-surface-container-lowest border border-outline-variant/30 rounded-xl max-w-xl">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-sm">search_off</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">No Connections Found</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Try adjusting your keywords to find someone in your network.</p>
              </div>
            )}
          </div>
          
          {/* Modal Overlay A: Simple Connect */}
          {activeModal === 'connect' && selectedConnection && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-background/60 backdrop-blur-sm overflow-y-auto">
              <form 
                onSubmit={handleSendRequest}
                className="bg-surface-container-lowest rounded-xl shadow-xl flex flex-col border border-outline-variant/30 overflow-hidden w-full max-w-md animate-fade-in"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-lg border-b border-surface-container">
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Connect</h2>
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined" data-icon="close">close</span>
                  </button>
                </div>
                {/* Body */}
                <div className="p-lg space-y-lg">
                  <div className="flex items-center gap-md">
                    <img alt={selectedConnection.name} className="w-12 h-12 rounded-full object-cover border-2 border-surface-variant" src={selectedConnection.avatar}/>
                    <div>
                      <p className="font-body-lg text-body-lg text-on-surface font-medium">Send connection request to {selectedConnection.name}</p>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-xs">{selectedConnection.role} at {selectedConnection.company}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-sm" htmlFor="connect-message">Add a personal message (Optional)</label>
                    <textarea 
                      className="w-full bg-surface-container-low rounded-lg border border-outline-variant p-md font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none font-body-md" 
                      id="connect-message" 
                      placeholder={`Hi ${selectedConnection.name.split(' ')[0]}, I would love to connect and learn more about your career journey...`}
                      rows="4"
                      value={connectMessage}
                      onChange={(e) => setConnectMessage(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                {/* Footer */}
                <div className="p-lg border-t border-surface-container flex justify-end gap-md bg-surface-container-low/50">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-lg py-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-lg py-sm rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-sm transition-all flex items-center justify-center gap-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]" data-icon="send">send</span>
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Modal Overlay B: Formal Referral Request */}
          {activeModal === 'referral' && selectedConnection && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-background/60 backdrop-blur-sm overflow-y-auto">
              <form 
                onSubmit={handleSendReferral}
                className="bg-surface-container-lowest rounded-xl shadow-xl flex flex-col border border-outline-variant/30 overflow-hidden w-full max-w-lg animate-fade-in"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-lg border-b border-surface-container">
                  <div className="flex items-center gap-sm text-primary">
                    <span className="material-symbols-outlined icon-fill" data-icon="workspace_premium">workspace_premium</span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Formal Referral Request</h2>
                  </div>
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined" data-icon="close">close</span>
                  </button>
                </div>
                {/* Body */}
                <div className="p-lg space-y-lg overflow-y-auto max-h-[70vh]">
                  {/* Target Person Info */}
                  <div className="flex items-center gap-md bg-surface-container-low p-md rounded-lg border border-outline-variant/20">
                    <img alt={selectedConnection.name} className="w-10 h-10 rounded-full object-cover" src={selectedConnection.avatar}/>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold">Requesting referral from {selectedConnection.name}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{selectedConnection.role} @ {selectedConnection.company}</p>
                    </div>
                  </div>
                  
                  {/* Job Link */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-sm" htmlFor="job-link">Target Job Posting URL *</label>
                    <div className="relative">
                      <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]" data-icon="link">link</span>
                      <input 
                        className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm pr-md pl-[44px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md" 
                        id="job-link" 
                        placeholder="https://careers.company.com/job..." 
                        type="url"
                        value={jobLink}
                        onChange={(e) => setJobLink(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  {/* Drag & Drop Resume */}
                  <div>
                    <span className="block font-label-md text-label-md text-on-surface-variant mb-sm">Updated Resume *</span>
                    <div className="border-2 border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center text-center bg-surface-container-low/50 hover:bg-surface-container transition-colors cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-md group-hover:bg-primary-container transition-colors">
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-primary-container" data-icon="upload_file">upload_file</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface font-medium">Drag and drop your resume here</p>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-xs">PDF, DOCX up to 5MB</p>
                      <button type="button" className="mt-md px-md py-sm rounded-lg font-label-md text-label-md border border-outline text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer">
                        Browse Files
                      </button>
                    </div>
                  </div>
                  {/* Why you are a fit */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-sm" htmlFor="fit-message">Why are you a strong fit for this role? *</label>
                    <textarea 
                      className="w-full bg-surface-container-low rounded-lg border border-outline-variant p-md font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none font-body-md" 
                      id="fit-message" 
                      placeholder="Highlight key skills and experiences..." 
                      rows="3"
                      value={fitMessage}
                      onChange={(e) => setFitMessage(e.target.value)}
                      required
                    ></textarea>
                    <p className="font-label-md text-label-md text-on-surface-variant mt-xs text-right">{fitMessage.length} / 500</p>
                  </div>
                </div>
                {/* Footer */}
                <div className="p-lg border-t border-surface-container flex justify-between items-center bg-surface-container-low/50">
                  <p className="font-label-md text-label-md text-on-surface-variant flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]" data-icon="info">info</span>
                    Uses 1 Referral Credit
                  </p>
                  <div className="flex gap-md">
                    <button 
                      type="button"
                      onClick={closeModal}
                      className="px-lg py-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-lg py-sm rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-sm transition-all flex items-center justify-center gap-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]" data-icon="send">send</span>
                      Submit Request
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

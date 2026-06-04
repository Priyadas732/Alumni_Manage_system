import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function CommunicationsHub() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        {/* TopAppBar */}
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="EmberHub" 
          showSearch={false}
        />
        
        {/* Main Content Canvas */}
        <main className="flex-1 pt-0 h-[calc(100vh-64px)] flex overflow-hidden">
          {/* Left Column: Conversations List */}
          <aside className="w-full md:w-[350px] lg:w-[400px] border-r border-outline-variant bg-surface-container-low flex flex-col h-full flex-shrink-0">
            {/* Search */}
            <div className="p-md border-b border-outline-variant/50">
              <div className="relative flex items-center bg-surface-container-lowest rounded-lg px-3 py-2 border border-outline-variant focus-within:ring-1 focus-within:ring-primary transition-all">
                <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-on-surface placeholder-on-surface-variant p-0 w-full text-body-lg font-body-lg outline-none" placeholder="Search messages..." type="text"/>
              </div>
            </div>
            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {/* Chat Item (Active) */}
              <button className="w-full text-left p-md flex items-start gap-md hover:bg-surface-container transition-colors bg-surface-container-highest border-l-4 border-primary cursor-pointer">
                <div className="relative">
                  <img alt="Sarah Jenkins" className="w-12 h-12 rounded-full object-cover border border-outline-variant" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"/>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-container-highest"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface truncate">Sarah Jenkins</h3>
                    <span className="font-label-md text-label-md text-primary">10:42 AM</span>
                  </div>
                  <p className="font-label-md text-label-md text-on-surface-variant truncate">That sounds like a great plan. Let's touch base on Thursday.</p>
                </div>
              </button>
              {/* Chat Item (Unread) */}
              <button className="w-full text-left p-md flex items-start gap-md hover:bg-surface-container transition-colors border-b border-outline-variant/20 cursor-pointer">
                <div className="relative">
                  <img alt="Michael Chen" className="w-12 h-12 rounded-full object-cover border border-outline-variant" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface truncate">Michael Chen</h3>
                    <span className="font-label-md text-label-md text-on-surface-variant">Yesterday</span>
                  </div>
                  <p className="font-label-md text-label-md text-on-surface font-medium truncate">Could you review my portfolio when you have a moment?</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              </button>
              {/* Chat Item */}
              <button className="w-full text-left p-md flex items-start gap-md hover:bg-surface-container transition-colors border-b border-outline-variant/20 cursor-pointer">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-lg">
                    DB
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface truncate">David Brooks</h3>
                    <span className="font-label-md text-label-md text-on-surface-variant">Mon</span>
                  </div>
                  <p className="font-label-md text-label-md text-on-surface-variant truncate">Thanks for the advice!</p>
                </div>
              </button>
            </div>
          </aside>
          
          {/* Right Column: Active Chat Window */}
          <section className="flex-1 flex flex-col h-full bg-surface-container-lowest">
            {/* Chat Header */}
            <header className="p-lg border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-low">
              <div className="flex items-center gap-md">
                <img alt="Sarah Jenkins" className="w-10 h-10 rounded-full object-cover border border-outline-variant" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"/>
                <div>
                  <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Sarah Jenkins</h2>
                  <p className="font-label-md text-label-md text-on-surface-variant">Senior Product Designer @ TechCorp</p>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <button className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container-highest transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">videocam</span>
                </button>
                <button className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container-highest transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </header>
            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-xl">
              {/* Date Divider */}
              <div className="flex items-center justify-center">
                <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-3 py-1 rounded-full text-xs">Today</span>
              </div>
              {/* Recipient Message */}
              <div className="flex flex-col gap-xs items-start max-w-[80%]">
                <div className="bg-surface-container-highest text-on-surface p-4 rounded-2xl rounded-tl-sm shadow-sm border border-outline-variant/30">
                  <p className="font-body-lg text-body-lg">Hi there! I saw you recently graduated from the UX program. Congratulations!</p>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant ml-1 text-xs">10:15 AM</span>
              </div>
              {/* Recipient Message */}
              <div className="flex flex-col gap-xs items-start max-w-[80%]">
                <div className="bg-surface-container-highest text-on-surface p-4 rounded-2xl rounded-tl-sm shadow-sm border border-outline-variant/30">
                  <p className="font-body-lg text-body-lg">I'm currently looking to expand our design team at TechCorp. Are you open to grabbing a virtual coffee to chat about some opportunities?</p>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant ml-1 text-xs">10:16 AM</span>
              </div>
              {/* User Message */}
              <div className="flex flex-col gap-xs items-end max-w-[80%] self-end">
                <div className="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-sm shadow-sm">
                  <p className="font-body-lg text-body-lg">Hello Sarah! Thank you so much.</p>
                </div>
              </div>
              {/* User Message */}
              <div className="flex flex-col gap-xs items-end max-w-[80%] self-end">
                <div className="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-sm shadow-sm">
                  <p className="font-body-lg text-body-lg">I would absolutely love to chat. I've been following TechCorp's recent redesign and found it really inspiring. Thursday afternoon works great for me.</p>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant mr-1 text-xs">10:30 AM</span>
              </div>
              {/* Recipient Message */}
              <div className="flex flex-col gap-xs items-start max-w-[80%]">
                <div className="bg-surface-container-highest text-on-surface p-4 rounded-2xl rounded-tl-sm shadow-sm border border-outline-variant/30">
                  <p className="font-body-lg text-body-lg">That sounds like a great plan. Let's touch base on Thursday.</p>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant ml-1 text-xs">10:42 AM</span>
              </div>
            </div>
            {/* Message Input */}
            <div className="p-lg bg-surface-container-low border-t border-outline-variant/50">
              <div className="flex items-end gap-sm bg-surface-container-lowest rounded-xl p-2 border border-outline-variant focus-within:border-primary transition-colors">
                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors mb-1 cursor-pointer">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <textarea className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-on-surface placeholder-on-surface-variant p-2 min-h-[44px] max-h-32 font-body-lg text-body-lg outline-none" placeholder="Type a message..." rows="1"></textarea>
                <button className="p-2 bg-primary text-on-primary rounded-lg hover:brightness-110 active:scale-[0.98] transition-colors mb-1 shadow-sm flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

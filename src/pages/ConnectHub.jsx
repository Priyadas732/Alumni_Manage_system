import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function ConnectHub() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="EmberHub" 
          searchPlaceholder="Search alumni by name, role, or company..." 
        />
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-gutter md:p-margin bg-surface">
          {/* Page Header & Filters */}
          <div className="mb-margin flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Alumni Directory</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Discover professionals open to mentorship and referrals.</p>
            </div>
            <div className="flex items-center gap-sm">
              <button className="flex items-center gap-xs px-md py-sm rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filters
              </button>
              <label className="flex items-center gap-xs cursor-pointer group">
                <div className="relative">
                  <input defaultChecked className="sr-only peer" type="checkbox"/>
                  <div className="w-10 h-6 bg-surface-container-highest peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">Referrals Only</span>
              </label>
            </div>
          </div>
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md md:gap-lg">
            {/* Card 1 */}
            <article className="bg-surface-container-lowest rounded-lg p-margin flex flex-col gap-md border border-outline-variant/50 hover:border-primary/30 transition-all shadow-sm hover:shadow-md group">
              <div className="flex justify-between items-start">
                <div className="flex gap-md items-center">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-variant border border-outline-variant/30">
                    <img alt="Sarah Jenkins" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"/>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[18px] leading-snug text-on-surface font-semibold group-hover:text-primary transition-colors">Sarah Jenkins</h3>
                    <p className="font-body-md text-on-surface-variant">Senior Product Designer</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-tertiary-container/10 text-tertiary font-label-md text-[10px] border border-tertiary/20 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1.5"></span>
                  Open to Referrals
                </span>
              </div>
              <div className="flex items-center gap-sm mt-xs">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">business_center</span>
                <span className="font-label-md text-label-md text-on-surface-variant">Nexus Tech Industries</span>
              </div>
              <div className="mt-auto pt-md flex gap-sm">
                <button className="flex-1 border border-outline text-on-surface rounded-lg py-sm font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                  Connect
                </button>
                <button className="flex-1 bg-primary text-on-primary rounded-lg py-sm font-label-md text-label-md hover:brightness-110 active:scale-[0.98] transition-all font-medium shadow-sm cursor-pointer">
                  Request Referral
                </button>
              </div>
            </article>
            
            {/* Card 2 */}
            <article className="bg-surface-container-lowest rounded-lg p-margin flex flex-col gap-md border border-outline-variant/50 hover:border-primary/30 transition-all shadow-sm hover:shadow-md group">
              <div className="flex justify-between items-start">
                <div className="flex gap-md items-center">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-variant border border-outline-variant/30">
                    <img alt="David Chen" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"/>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[18px] leading-snug text-on-surface font-semibold group-hover:text-primary transition-colors">David Chen</h3>
                    <p className="font-body-md text-on-surface-variant">Director of Engineering</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-sm mt-xs">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">business_center</span>
                <span className="font-label-md text-label-md text-on-surface-variant">Stark Financial Group</span>
              </div>
              <div className="mt-auto pt-md flex gap-sm">
                <button className="flex-1 border border-outline text-on-surface rounded-lg py-sm font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                  Connect
                </button>
                <button className="flex-1 bg-surface-container text-on-surface-variant/50 rounded-lg py-sm font-label-md text-label-md cursor-not-allowed border border-outline-variant/30" disabled>
                  Request Referral
                </button>
              </div>
            </article>
            
            {/* Card 3 */}
            <article className="bg-surface-container-lowest rounded-lg p-margin flex flex-col gap-md border border-outline-variant/50 hover:border-primary/30 transition-all shadow-sm hover:shadow-md group">
              <div className="flex justify-between items-start">
                <div className="flex gap-md items-center">
                  <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md font-bold">
                    AM
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[18px] leading-snug text-on-surface font-semibold group-hover:text-primary transition-colors">Alicia Martinez</h3>
                    <p className="font-body-md text-on-surface-variant">Data Scientist</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-tertiary-container/10 text-tertiary font-label-md text-[10px] border border-tertiary/20 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1.5"></span>
                  Open to Referrals
                </span>
              </div>
              <div className="flex items-center gap-sm mt-xs">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">business_center</span>
                <span className="font-label-md text-label-md text-on-surface-variant">QuantHealth Analytics</span>
              </div>
              <div className="mt-auto pt-md flex gap-sm">
                <button className="flex-1 border border-outline text-on-surface rounded-lg py-sm font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
                  Connect
                </button>
                <button className="flex-1 bg-primary text-on-primary rounded-lg py-sm font-label-md text-label-md hover:brightness-110 active:scale-[0.98] transition-all font-medium shadow-sm cursor-pointer">
                  Request Referral
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

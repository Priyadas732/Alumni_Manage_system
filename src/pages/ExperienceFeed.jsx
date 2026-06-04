import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function ExperienceFeed() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="EmberHub" 
          searchPlaceholder="Search updates, tags, or topics..." 
        />
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-surface pb-24 md:pb-gutter">
          <div className="max-w-3xl mx-auto px-gutter py-margin w-full flex flex-col gap-margin">
            {/* Top Banner */}
            <div className="bg-primary-container/10 border border-primary/20 rounded-lg p-sm px-md flex items-center gap-sm shadow-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">info</span>
              <p className="font-label-md text-label-md text-on-surface-variant">You are viewing updates from your connected network.</p>
            </div>
            
            {/* Share Component */}
            <div className="bg-surface-container-lowest rounded-lg p-md border border-outline-variant/50 shadow-sm flex flex-col gap-md">
              <div className="flex gap-md items-start">
                <img alt="Your Avatar" className="w-10 h-10 rounded-lg shrink-0" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"/>
                <div className="flex-1 bg-surface-container-low rounded-lg p-md border border-outline-variant/30 cursor-text hover:border-primary/50 transition-colors">
                  <p className="font-body-lg text-body-lg text-on-surface-variant/70">Share your industry experience...</p>
                </div>
              </div>
              <div className="flex justify-end gap-sm">
                <button className="flex items-center gap-xs px-md py-sm rounded-lg hover:bg-surface-container-high text-on-surface transition-colors font-label-md text-label-md cursor-pointer">
                  <span className="material-symbols-outlined text-tertiary">video_camera_front</span>
                  Upload Video
                </button>
                <button className="flex items-center gap-xs px-md py-sm rounded-lg bg-primary-container text-on-primary-container hover:bg-primary transition-colors font-label-md text-label-md cursor-pointer">
                  <span className="material-symbols-outlined">edit_document</span>
                  Write Post
                </button>
              </div>
            </div>
            
            {/* Feed Stream */}
            <div className="flex flex-col gap-xl">
              {/* Card 1: Text/Image Post */}
              <article className="bg-surface-container-lowest rounded-lg border border-outline-variant/50 shadow-sm overflow-hidden flex flex-col">
                <div className="p-md flex justify-between items-start">
                  <div className="flex gap-sm items-center">
                    <img alt="Sarah Jenkins Avatar" className="w-10 h-10 rounded-lg" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"/>
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface font-bold">Sarah Jenkins</h3>
                      <p className="font-label-md text-label-md text-on-surface-variant text-[10px]">Product Designer @ TechFlow • 2h ago</p>
                    </div>
                  </div>
                  <button className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
                <div className="px-md pb-md">
                  <p className="font-body-lg text-body-lg text-on-surface mb-sm">Just wrapped up an intense 5-round interview process for a Senior UX role. The whiteboard challenge was definitely the toughest part. Here's a quick snap of my messy but ultimately successful thought process!</p>
                  <p className="font-label-md text-label-md text-primary font-semibold mb-md">#UXDesign #InterviewPrep #TechCareers</p>
                  <div className="rounded-lg overflow-hidden border border-outline-variant/30 h-64 bg-surface-container-highest relative">
                    <img alt="Whiteboard with complex diagrams and sticky notes" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"/>
                  </div>
                </div>
                <div className="border-t border-outline-variant/20 px-md py-sm flex justify-between items-center bg-surface-container-low">
                  <div className="flex gap-sm">
                    <button className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors group cursor-pointer">
                      <span className="material-symbols-outlined group-hover:filled">thumb_up</span>
                      <span className="font-label-md text-label-md">245</span>
                    </button>
                    <button className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                      <span className="material-symbols-outlined">chat_bubble</span>
                      <span className="font-label-md text-label-md">42</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined">share</span>
                    <span className="font-label-md text-label-md">Share</span>
                  </button>
                </div>
              </article>
              
              {/* Card 2: Video Post */}
              <article className="bg-surface-container-lowest rounded-lg border border-outline-variant/50 shadow-sm overflow-hidden flex flex-col">
                <div className="p-md flex justify-between items-start">
                  <div className="flex gap-sm items-center">
                    <img alt="Marcus Chen Avatar" className="w-10 h-10 rounded-lg" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"/>
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface font-bold">Marcus Chen</h3>
                      <p className="font-label-md text-label-md text-on-surface-variant text-[10px]">Software Engineer • 5h ago</p>
                    </div>
                  </div>
                  <button className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
                <div className="px-md pb-md">
                  <p className="font-body-lg text-body-lg text-on-surface mb-md">I get asked a lot about how I approached the systems design round at big tech companies. I recorded a quick vlog breaking down my 3-step framework. Hope this helps some of you currently grinding LeetCode!</p>
                  
                  {/* Stylized Video Player */}
                  <div className="rounded-lg overflow-hidden border border-outline-variant/30 bg-black relative group aspect-video">
                    <img alt="Person talking to camera in home office" className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 rounded-full bg-primary/90 text-on-primary flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform backdrop-blur-sm cursor-pointer">
                        <span className="material-symbols-outlined filled text-[32px]">play_arrow</span>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-sm pt-xl">
                      <div className="flex items-center gap-sm text-white font-label-md text-label-md mb-xs">
                        <span className="material-symbols-outlined text-[16px]">volume_up</span>
                        <span>0:45 / 3:20</span>
                        <div className="ml-auto bg-black/50 px-xs py-[2px] rounded text-[10px] uppercase tracking-wider">CC</div>
                      </div>
                      <div className="w-full h-1 bg-white/30 rounded-lg overflow-hidden">
                        <div className="w-1/4 h-full bg-primary rounded-lg relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Caption/Transcript Snippet */}
                  <div className="mt-sm bg-surface-container-low p-sm rounded border border-outline-variant/20 border-l-4 border-l-secondary">
                    <p className="font-label-md text-label-md text-on-surface-variant italic">"...the key isn't just knowing the architecture, it's communicating trade-offs clearly to the interviewer before writing a single line of code..."</p>
                  </div>
                </div>
                <div className="border-t border-outline-variant/20 px-md py-sm flex justify-between items-center bg-surface-container-low">
                  <div className="flex gap-sm">
                    <button className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors group cursor-pointer">
                      <span className="material-symbols-outlined group-hover:filled">thumb_up</span>
                      <span className="font-label-md text-label-md">892</span>
                    </button>
                    <button className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                      <span className="material-symbols-outlined">chat_bubble</span>
                      <span className="font-label-md text-label-md">156</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined">share</span>
                    <span className="font-label-md text-label-md">Share</span>
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

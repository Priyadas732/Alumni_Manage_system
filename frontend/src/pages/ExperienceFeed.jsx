import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { postAPI } from '../api';

export default function ExperienceFeed() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dbPosts, setDbPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Composing States
  const [isComposing, setIsComposing] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Active Filter Pill
  const [activeFilter, setActiveFilter] = useState('All Posts');

  const mockPosts = [
    {
      id: 'mock-post-1',
      content: "Thrilled to share that I've started a new position as Senior Product Designer at Acme Corp! Looking forward to diving into complex systems and building the future of enterprise software with such a talented team. Huge thanks to everyone who supported me during this transition. 🚀",
      tags: ['NEWJOB'],
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
      likesCount: 124,
      commentsCount: 32,
      author: {
        name: 'Marcus Chen',
        jobTitle: 'Senior Product Designer',
        company: 'Acme Corp',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }
    },
    {
      id: 'mock-post-2',
      content: "I'm opening up 2 mentorship slots for junior developers looking to move into management or lead roles. If you're passionate about scaling teams and technical strategy, I'd love to connect and share some insights. Drop a comment below or DM me!",
      tags: ['MENTORSHIP'],
      isArticle: true,
      articleTitle: 'The Transition from IC to Engineering Leadership',
      articleDesc: 'Moving from a senior developer role into management requires a complete shift in mindset. Here are the top 5...',
      articleImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
      likesCount: 258,
      commentsCount: 89,
      author: {
        name: 'Sarah Jenkins',
        jobTitle: 'Engineering Manager',
        company: 'CloudScale',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
      }
    }
  ];

  const fetchPosts = () => {
    setLoading(true);
    postAPI.getPosts()
      .then(data => {
        setDbPosts(data.posts || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    // Merge database posts and mock posts
    const formattedDb = dbPosts.map(post => ({
      ...post,
      likesCount: post.likesCount || (post.likes ? post.likes.length : 0),
      commentsCount: post.commentsCount || (post.comments ? post.comments.length : 0)
    }));
    setPosts([...formattedDb, ...mockPosts]);
  }, [dbPosts]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setSubmitting(true);
    try {
      const tagsArray = newPostTags.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
      await postAPI.createPost(newPostContent, tagsArray, newPostImage || undefined);
      setNewPostContent('');
      setNewPostTags('');
      setNewPostImage('');
      setShowImageInput(false);
      setIsComposing(false);
      fetchPosts();
    } catch (err) {
      alert("Error creating post: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    if (postId.startsWith('mock-')) {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, likesCount: p.likesCount + 1 };
        }
        return p;
      }));
      return;
    }

    try {
      await postAPI.toggleLike(postId);
      fetchPosts();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleShare = () => {
    alert("Post link copied to clipboard!");
  };

  const handleAttachmentClick = (type) => {
    setIsComposing(true);
    if (type === 'photo') {
      setShowImageInput(true);
    } else if (type === 'article') {
      setNewPostTags(prev => prev ? `${prev}, ARTICLE` : 'ARTICLE');
    } else if (type === 'achievement') {
      setNewPostTags(prev => prev ? `${prev}, ACHIEVEMENT` : 'ACHIEVEMENT');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'All Posts') return true;
    
    const tagMatch = (post.tags || []).some(t => {
      const tagLower = t.toLowerCase();
      if (activeFilter === 'New Jobs') return tagLower.includes('job') || tagLower.includes('newjob');
      if (activeFilter === 'Mentorship') return tagLower.includes('mentor');
      if (activeFilter === 'Industry Insights') return tagLower.includes('insight') || tagLower.includes('industry');
      if (activeFilter === 'Referrals') return tagLower.includes('referral');
      return false;
    });

    return tagMatch;
  });

  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

  useEffect(() => {
    const handleProfileUpdate = () => {
      setCurrentUser(JSON.parse(localStorage.getItem('user') || '{}'));
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const userAvatar = currentUser.avatarUrl || currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#edf8fc]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="AlumniConnect" 
          searchPlaceholder="Search alumni, jobs, or events..." 
        />
        
        {/* Scrollable Main Area (3 Columns Layout) */}
        <div className="flex-1 overflow-y-auto bg-[#edf8fc] pb-10">
          <div className="max-w-7xl mx-auto px-gutter py-margin w-full grid grid-cols-1 lg:grid-cols-4 gap-lg">
            
            {/* Middle Column (Feed stream) */}
            <div className="lg:col-span-3 space-y-md">
              
              {/* Post Composer Card */}
              <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center font-bold">
                    <img src={userAvatar} alt="user avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    {isComposing ? (
                      <div className="flex flex-col gap-3">
                        <textarea 
                          value={newPostContent}
                          onChange={e => setNewPostContent(e.target.value)}
                          className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 focus:border-[#3b82f6]/50 focus:ring-0 outline-none resize-none text-slate-800 text-sm font-semibold leading-relaxed" 
                          placeholder="Share a professional update, milestone, or insight..."
                          rows="3"
                          autoFocus
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input 
                            value={newPostTags}
                            onChange={e => setNewPostTags(e.target.value)}
                            className="bg-slate-50 rounded-lg p-2 border border-slate-200 outline-none text-slate-700 text-xs font-semibold"
                            placeholder="Tags (comma separated, e.g. JOB, INSIGHT)"
                          />
                          {(showImageInput || newPostImage) && (
                            <input 
                              value={newPostImage}
                              onChange={e => setNewPostImage(e.target.value)}
                              className="bg-slate-50 rounded-lg p-2 border border-slate-200 outline-none text-slate-700 text-xs font-semibold animate-fade-in"
                              placeholder="Image URL"
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setIsComposing(true)}
                        className="w-full bg-slate-50 rounded-full py-2.5 px-5 border border-slate-100 hover:border-slate-300/50 cursor-text transition-colors"
                      >
                        <p className="text-slate-400 text-xs font-bold leading-none">Share a professional update, milestone, or insight...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Composer Attachments and Post Button */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                  <div className="flex gap-2 sm:gap-4 flex-wrap">
                    <button 
                      onClick={() => handleAttachmentClick('photo')}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-cyan-600 transition-colors text-xs font-bold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-cyan-500 select-none">image</span>
                      Photo
                    </button>
                    <button 
                      onClick={() => handleAttachmentClick('article')}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 transition-colors text-xs font-bold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-emerald-500 select-none">article</span>
                      Article
                    </button>
                    <button 
                      onClick={() => handleAttachmentClick('achievement')}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-amber-600 transition-colors text-xs font-bold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-amber-500 select-none">emoji_events</span>
                      Achievement
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {isComposing && (
                      <button 
                        onClick={() => { setIsComposing(false); setShowImageInput(false); }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      onClick={handleCreatePost}
                      disabled={submitting || !newPostContent.trim()}
                      className="px-5 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold rounded-lg text-xs cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Pills Row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {['All Posts', 'New Jobs', 'Mentorship', 'Industry Insights', 'Referrals'].map(filter => {
                  const isActive = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-[#0f2942] text-white border-[#0f2942]'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              {/* Feed Stream */}
              <div className="flex flex-col gap-md">
                {loading && (
                  <div className="text-center py-10 text-slate-500 font-semibold">Loading feed updates...</div>
                )}
                {!loading && error && (
                  <div className="text-center py-10 text-red-500 bg-red-50 rounded-2xl border border-red-100">{error}</div>
                )}
                {!loading && !error && filteredPosts.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500 font-semibold">
                    No updates available. Click compose to start sharing!
                  </div>
                )}

                {/* Posts mapping */}
                {!loading && !error && filteredPosts.map(post => {
                  const tagText = post.tags?.[0] || '';
                  
                  return (
                    <article key={post.id} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col overflow-hidden group">
                      
                      {/* Author Header */}
                      <div className="p-5 flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                            {post.author?.avatarUrl ? (
                              <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                            ) : (
                              post.author?.name?.charAt(0) || 'U'
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-[#0f2942]">{post.author?.name || 'Member'}</h3>
                              {tagText && (
                                <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded uppercase ${
                                  tagText === 'NEWJOB' 
                                    ? 'bg-blue-50 text-[#005cb8]' 
                                    : tagText === 'MENTORSHIP'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  #{tagText}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">
                              {post.author?.jobTitle || 'Professional'} {post.author?.company ? `at ${post.author.company}` : ''} • {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Actions dot button */}
                        <button 
                          onClick={() => alert("Reporting or archiving options...")}
                          className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-50 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                        </button>
                      </div>

                      {/* Content text */}
                      <div className="px-5 pb-4">
                        <p className="text-slate-600 text-sm font-semibold leading-relaxed whitespace-pre-wrap">{post.content}</p>
                      </div>

                      {/* Post media attachment */}
                      {post.imageUrl && (
                        <div className="border-t border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center max-h-[350px]">
                          <img alt="post attachment" className="w-full h-full object-cover" src={post.imageUrl}/>
                        </div>
                      )}

                      {/* Article Preview Card */}
                      {post.isArticle && (
                        <div className="px-5 pb-5">
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center cursor-pointer hover:bg-slate-100/50 transition-colors">
                            <div className="w-full md:w-28 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 shadow-sm">
                              <img src={post.articleImage} alt="article" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-black text-[#3b82f6] uppercase tracking-wider block">Article</span>
                              <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">{post.articleTitle}</h4>
                              <p className="text-[11px] text-slate-400 font-semibold line-clamp-2 mt-1 leading-normal">{post.articleDesc}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="border-t border-slate-100 px-5 py-3 flex justify-between items-center bg-slate-50/50">
                        <div className="flex gap-6">
                          <button 
                            onClick={() => handleLike(post.id)}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-[#3b82f6] transition-colors group cursor-pointer text-xs font-bold"
                          >
                            <span className="material-symbols-outlined text-[18px] group-hover:filled" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                            <span>{post.likesCount || 0}</span>
                          </button>
                          <button 
                            onClick={() => alert("Open comments section...")}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-[#3b82f6] transition-colors cursor-pointer text-xs font-bold"
                          >
                            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                            <span>{post.commentsCount || 0}</span>
                          </button>
                        </div>

                        <button 
                          onClick={handleShare}
                          className="flex items-center gap-1.5 text-slate-500 hover:text-[#3b82f6] transition-colors cursor-pointer text-xs font-bold"
                        >
                          <span className="material-symbols-outlined text-[18px]">share</span>
                          <span>Share</span>
                        </button>
                      </div>

                    </article>
                  );
                })}
              </div>
            </div>

            {/* Right Column (Grow Your Network & Upcoming Events) */}
            <div className="lg:col-span-1 space-y-md">
              
              {/* Grow Your Network Card */}
              <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-black text-[#0f2942] uppercase tracking-wider">Grow Your Network</h3>
                
                <div className="flex flex-col gap-3">
                  {[
                    { name: 'David Vance', title: 'Partner at LeadVenture', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
                    { name: 'Elena Rodriguez', title: 'AI Ethics Researcher', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80' },
                    { name: 'Samir Khan', title: 'Full Stack Developer', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80' }
                  ].map(user => (
                    <div key={user.name} className="flex justify-between items-center gap-2">
                      <div className="flex gap-2 items-center min-w-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">{user.name}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-0.5">{user.title}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert(`Connection request sent to ${user.name}!`)}
                        className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] hover:border-[#3b82f6]/30 flex items-center justify-center text-slate-500 transition-colors shrink-0 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => navigate('/hub')}
                  className="text-[#3b82f6] hover:underline text-xs font-extrabold self-start mt-1 cursor-pointer"
                >
                  View all suggestions
                </button>
              </div>

              {/* Upcoming Events Card */}
              <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-[#0f2942] uppercase tracking-wider">Upcoming Events</h3>
                  <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_today</span>
                </div>

                <div className="flex flex-col gap-4">
                  {[
                    { dateMonth: 'OCT', dateDay: '12', title: 'San Francisco Alumni Mixer', detail: 'Grand Hyatt, 6:00 PM' },
                    { dateMonth: 'OCT', dateDay: '15', title: 'Webinar: AI in Fintech', detail: 'Online, Zoom Link' }
                  ].map(event => (
                    <div key={event.title} className="flex gap-3 items-center">
                      {/* Calendar Box */}
                      <div className="w-10 h-10 rounded-xl bg-[#004e8c] text-white flex flex-col items-center justify-center shadow-sm shrink-0">
                        <span className="text-[8px] font-black tracking-widest text-blue-200 leading-none">{event.dateMonth}</span>
                        <span className="text-xs font-black leading-none mt-0.5">{event.dateDay}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">{event.title}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{event.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => alert("Opening full events calendar...")}
                  className="text-[#3b82f6] hover:underline text-xs font-extrabold self-start mt-1 cursor-pointer"
                >
                  See full calendar
                </button>
              </div>

              {/* Footer Links & Copy */}
              <div className="px-1 text-[10px] text-slate-400 leading-normal font-semibold space-y-2">
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {['About', 'Accessibility', 'Help Center', 'Privacy & Terms', 'Ad Choices', 'Advertising'].map(link => (
                    <button key={link} className="hover:underline hover:text-slate-600 cursor-pointer">{link}</button>
                  ))}
                </div>
                <div className="flex items-center gap-1 font-extrabold text-[#0f2942]">
                  <span>AlumniConnect</span>
                  <span className="text-slate-400 font-normal">© 2024 AlumniConnect Corp.</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

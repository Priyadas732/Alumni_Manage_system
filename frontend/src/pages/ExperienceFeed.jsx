import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { postAPI } from '../api';
export default function ExperienceFeed() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isComposing, setIsComposing] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = () => {
    setLoading(true);
    postAPI.getPosts()
      .then(data => setPosts(data.posts || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setSubmitting(true);
    try {
      const tagsArray = newPostTags.split(',').map(t => t.trim()).filter(Boolean);
      await postAPI.createPost(newPostContent, tagsArray, newPostImage || undefined);
      setNewPostContent('');
      setNewPostTags('');
      setNewPostImage('');
      setIsComposing(false);
      fetchPosts();
    } catch (err) {
      alert("Error creating post: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postAPI.toggleLike(postId);
      // Optimistically increment or refetch, refetch is safer here
      fetchPosts();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="LegacyBridge" 
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
              {isComposing ? (
                <div className="flex flex-col gap-sm">
                  <textarea 
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    className="w-full bg-surface-container-low rounded-lg p-md border border-outline-variant focus:border-primary outline-none resize-none text-on-surface font-body-lg" 
                    placeholder="What do you want to share with your network?"
                    rows="3"
                    autoFocus
                  />
                  <input 
                    value={newPostTags}
                    onChange={e => setNewPostTags(e.target.value)}
                    className="w-full bg-surface-container-low rounded-lg p-sm border border-outline-variant focus:border-primary outline-none text-on-surface font-body-md"
                    placeholder="Tags (comma separated, e.g., react, career, advice)"
                  />
                  <input 
                    value={newPostImage}
                    onChange={e => setNewPostImage(e.target.value)}
                    className="w-full bg-surface-container-low rounded-lg p-sm border border-outline-variant focus:border-primary outline-none text-on-surface font-body-md"
                    placeholder="Image URL (optional)"
                  />
                  <div className="flex justify-end gap-sm mt-sm">
                    <button 
                      onClick={() => setIsComposing(false)}
                      className="px-md py-sm rounded-lg hover:bg-surface-container-high text-on-surface font-label-md cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleCreatePost}
                      disabled={submitting || !newPostContent.trim()}
                      className="px-md py-sm rounded-lg bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-label-md cursor-pointer transition-colors flex items-center gap-xs"
                    >
                      {submitting && <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>}
                      Post
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-md items-start">
                    <div className="w-10 h-10 rounded-lg shrink-0 bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                      {JSON.parse(localStorage.getItem('user') || '{}').name?.charAt(0) || 'U'}
                    </div>
                    <div 
                      onClick={() => setIsComposing(true)}
                      className="flex-1 bg-surface-container-low rounded-lg p-md border border-outline-variant/30 cursor-text hover:border-primary/50 transition-colors"
                    >
                      <p className="font-body-lg text-body-lg text-on-surface-variant/70">Share your industry experience...</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-sm">
                    <button 
                      onClick={() => setIsComposing(true)}
                      className="flex items-center gap-xs px-md py-sm rounded-lg bg-primary-container text-on-primary-container hover:bg-primary transition-colors font-label-md text-label-md cursor-pointer"
                    >
                      <span className="material-symbols-outlined">edit_document</span>
                      Write Post
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Feed Stream */}
            <div className="flex flex-col gap-xl">
              
              {loading && (
                <div className="text-center py-xl text-on-surface-variant">Loading posts...</div>
              )}

              {!loading && error && (
                <div className="text-center py-xl text-error bg-error-container/10 rounded-lg">
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && posts.length === 0 && (
                <div className="text-center py-xl text-on-surface-variant bg-surface-container-low rounded-lg">
                  <p>No posts available. Be the first to share your experience!</p>
                </div>
              )}

              {!loading && !error && posts.map(post => (
                <article key={post.id} className="bg-surface-container-lowest rounded-lg border border-outline-variant/50 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-md flex justify-between items-start">
                    <div className="flex gap-sm items-center">
                      <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold overflow-hidden">
                        {post.author?.avatarUrl ? (
                           <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                        ) : (
                           post.author?.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div>
                        <h3 className="font-label-md text-label-md text-on-surface font-bold">{post.author?.name || 'Unknown User'}</h3>
                        <p className="font-label-md text-label-md text-on-surface-variant text-[10px]">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-md pb-md">
                    <p className="font-body-lg text-body-lg text-on-surface mb-sm whitespace-pre-wrap">{post.content}</p>
                    {post.tags && post.tags.map(tag => (
                      <span key={tag} className="font-label-md text-label-md text-primary font-semibold mb-md mr-2 bg-primary/10 px-2 py-1 rounded-full text-xs">#{tag}</span>
                    ))}
                    {post.imageUrl && (
                      <div className="rounded-lg mt-sm overflow-hidden border border-outline-variant/30 max-h-96 bg-surface-container-highest relative">
                        <img alt="Post content" className="w-full h-full object-cover" src={post.imageUrl}/>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-outline-variant/20 px-md py-sm flex justify-between items-center bg-surface-container-low">
                    <div className="flex gap-sm">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors group cursor-pointer"
                      >
                        <span className="material-symbols-outlined group-hover:filled">thumb_up</span>
                        <span className="font-label-md text-label-md">{post.likesCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">chat_bubble</span>
                        <span className="font-label-md text-label-md">{post._count?.comments || 0}</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

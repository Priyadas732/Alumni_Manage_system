import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { chatAPI } from '../api';

export default function CommunicationsHub() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    chatAPI.getConversations()
      .then(data => setConversations(data.conversations || []))
      .catch(err => console.error(err))
      .finally(() => setLoadingChats(false));
  }, []);

  useEffect(() => {
    if (activeChat) {
      setLoadingMessages(true);
      chatAPI.getMessages(activeChat.id)
        .then(data => {
          setMessages(data.messages || []);
          scrollToBottom();
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingMessages(false));
    }
  }, [activeChat]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const data = await chatAPI.sendMessage(activeChat.id, newMessage);
      setMessages(prev => [...prev, data.message]);
      setNewMessage('');
      scrollToBottom();
      
      // Update the last message in the sidebar
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeChat.id) {
          return { ...conv, messages: [data.message] };
        }
        return conv;
      }));
    } catch (err) {
      alert("Error sending message: " + err.message);
    }
  };

  // Helper to get the other participant in a conversation
  const getOtherParticipant = (conversation) => {
    const other = conversation.participants.find(p => p.userId !== currentUser.id);
    return other?.user;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="LegacyBridge" 
          showSearch={false}
        />
        
        <main className="flex-1 pt-0 h-[calc(100vh-64px)] flex overflow-hidden">
          {/* Left Column: Conversations List */}
          <aside className="w-full md:w-[350px] lg:w-[400px] border-r border-outline-variant bg-surface-container-low flex flex-col h-full flex-shrink-0">
            <div className="p-md border-b border-outline-variant/50">
              <div className="relative flex items-center bg-surface-container-lowest rounded-lg px-3 py-2 border border-outline-variant focus-within:ring-1 focus-within:ring-primary transition-all">
                <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-on-surface placeholder-on-surface-variant p-0 w-full text-body-lg font-body-lg outline-none" placeholder="Search messages..." type="text"/>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loadingChats && <p className="p-md text-center text-on-surface-variant">Loading chats...</p>}
              {!loadingChats && conversations.length === 0 && (
                <p className="p-md text-center text-on-surface-variant">No conversations yet.</p>
              )}
              
              {!loadingChats && conversations.map(conv => {
                const otherUser = getOtherParticipant(conv);
                const lastMessage = conv.messages?.[0];
                const isActive = activeChat?.id === conv.id;

                return (
                  <button 
                    key={conv.id}
                    onClick={() => setActiveChat(conv)}
                    className={`w-full text-left p-md flex items-start gap-md hover:bg-surface-container transition-colors border-b border-outline-variant/20 cursor-pointer ${isActive ? 'bg-surface-container-highest border-l-4 border-primary' : ''}`}
                  >
                    <div className="relative shrink-0">
                      {otherUser?.avatarUrl ? (
                        <img alt={otherUser.name} className="w-12 h-12 rounded-full object-cover border border-outline-variant" src={otherUser.avatarUrl}/>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-lg">
                          {otherUser?.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-body-lg text-body-lg font-semibold text-on-surface truncate">{otherUser?.name || 'Unknown'}</h3>
                        {lastMessage && (
                          <span className="font-label-md text-label-md text-on-surface-variant">
                            {new Date(lastMessage.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="font-label-md text-label-md text-on-surface-variant truncate">
                        {lastMessage ? lastMessage.content : 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
          
          {/* Right Column: Active Chat Window */}
          <section className="flex-1 flex flex-col h-full bg-surface-container-lowest">
            {!activeChat ? (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant flex-col gap-sm">
                <span className="material-symbols-outlined text-[48px]">forum</span>
                <p>Select a conversation to start messaging</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <header className="p-lg border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-low">
                  <div className="flex items-center gap-md">
                    {getOtherParticipant(activeChat)?.avatarUrl ? (
                      <img alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-outline-variant" src={getOtherParticipant(activeChat)?.avatarUrl}/>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                        {getOtherParticipant(activeChat)?.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">{getOtherParticipant(activeChat)?.name}</h2>
                      <p className="font-label-md text-label-md text-on-surface-variant">{getOtherParticipant(activeChat)?.role}</p>
                    </div>
                  </div>
                </header>

                {/* Message History */}
                <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-md">
                  {loadingMessages && <p className="text-center text-on-surface-variant">Loading messages...</p>}
                  
                  {!loadingMessages && messages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUser.id;
                    
                    return (
                      <div key={msg.id || idx} className={`flex flex-col gap-xs max-w-[80%] ${isMe ? 'items-end self-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-2xl shadow-sm border border-outline-variant/30 ${isMe ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-surface-container-highest text-on-surface rounded-tl-sm'}`}>
                          <p className="font-body-lg text-body-lg whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className={`font-label-md text-label-md text-on-surface-variant text-xs ${isMe ? 'mr-1' : 'ml-1'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-lg bg-surface-container-low border-t border-outline-variant/50">
                  <form onSubmit={handleSend} className="flex items-end gap-sm bg-surface-container-lowest rounded-xl p-2 border border-outline-variant focus-within:border-primary transition-colors">
                    <textarea 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                      className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-on-surface placeholder-on-surface-variant p-2 min-h-[44px] max-h-32 font-body-lg text-body-lg outline-none" 
                      placeholder="Type a message..." 
                      rows="1"
                    />
                    <button type="submit" disabled={!newMessage.trim()} className="p-2 bg-primary text-on-primary rounded-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-1 shadow-sm flex items-center justify-center cursor-pointer">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                    </button>
                  </form>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

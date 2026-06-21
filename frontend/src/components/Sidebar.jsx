import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
    { label: 'Feed', path: '/feed', icon: 'rss_feed' },
    { label: 'Connect Hub', path: '/hub', icon: 'groups' },
    { label: 'My Requests', path: '/requests', icon: 'handshake' },
    { label: 'Messages', path: '/communications', icon: 'mail' },
    { label: 'Interaction Updates', path: '/modals', icon: 'history' },
  ];
  const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  });

  const userRole = localStorage.getItem('userRole') || '';
  const isAlumni = userRole === 'alumni' || userRole === 'alumnus' || (user.role && user.role.toLowerCase() === 'alumni');

  React.useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user') || '{}'));
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const sidebarContent = (
    <>
      {/* Header logo card matching mockup */}
      <div className="flex items-center justify-between mb-8 mt-2 px-1">
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/50 shadow-sm w-full">
          <div className="w-10 h-10 rounded-xl bg-[#004e8c] text-white flex items-center justify-center shadow-inner shrink-0">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black text-[#3b82f6] uppercase tracking-wider block">Global Network</span>
            <span className="text-sm font-black text-[#0f2942] tracking-tight block mt-0.5">AlumniConnect</span>
          </div>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-xs text-slate-500 hover:text-[#3b82f6] transition-colors rounded-full hover:bg-slate-100"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <nav className="flex flex-col gap-[6px]">
        {navItems.map((item) => {
          const isActive = (
            item.label === 'Dashboard' ? currentPath === '/dashboard' :
            item.label === 'Feed' ? currentPath === '/feed' :
            item.label === 'Connect Hub' ? (currentPath === '/hub' || currentPath.startsWith('/directory')) :
            item.label === 'My Requests' ? currentPath === '/requests' :
            item.label === 'Messages' ? currentPath === '/communications' :
            item.label === 'Interaction Updates' ? currentPath === '/modals' : false
          );
          
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#3b82f6]/10 text-[#3b82f6] font-bold border-l-4 border-[#3b82f6] rounded-l-none'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold'
              }`}
            >
              <span 
                className="material-symbols-outlined text-[20px]" 
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Bottom Actions Card matching mockup */}
      <div className="mt-auto pt-4 flex flex-col gap-4">
        <hr className="border-slate-200/80 w-full" />
        
        <button 
          onClick={() => alert("Invite link copied to clipboard!")}
          className="w-full bg-[#005cb8] hover:bg-[#004e8c] text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer tracking-wider uppercase"
        >
          Invite Peers
        </button>

        <div className="flex items-center justify-between px-1 mt-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#3b82f6] shrink-0">
              <img 
                src={user.avatarUrl || user.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80'} 
                className="w-full h-full object-cover" 
                alt="Avatar"
              />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black text-[#0f2942] block truncate leading-tight">
                {user.name || 'Test Alumnus'}
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 block leading-none">
                {isAlumni ? 'PREMIUM' : 'STUDENT'}
                <span className="block mt-[2px]">MEMBER</span>
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="text-slate-500 hover:text-[#3b82f6] hover:bg-slate-200/50 p-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center justify-center"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 500" }}>logout</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="fixed left-0 top-0 h-full w-64 flex flex-col p-6 z-40 bg-[#edf8fc] border-r border-slate-200/50 hidden md:flex overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          {/* Mobile Sidebar (Drawer) */}
          <aside 
            className="fixed left-0 top-0 h-full w-64 flex flex-col p-6 z-50 bg-[#edf8fc] border-r border-slate-200/50 animate-slide-in overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

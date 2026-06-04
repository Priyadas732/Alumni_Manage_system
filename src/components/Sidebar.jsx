import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: 'Connect Hub', path: '/hub', icon: 'hub' },
    { label: 'Feed', path: '/feed', icon: 'rss_feed' },
    { label: 'My Requests', path: '/requests', icon: 'handshake' },
    { label: 'Messages', path: '/communications', icon: 'mail' },
    { label: 'Interaction Modals', path: '/modals', icon: 'open_in_new' },
  ];

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-xl mt-sm px-sm">
        <div className="flex items-center gap-md">
          <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md shadow-sm font-bold">
            E
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary truncate">Ember & Ash</h1>
            <p className="font-label-md text-label-md text-on-surface-variant truncate">Student & Alumni Network</p>
          </div>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-xs text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 flex flex-col gap-sm">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-md rounded-lg px-md py-sm transition-all duration-200 ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <span 
                className="material-symbols-outlined" 
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Tab */}
      <div className="mt-auto pt-margin border-t border-outline-variant/30">
        <Link
          to="/login"
          onClick={onClose}
          className="flex items-center gap-md text-on-surface-variant hover:bg-surface-variant/50 rounded-lg px-md py-sm hover:text-on-surface transition-all duration-200"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-md text-label-md">Logout</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="fixed left-0 top-0 h-full w-64 flex flex-col p-gutter z-40 bg-surface-container border-r border-outline-variant/30 hidden md:flex">
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
            className="fixed left-0 top-0 h-full w-64 flex flex-col p-gutter z-50 bg-surface-container border-r border-outline-variant/30 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

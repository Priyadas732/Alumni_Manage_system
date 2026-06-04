import React from 'react';
import { Link } from 'react-router-dom';

export default function TopBar({ onMenuClick, title = "EmberHub", showSearch = true, searchPlaceholder = "Search..." }) {
  // Read name and avatar from localStorage
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const userName = profile.name || 'User';
  const userAvatar = profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

  return (
    <header className="sticky top-0 w-full z-30 flex justify-between items-center px-gutter h-16 bg-surface-container-lowest border-b border-outline-variant/30">
      <div className="flex items-center gap-md flex-1">
        {/* Mobile Hamburger menu */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-xs text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-variant flex items-center justify-center"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Search Bar (desktop) */}
        {showSearch && (
          <div className="flex-1 max-w-md relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              className="w-full bg-surface-container-low rounded-lg py-2 pl-xl pr-md text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant border border-transparent focus:border-primary focus:ring-0 focus:bg-surface-container-lowest outline-none transition-all" 
              placeholder={searchPlaceholder} 
              type="text"
            />
          </div>
        )}
      </div>

      {/* Mobile App title */}
      <div className="sm:hidden font-headline-md text-headline-md font-bold text-primary absolute left-1/2 -translate-x-1/2">
        {title}
      </div>

      {/* Trailing Icons */}
      <div className="flex items-center gap-md ml-auto">
        <button className="p-xs text-on-surface-variant hover:text-primary transition-colors duration-200 rounded-full hover:bg-surface-variant flex items-center justify-center">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-xs text-on-surface-variant hover:text-primary transition-colors duration-200 rounded-full hover:bg-surface-variant flex items-center justify-center">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <Link to="/profile" className="flex items-center gap-sm hover:opacity-85 transition-opacity pl-sm border-l border-outline-variant/30">
          <span className="font-label-md text-label-md text-on-surface font-semibold hidden md:inline">{userName}</span>
          <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden cursor-pointer border border-outline-variant/30 hover:ring-2 hover:ring-primary/50 transition-all shrink-0">
            <img 
              alt="User Profile Avatar" 
              className="w-full h-full object-cover" 
              src={userAvatar}
            />
          </div>
        </Link>
      </div>
    </header>
  );
}

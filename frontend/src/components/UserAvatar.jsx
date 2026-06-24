import React from 'react';

export default function UserAvatar({ user, className = "w-10 h-10", rounded = "rounded-full" }) {
  const avatarUrl = user?.avatarUrl || user?.avatar;
  const name = user?.name || 'User';
  
  if (avatarUrl) {
    return (
      <div className={`${className} ${rounded} overflow-hidden shrink-0 border border-slate-200/50 shadow-sm`}>
        <img 
          src={avatarUrl} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }
  
  // Clean initials fallback with a stable color based on name
  const initials = name.charAt(0).toUpperCase();
  
  // Stable background color selection
  const colors = [
    'bg-[#3b82f6] text-white', // Blue
    'bg-[#10b981] text-white', // Emerald
    'bg-[#f59e0b] text-white', // Amber
    'bg-[#8b5cf6] text-white', // Violet
    'bg-[#ec4899] text-white', // Pink
    'bg-[#ef4444] text-white', // Red
    'bg-[#06b6d4] text-white', // Cyan
  ];
  const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorClass = colors[charCodeSum % colors.length];

  return (
    <div className={`${className} ${rounded} ${colorClass} border border-white/20 flex items-center justify-center font-bold shrink-0 select-none`}>
      {initials}
    </div>
  );
}

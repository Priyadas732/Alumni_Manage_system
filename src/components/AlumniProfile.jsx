import React, { useState, useRef, useEffect } from 'react';

export default function AlumniProfile({ profile, onSave }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    company: profile.company || '',
    role: profile.role || '',
    branch: profile.branch || '',
    linkedin: profile.linkedin || '',
    facebook: profile.facebook || '',
    avatar: profile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  });

  // Toggles state (alumniPreferences)
  const [preferences, setPreferences] = useState({
    availableForReferrals: true,
    availableForMentorship: true
  });

  const fileInputRef = useRef(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('alumniPreferences');
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error('Failed to parse alumni preferences', e);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (key) => {
    const updatedPrefs = {
      ...preferences,
      [key]: !preferences[key]
    };
    setPreferences(updatedPrefs);
    localStorage.setItem('alumniPreferences', JSON.stringify(updatedPrefs));
  };

  const handleAvatarClick = () => {
    if (isEditMode) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setIsEditMode(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-xl p-lg md:p-xl flex flex-col gap-xl">
      
      {/* Header and Avatar */}
      <div className="flex flex-col sm:flex-row items-center gap-lg border-b border-outline-variant/20 pb-lg">
        <div className="relative group shrink-0">
          <div 
            onClick={handleAvatarClick}
            className={`w-28 h-28 rounded-full overflow-hidden border-4 border-tertiary/20 ${
              isEditMode ? 'cursor-pointer hover:brightness-90 transition-all' : ''
            }`}
          >
            <img 
              alt="Profile Avatar" 
              className="w-full h-full object-cover" 
              src={formData.avatar}
            />
          </div>
          {isEditMode && (
            <div 
              onClick={handleAvatarClick}
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white pointer-events-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">photo_camera</span>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            accept="image/*" 
            className="hidden"
          />
        </div>
        
        <div className="text-center sm:text-left flex-1 min-w-0">
          <h2 className="font-headline-lg text-headline-lg text-on-surface truncate font-bold">{formData.name || 'Alumni Profile'}</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/10 text-secondary font-label-md text-xs border border-secondary/20 mt-xs">
            Alumni / Professional
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isEditMode) {
              setFormData({ ...profile });
              setIsEditMode(false);
            } else {
              setIsEditMode(true);
            }
          }}
          className="px-md py-sm border border-outline text-on-surface hover:bg-surface-container rounded-lg font-label-md text-label-md transition-colors cursor-pointer self-center sm:self-start"
        >
          {isEditMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {/* Full Name */}
        <div className="col-span-1 md:col-span-2">
          <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Full Name</label>
          <input
            type="text"
            name="name"
            disabled={!isEditMode}
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md disabled:bg-surface-container-lowest disabled:text-on-surface/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
            placeholder="Priya Sharma"
            required
          />
        </div>

        {/* Current Company */}
        <div className="col-span-1">
          <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Current Company</label>
          <input
            type="text"
            name="company"
            disabled={!isEditMode}
            value={formData.company}
            onChange={handleInputChange}
            className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md disabled:bg-surface-container-lowest disabled:text-on-surface/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
            placeholder="e.g. Google"
            required
          />
        </div>

        {/* Current Role */}
        <div className="col-span-1">
          <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Current Role / Designation</label>
          <input
            type="text"
            name="role"
            disabled={!isEditMode}
            value={formData.role}
            onChange={handleInputChange}
            className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md disabled:bg-surface-container-lowest disabled:text-on-surface/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
            placeholder="e.g. Software Engineer"
            required
          />
        </div>

        {/* Branch / Department */}
        <div className="col-span-1 md:col-span-2">
          <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Branch / Department</label>
          <input
            type="text"
            name="branch"
            disabled={!isEditMode}
            value={formData.branch}
            onChange={handleInputChange}
            className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md disabled:bg-surface-container-lowest disabled:text-on-surface/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
            placeholder="e.g. Computer Science"
            required
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="flex flex-col gap-sm">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs border-b border-outline-variant/10 pb-xs">Social Profiles</h3>
        
        {/* LinkedIn */}
        <div className="flex flex-col gap-xs">
          <label className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant">
            <svg className="w-4 h-4 fill-current text-[#0a66c2]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            LinkedIn URL
          </label>
          <div className="flex items-center gap-md">
            <input
              type="url"
              name="linkedin"
              disabled={!isEditMode}
              value={formData.linkedin}
              onChange={handleInputChange}
              className="flex-1 bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md disabled:bg-surface-container-lowest disabled:text-on-surface/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
              placeholder="https://linkedin.com/in/username"
            />
            {!isEditMode && formData.linkedin && (
              <a 
                href={formData.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-md py-sm bg-primary-container/10 hover:bg-primary-container/20 text-primary border border-primary/20 rounded-lg font-label-md text-label-md flex items-center justify-center gap-xs cursor-pointer whitespace-nowrap"
              >
                Visit <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            )}
          </div>
        </div>

        {/* Facebook */}
        <div className="flex flex-col gap-xs">
          <label className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant">
            <svg className="w-4 h-4 fill-current text-[#1877f2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook URL
          </label>
          <div className="flex items-center gap-md">
            <input
              type="url"
              name="facebook"
              disabled={!isEditMode}
              value={formData.facebook}
              onChange={handleInputChange}
              className="flex-1 bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md disabled:bg-surface-container-lowest disabled:text-on-surface/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
              placeholder="https://facebook.com/username"
            />
            {!isEditMode && formData.facebook && (
              <a 
                href={formData.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-md py-sm bg-primary-container/10 hover:bg-primary-container/20 text-primary border border-primary/20 rounded-lg font-label-md text-label-md flex items-center justify-center gap-xs cursor-pointer whitespace-nowrap"
              >
                Visit <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="flex flex-col gap-md">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs border-b border-outline-variant/10 pb-xs">Preferences & Toggles</h3>
        
        {/* Toggle 1: Available for Referrals */}
        <div className="flex items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-lg">
          <div>
            <div className="font-body-md text-body-md text-on-surface font-semibold mb-[2px]">Available for Referrals</div>
            <div className="font-body-md text-body-md text-sm text-on-surface-variant">I am open to referring students for jobs at my company.</div>
          </div>
          <button 
            type="button"
            onClick={() => handleToggleChange('availableForReferrals')}
            className={`w-11 h-6 rounded-full relative transition-all duration-300 outline-none cursor-pointer flex items-center ${
              preferences.availableForReferrals ? 'bg-[#50c878]' : 'bg-surface-dim'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-[2px] transition-all duration-300 ${
              preferences.availableForReferrals ? 'left-[24px]' : 'left-[2px]'
            }`}></div>
          </button>
        </div>

        {/* Toggle 2: Available for Mentorship */}
        <div className="flex items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-lg">
          <div>
            <div className="font-body-md text-body-md text-on-surface font-semibold mb-[2px]">Available for Mentorship</div>
            <div className="font-body-md text-body-md text-sm text-on-surface-variant">I am open to mentoring students.</div>
          </div>
          <button 
            type="button"
            onClick={() => handleToggleChange('availableForMentorship')}
            className={`w-11 h-6 rounded-full relative transition-all duration-300 outline-none cursor-pointer flex items-center ${
              preferences.availableForMentorship ? 'bg-[#50c878]' : 'bg-surface-dim'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-[2px] transition-all duration-300 ${
              preferences.availableForMentorship ? 'left-[24px]' : 'left-[2px]'
            }`}></div>
          </button>
        </div>
      </div>

      {/* Save Button */}
      {isEditMode && (
        <div className="flex justify-end pt-md border-t border-outline-variant/20 mt-sm">
          <button 
            type="submit"
            className="bg-primary text-on-primary font-label-md text-label-md px-xl py-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-md cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      )}

    </form>
  );
}

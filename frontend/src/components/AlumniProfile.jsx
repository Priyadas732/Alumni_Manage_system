import React, { useState, useEffect } from 'react';

export default function AlumniProfile({ profile, onSave }) {
  // Form states matching the mockup fields
  const [formData, setFormData] = useState({
    name: profile.name || '',
    company: profile.company || '',
    jobTitle: profile.jobTitle || '',
    branch: profile.branch || 'Information Technology', // Mapped to Industry
    location: profile.location || '',
    linkedin: profile.linkedin || '',
    facebook: profile.resumeUrl || profile.facebook || '', // Second link (GitHub/Portfolio)
    openToMentoring: profile.openToMentoring ?? true,
    openToReferrals: profile.openToReferrals ?? false,
    avatar: profile.avatarUrl || profile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  });

  // Track original data to support Discard action
  useEffect(() => {
    setFormData({
      name: profile.name || '',
      company: profile.company || '',
      jobTitle: profile.jobTitle || '',
      branch: profile.branch || 'Information Technology',
      location: profile.location || '',
      linkedin: profile.linkedin || '',
      facebook: profile.resumeUrl || profile.facebook || '',
      openToMentoring: profile.openToMentoring ?? true,
      openToReferrals: profile.openToReferrals ?? false,
      avatar: profile.avatarUrl || profile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    });
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleDiscard = () => {
    setFormData({
      name: profile.name || '',
      company: profile.company || '',
      jobTitle: profile.jobTitle || '',
      branch: profile.branch || 'Information Technology',
      location: profile.location || '',
      linkedin: profile.linkedin || '',
      facebook: profile.resumeUrl || profile.facebook || '',
      openToMentoring: profile.openToMentoring ?? true,
      openToReferrals: profile.openToReferrals ?? false,
      avatar: profile.avatarUrl || profile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map second link to resumeUrl for the database/API updates
    const submissionData = {
      ...formData,
      resumeUrl: formData.facebook
    };
    onSave(submissionData);
  };

  // Calculate profile completeness score dynamically
  const calculateProfileScore = () => {
    let score = 30; // base score for registration
    if (formData.company.trim()) score += 15;
    if (formData.jobTitle.trim()) score += 15;
    if (formData.branch.trim()) score += 10;
    if (formData.location.trim()) score += 10;
    if (formData.linkedin.trim()) score += 10;
    if (formData.facebook.trim()) score += 5;
    if (formData.openToMentoring) score += 2.5;
    if (formData.openToReferrals) score += 2.5;
    return Math.min(Math.round(score), 100);
  };

  const profileScore = calculateProfileScore();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-lg font-sans text-[#2d3748]">
      
      {/* Top Header Section with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md border-b border-slate-200 pb-md">
        <div>
          <span className="text-[#0a58ca] text-xs font-bold uppercase tracking-wider">Alumni Dashboard</span>
          <h1 className="text-3xl font-extrabold text-[#0f2942] tracking-tight mt-[2px]">Manage Your Profile</h1>
          <p className="text-[#718096] text-sm mt-[2px]">Update your information to help students and fellow alumni connect with you.</p>
        </div>
        <div className="flex items-center gap-sm">
          <button 
            type="button" 
            onClick={handleDiscard}
            className="px-xl py-sm bg-white border border-[#cbd5e1] hover:bg-slate-50 text-[#475569] font-bold rounded-lg transition-all text-sm cursor-pointer shadow-sm"
          >
            Discard
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-xl py-sm bg-[#0a58ca] hover:bg-[#084ea6] text-white font-bold rounded-lg transition-all text-sm cursor-pointer shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        
        {/* Left Column - Wider Form Card Area */}
        <div className="lg:col-span-2 space-y-lg">
          
          {/* Card 1: Professional Experience */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-lg space-y-md">
            <div className="flex items-center gap-xs text-[#0f2942] border-b border-slate-100 pb-sm">
              <span className="material-symbols-outlined text-[#0a58ca] text-xl">work</span>
              <h2 className="text-md font-extrabold uppercase tracking-wide">Professional Experience</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-[#718096]">Current Company</label>
                <input 
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Quantum Dynamics Inc."
                  className="w-full px-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-[#718096]">Job Title</label>
                <input 
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Senior Systems Architect"
                  className="w-full px-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-[#718096]">Industry</label>
                <div className="relative">
                  <select 
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full pl-md pr-xl py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm appearance-none"
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                    <option value="Education">Education</option>
                    <option value="Arts & Entertainment">Arts & Entertainment</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-[#718096] pointer-events-none">arrow_drop_down</span>
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-[#718096]">Location</label>
                <input 
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="New York, NY"
                  className="w-full px-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Professional Links */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-lg space-y-md">
            <div className="flex items-center gap-xs text-[#0f2942] border-b border-slate-100 pb-sm">
              <span className="material-symbols-outlined text-[#0a58ca] text-xl">link</span>
              <h2 className="text-md font-extrabold uppercase tracking-wide">Professional Links</h2>
            </div>

            <div className="space-y-sm">
              {/* LinkedIn Link */}
              <div className="flex rounded-lg overflow-hidden border border-[#cbd5e1] focus-within:ring-2 focus-within:ring-[#0a58ca]/20 focus-within:border-[#0a58ca]">
                <div className="bg-[#f1f5f9] border-r border-[#cbd5e1] px-md flex items-center justify-center text-[#475569]">
                  <span className="material-symbols-outlined text-lg">share</span>
                </div>
                <input 
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-md py-sm bg-[#f8fafc] outline-none text-sm"
                />
              </div>

              {/* GitHub / Portfolio Link */}
              <div className="flex rounded-lg overflow-hidden border border-[#cbd5e1] focus-within:ring-2 focus-within:ring-[#0a58ca]/20 focus-within:border-[#0a58ca]">
                <div className="bg-[#f1f5f9] border-r border-[#cbd5e1] px-md flex items-center justify-center text-[#475569]">
                  <span className="material-symbols-outlined text-lg">code</span>
                </div>
                <input 
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="github.com/username"
                  className="w-full px-md py-sm bg-[#f8fafc] outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Privacy Settings */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-lg space-y-md">
            <div className="flex items-center gap-xs text-[#0f2942] border-b border-slate-100 pb-sm">
              <span className="material-symbols-outlined text-[#0a58ca] text-xl">visibility</span>
              <h2 className="text-md font-extrabold uppercase tracking-wide">Privacy Settings</h2>
            </div>
            
            <p className="text-xs text-[#718096]">Manage who can see your contact information and career history.</p>

            <div className="flex flex-col gap-xs max-w-md">
              <label className="text-xs font-bold text-[#718096]">Profile Visibility</label>
              <div className="relative">
                <select 
                  className="w-full pl-md pr-xl py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm appearance-none"
                  defaultValue="Public to all verified users"
                >
                  <option>Public to all verified users</option>
                  <option>Only to university students</option>
                  <option>Private</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-[#718096] pointer-events-none">arrow_drop_down</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidemenu / Metadata Info Area */}
        <div className="space-y-lg col-span-1">
          
          {/* Card 1: Availability Toggles */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-lg space-y-lg">
            <h2 className="text-md font-extrabold text-[#0f2942] uppercase tracking-wide border-b border-slate-100 pb-sm">Availability</h2>

            {/* Referrals Toggle */}
            <div className="space-y-xs pb-md border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#2d3748]">Job Referrals</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.openToReferrals}
                    onChange={() => handleToggle('openToReferrals')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a58ca]"></div>
                </label>
              </div>
              <p className="text-xs text-[#718096] leading-relaxed">Accepting referral requests from students.</p>
              <div className="pt-xs">
                <span className={`inline-flex items-center gap-[4px] text-[10px] font-bold tracking-wider px-md py-[2px] rounded-full uppercase ${
                  formData.openToReferrals 
                    ? 'bg-blue-50 text-[#0a58ca]' 
                    : 'bg-[#edf2f7] text-[#718096]'
                }`}>
                  ● {formData.openToReferrals ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>

            {/* Mentorship Toggle */}
            <div className="space-y-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#2d3748]">Mentorship</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.openToMentoring}
                    onChange={() => handleToggle('openToMentoring')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a58ca]"></div>
                </label>
              </div>
              <p className="text-xs text-[#718096] leading-relaxed">Available for career coaching and reviews.</p>
              <div className="pt-xs">
                <span className={`inline-flex items-center gap-[4px] text-[10px] font-bold tracking-wider px-md py-[2px] rounded-full uppercase ${
                  formData.openToMentoring 
                    ? 'bg-blue-50 text-[#0a58ca]' 
                    : 'bg-[#edf2f7] text-[#718096]'
                }`}>
                  ● {formData.openToMentoring ? 'MENTORING ON' : 'MENTORING OFF'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Profile Score */}
          <div className="bg-[#3b82f6] text-white rounded-xl shadow-sm p-lg space-y-md relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="flex justify-between items-center relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Profile Score</span>
              <span className="text-2xl font-black">{profileScore}%</span>
            </div>

            <div className="w-full h-2 bg-blue-700/50 rounded-full overflow-hidden relative z-10">
              <div 
                className="h-full bg-white transition-all duration-500 ease-out" 
                style={{ width: `${profileScore}%` }}
              ></div>
            </div>

            <p className="text-xs text-blue-50 leading-relaxed relative z-10">
              Great job! Add a professional summary to reach 100% and get featured.
            </p>

            <button 
              type="button"
              className="w-full bg-white hover:bg-slate-50 text-[#3b82f6] font-bold py-sm rounded-lg transition-all text-xs cursor-pointer shadow-sm relative z-10"
            >
              Improve Profile
            </button>
          </div>

          {/* Card 3: Recent Interactions */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-lg space-y-md">
            <h2 className="text-md font-extrabold text-[#0f2942] uppercase tracking-wide border-b border-slate-100 pb-sm">Recent Interactions</h2>
            
            <div className="space-y-md text-xs">
              <div className="flex gap-sm items-start">
                <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#475569] shrink-0">
                  <span className="material-symbols-outlined text-md">person</span>
                </div>
                <div>
                  <p className="text-[#2d3748] font-medium leading-relaxed">
                    <strong className="font-bold text-[#0f2942]">Jordan Miller</strong> viewed your profile.
                  </p>
                  <span className="text-[#94a3b8] font-bold text-[10px] uppercase">45 mins ago</span>
                </div>
              </div>

              <div className="flex gap-sm items-start">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0a58ca] shrink-0">
                  <span className="material-symbols-outlined text-md">check_circle</span>
                </div>
                <div>
                  <p className="text-[#2d3748] font-medium leading-relaxed">
                    Referral for <strong className="font-bold text-[#0f2942]">S. Chen</strong> was submitted.
                  </p>
                  <span className="text-[#94a3b8] font-bold text-[10px] uppercase">Yesterday</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

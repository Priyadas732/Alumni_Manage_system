import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api';

export default function RoleSelectionProfileSetup() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null); // 'student' or 'alumnus'
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.name) {
        setFormData(prev => ({ ...prev, name: user.name }));
      }
    }
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    scholarId: '',
    college: '',
    major: '',
    gradYear: '',
    linkedin: '',
    company: '',
    jobTitle: '',
    location: '',
    branch: '',
    openToMentoring: true,
    openToReferrals: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem('userRole', selectedRole === 'student' ? 'student' : 'alumni');
  };

  const handleContinue = () => {
    if (role) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleCompleteSetup = async (e) => {
    e.preventDefault();
    try {
      let profileData;
      if (role === 'student') {
        profileData = {
          role: 'STUDENT',
          name: formData.name,
          scholarId: formData.scholarId || `SCH-2025-${Math.floor(1000 + Math.random() * 9000)}`,
          college: formData.college,
          branch: formData.major,
          gradYear: formData.gradYear,
          linkedin: formData.linkedin,
          facebook: '',
          leetcode: '',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          resumeUrl: null
        };
      } else {
        profileData = {
          role: 'ALUMNI',
          name: formData.name,
          company: formData.company,
          jobTitle: formData.jobTitle,
          location: formData.location,
          branch: formData.branch || 'Computer Science',
          linkedin: formData.linkedin,
          facebook: '',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          openToMentoring: formData.openToMentoring,
          openToReferrals: formData.openToReferrals
        };
      }
      
      const data = await userAPI.updateProfile(profileData);
      
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...localUser, ...data.user }));
      localStorage.setItem('userRole', role === 'student' ? 'student' : 'alumni');
      
      navigate('/hub');
    } catch (err) {
      alert("Error saving profile: " + err.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-gutter relative bg-background font-body-md text-on-background">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none -z-10"></div>
      
      <main className="w-full max-w-3xl relative">
        {/* Main Form Container */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant overflow-hidden relative z-10 transition-all duration-500">
          
          {/* Progress Indicator */}
          <div className="h-1.5 w-full bg-surface-container-high">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: step === 1 ? '50%' : '100%' }}
            ></div>
          </div>

          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <section className="p-xl flex flex-col gap-xl">
              <header className="text-center mb-md animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container/20 mb-margin">
                  <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Welcome to AlumniConnect</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">
                  Select your primary role to tailor your experience within the network.
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-margin">
                {/* Role Card: Student */}
                <button 
                  className={`role-card text-left p-margin rounded-xl border-2 bg-surface-container-low hover:bg-surface-container transition-all duration-300 flex flex-col gap-md relative overflow-hidden outline-none cursor-pointer ${
                    role === 'student' 
                      ? 'border-primary shadow-lg ring-1 ring-primary' 
                      : 'border-outline-variant hover:border-primary/50'
                  }`}
                  onClick={() => handleRoleSelect('student')}
                  type="button"
                >
                  {role === 'student' && (
                    <div className="absolute top-0 right-0 p-md">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                    role === 'student' ? 'bg-primary/20' : 'bg-surface-container-high'
                  }`}>
                    <span className={`material-symbols-outlined text-2xl ${
                      role === 'student' ? 'text-primary' : 'text-on-surface-variant'
                    }`} style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                  </div>
                  <div>
                    <h2 className={`font-headline-md text-headline-md text-on-surface mb-xs font-semibold ${
                      role === 'student' ? 'text-primary' : ''
                    }`}>Current Student</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Connect with alumni, seek mentorship, and explore early career opportunities.</p>
                  </div>
                </button>

                {/* Role Card: Alumnus */}
                <button 
                  className={`role-card text-left p-margin rounded-xl border-2 bg-surface-container-low hover:bg-surface-container transition-all duration-300 flex flex-col gap-md relative overflow-hidden outline-none cursor-pointer ${
                    role === 'alumnus' 
                      ? 'border-tertiary shadow-lg ring-1 ring-tertiary' 
                      : 'border-outline-variant hover:border-tertiary/50'
                  }`}
                  onClick={() => handleRoleSelect('alumnus')}
                  type="button"
                >
                  {role === 'alumnus' && (
                    <div className="absolute top-0 right-0 p-md">
                      <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                    role === 'alumnus' ? 'bg-tertiary/20' : 'bg-surface-container-high'
                  }`}>
                    <span className={`material-symbols-outlined text-2xl ${
                      role === 'alumnus' ? 'text-tertiary' : 'text-on-surface-variant'
                    }`} style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
                  </div>
                  <div>
                    <h2 className={`font-headline-md text-headline-md text-on-surface mb-xs font-semibold ${
                      role === 'alumnus' ? 'text-tertiary' : ''
                    }`}>Alumnus / Pro</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Give back to the community, mentor students, and network with fellow professionals.</p>
                  </div>
                </button>
              </div>

              <footer className="flex justify-end pt-md border-t border-outline-variant/30 mt-sm">
                <button 
                  className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg transition-all duration-200 disabled:bg-surface-dim disabled:text-on-surface-variant/50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98] shadow-md cursor-pointer"
                  disabled={!role}
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </footer>
            </section>
          )}

          {/* STEP 2: STUDENT PROFILE SETTINGS */}
          {step === 2 && role === 'student' && (
            <form onSubmit={handleCompleteSetup} className="p-xl flex flex-col gap-margin animate-fade-in">
              <header className="flex items-center gap-md mb-md">
                <button 
                  type="button"
                  className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors text-on-surface-variant cursor-pointer" 
                  onClick={handleBack}
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Student Profile</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Tell us about your academic journey.</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-margin">
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Full Name *</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="e.g., Alex Carter" 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Scholar ID *</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="e.g., 2021CS001" 
                    type="text"
                    name="scholarId"
                    value={formData.scholarId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">College / University *</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="e.g., Ember State University" 
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Branch / Major *</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="e.g., Computer Science" 
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Graduation Batch (Year) *</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="e.g., 2025" 
                    type="text"
                    name="gradYear"
                    value={formData.gradYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">LinkedIn URL</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="https://linkedin.com/in/username" 
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Specific Requirement: Prominent Upgrade Button */}
              <div className="mt-md bg-secondary-container/20 border border-secondary-container/50 rounded-xl p-margin flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#185e81_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-5 pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="font-headline-md text-headline-md text-[18px] text-on-secondary-container flex items-center gap-sm mb-xs font-semibold">
                    <span className="material-symbols-outlined text-secondary">workspace_premium</span>
                    Graduating Soon?
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Update your account settings to access professional networking tools.</p>
                </div>
                <button 
                  type="button" 
                  className="relative z-10 whitespace-nowrap bg-secondary text-on-secondary font-label-md text-label-md px-margin py-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                >
                  Upgrade to Alumnus ID
                </button>
              </div>

              <footer className="flex justify-end pt-md border-t border-outline-variant/30 mt-sm">
                <button 
                  type="submit"
                  className="bg-primary text-on-primary font-label-md text-label-md px-xl py-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-md cursor-pointer"
                >
                  Complete Setup
                </button>
              </footer>
            </form>
          )}

          {/* STEP 2: ALUMNUS PROFILE SETTINGS */}
          {step === 2 && role === 'alumnus' && (
            <form onSubmit={handleCompleteSetup} className="p-xl flex flex-col gap-margin animate-fade-in">
              <header className="flex items-center gap-md mb-md">
                <button 
                  type="button"
                  className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors text-on-surface-variant cursor-pointer" 
                  onClick={handleBack}
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Professional Profile</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Share your career details to connect with peers.</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-margin">
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Full Name *</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="e.g., Jordan Rivera" 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Current Company *</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="e.g., Acme Corp" 
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Job Title *</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="e.g., Senior Designer" 
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Location *</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="e.g., San Francisco, CA" 
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Branch / Department *</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="e.g., Computer Science" 
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">LinkedIn URL</label>
                  <input 
                    className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all font-body-md" 
                    placeholder="https://linkedin.com/in/username" 
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <hr className="border-outline-variant my-sm"/>

              <div className="flex flex-col gap-md">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Community Preferences</h3>
                
                {/* Toggle 1 */}
                <label className="flex items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
                  <div>
                    <div className="font-body-md text-body-md text-on-surface font-medium mb-[2px]">Open to Mentoring</div>
                    <div className="font-body-md text-body-md text-sm text-on-surface-variant">Allow students to reach out for career advice.</div>
                  </div>
                  <div className="relative">
                    <input 
                      className="sr-only peer" 
                      type="checkbox"
                      name="openToMentoring"
                      checked={formData.openToMentoring}
                      onChange={handleInputChange}
                    />
                    <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </label>

                {/* Toggle 2 */}
                <label className="flex items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
                  <div>
                    <div className="font-body-md text-body-md text-on-surface font-medium mb-[2px]">Open to Providing Referrals</div>
                    <div className="font-body-md text-body-md text-sm text-on-surface-variant">Help candidates get noticed at your company.</div>
                  </div>
                  <div className="relative">
                    <input 
                      className="sr-only peer" 
                      type="checkbox"
                      name="openToReferrals"
                      checked={formData.openToReferrals}
                      onChange={handleInputChange}
                    />
                    <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </label>
              </div>

              <footer className="flex justify-end pt-md border-t border-outline-variant mt-sm">
                <button 
                  type="submit"
                  className="bg-primary text-on-primary font-label-md text-label-md px-xl py-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-colors shadow-md cursor-pointer"
                >
                  Complete Setup
                </button>
              </footer>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}

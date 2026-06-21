import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../api';

export default function StudentAccountCreation() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states matching the mockup screenshot
  const [formData, setFormData] = useState({
    // Step 1 Fields
    name: '',
    scholarId: '',
    college: '',
    branch: '',
    gradYear: '',
    avatarUrl: '',
    linkedin: '',
    facebook: '',
    leetcode: '',
    resumeUrl: '',

    // Step 2 Fields (Skills & Bio)
    skills: '',
    bio: '',

    // Step 3 Fields
    terms: false
  });

  const stepLabels = ['Academic Details', 'Skills & Bio', 'Terms & Review'];
  const stepsCount = 3;

  // Protect route: must be logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) {
      navigate('/login?tab=register&role=student');
    } else if (localUser && localUser.name) {
      // Pre-populate name if available from signup
      setFormData(prev => ({
        ...prev,
        name: prev.name || localUser.name
      }));
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    setError('');
    // Step 1 Validation
    if (currentStepIndex === 0) {
      if (!formData.name.trim() || !formData.scholarId.trim() || !formData.college.trim() || !formData.branch.trim() || !formData.gradYear) {
        setError('Please fill out all required academic details (Full Name, Scholar ID, College, Branch, Graduation Year).');
        return;
      }
      if (!formData.linkedin.trim()) {
        setError('LinkedIn Profile URL is required.');
        return;
      }
    }
    // Step 2 Validation
    if (currentStepIndex === 1) {
      if (!formData.skills.trim()) {
        setError('Please specify at least one skill or area of interest.');
        return;
      }
    }
    
    if (currentStepIndex < stepsCount - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Step 3 Validation
    if (!formData.terms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      const profileData = {
        name: formData.name,
        scholarId: formData.scholarId,
        college: formData.college,
        branch: formData.branch,
        gradYear: formData.gradYear,
        avatarUrl: formData.avatarUrl || null,
        linkedin: formData.linkedin,
        resumeUrl: formData.resumeUrl || null // Resume Link
      };

      const profileResponse = await userAPI.updateProfile(profileData);

      // Update stored user details
      localStorage.setItem('user', JSON.stringify({ ...localUser, ...profileResponse.user }));

      // Dispatch event to update avatar/details in headers/Sidebars
      window.dispatchEvent(new Event('profileUpdated'));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentStepIndex + 1) / stepsCount) * 100;

  return (
    <div className="bg-[#edf8fc] min-h-screen flex flex-col font-sans text-[#2d3748] relative select-none">
      {/* Background Gradient Shapes */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0f9ff] via-[#edfcfd]/30 to-[#fdfdfd] z-0 pointer-events-none"></div>

      {/* Main card area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-md md:p-xl my-lg">
        {/* Header Branding (Centered) */}
        <header className="text-center mb-xl">
          <div className="flex flex-col items-center gap-xs mb-xs">
            <span className="material-symbols-outlined text-[#0a58ca] text-5xl font-bold">school</span>
            <span className="font-sans text-3xl font-extrabold text-[#0a58ca] tracking-tight">AlumniConnect</span>
          </div>
          <p className="text-[#718096] text-sm font-medium">Join our global network of future leaders.</p>
        </header>

        {/* Form Container */}
        <div className="w-full max-w-[760px] bg-white rounded-2xl border border-[#e2e8f0] shadow-xl p-lg md:p-xl">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-sm">
            <span className="text-xs font-bold text-[#0a58ca] uppercase tracking-wider">
              STEP {currentStepIndex + 1}: {stepLabels[currentStepIndex].toUpperCase()}
            </span>
            <span className="text-[#718096] text-xs font-bold uppercase tracking-wider">
              {Math.round(progress)}% COMPLETE
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full h-1 bg-[#edf2f7] rounded-full overflow-hidden mb-xl">
            <div 
              className="h-full bg-[#0a58ca] transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm text-center mb-md bg-red-50 border border-red-200 rounded-lg py-sm px-md">
              {error}
            </p>
          )}

          <form className="space-y-xl" onSubmit={handleSubmit}>

            {/* STEP 1: Academic details (Matching mockup screen exactly) */}
            {currentStepIndex === 0 && (
              <div className="space-y-lg animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-[#0f2942]">Profile Setup</h2>
                  <p className="text-[#718096] text-sm">Complete your student profile to connect with the alumni network.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Full Name */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">Full Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[#718096] text-lg">person</span>
                      <input 
                        name="name"
                        className="w-full pl-xl pr-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                        type="text"
                      />
                    </div>
                  </div>

                  {/* Scholar ID */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">Scholar ID</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[#718096] text-lg">badge</span>
                      <input 
                        name="scholarId"
                        className="w-full pl-xl pr-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="e.g. SCH-2024-001"
                        value={formData.scholarId}
                        onChange={handleInputChange}
                        required 
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* College */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">College</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[#718096] text-lg">school</span>
                      <input 
                        name="college"
                        className="w-full pl-xl pr-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="e.g. Stanford University"
                        value={formData.college}
                        onChange={handleInputChange}
                        required 
                        type="text"
                      />
                    </div>
                  </div>

                  {/* Branch */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">Branch</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[#718096] text-lg">auto_stories</span>
                      <input 
                        name="branch"
                        className="w-full pl-xl pr-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="e.g. Computer Science"
                        value={formData.branch}
                        onChange={handleInputChange}
                        required 
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Graduation Year */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">Graduation Year</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[#718096] text-lg">calendar_today</span>
                      <select 
                        name="gradYear"
                        className="w-full pl-xl pr-xl py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm appearance-none"
                        value={formData.gradYear}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                        <option value="2030">2030</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-[#718096] pointer-events-none">arrow_drop_down</span>
                    </div>
                  </div>

                  {/* Avatar URL */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">Avatar URL</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[#718096] text-lg">image</span>
                      <input 
                        name="avatarUrl"
                        className="w-full pl-xl pr-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="https://example.com/avatar.jpg"
                        value={formData.avatarUrl}
                        onChange={handleInputChange}
                        type="url"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* LinkedIn URL */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">LinkedIn URL</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[#718096] text-lg">link</span>
                      <input 
                        name="linkedin"
                        className="w-full pl-xl pr-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="linkedin.com/in/username"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        required
                        type="text"
                      />
                    </div>
                  </div>

                  {/* Facebook URL */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">Facebook URL</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[#718096] text-lg">share</span>
                      <input 
                        name="facebook"
                        className="w-full pl-xl pr-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="facebook.com/username"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* LeetCode Profile */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">LeetCode Profile</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[#718096] text-lg">code</span>
                      <input 
                        name="leetcode"
                        className="w-full pl-xl pr-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="leetcode.com/username"
                        value={formData.leetcode}
                        onChange={handleInputChange}
                        type="text"
                      />
                    </div>
                  </div>

                  {/* Resume Link */}
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">Resume Link (Optional)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[#718096] text-lg">description</span>
                      <input 
                        name="resumeUrl"
                        className="w-full pl-xl pr-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="link to your PDF resume"
                        value={formData.resumeUrl}
                        onChange={handleInputChange}
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Skills & Bio */}
            {currentStepIndex === 1 && (
              <div className="space-y-md animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-[#2d3748]">Skills &amp; Interests</h2>
                  <p className="text-[#718096] text-sm">Help us understand your areas of expertise so we can pair you with correct alumni mentors.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">Skills (Comma Separated) *</label>
                    <input 
                      name="skills"
                      className="w-full px-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                      placeholder="e.g. React, Node.js, Python, Figma"
                      value={formData.skills}
                      onChange={handleInputChange}
                      required 
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] pl-xs">Brief Bio / About Me</label>
                    <textarea 
                      name="bio"
                      className="w-full px-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm h-32 resize-none"
                      placeholder="Write a brief intro about yourself..."
                      value={formData.bio}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Verification & Agreement */}
            {currentStepIndex === 2 && (
              <div className="space-y-md animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-[#2d3748]">Verification &amp; Agreement</h2>
                  <p className="text-[#718096] text-sm">Please review your details and complete your profile setup.</p>
                </div>

                <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-md space-y-sm text-sm">
                  <div className="flex justify-between border-b border-slate-200 pb-xs">
                    <span className="font-bold text-[#718096]">Full Name:</span>
                    <span>{formData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-xs">
                    <span className="font-bold text-[#718096]">Scholar ID:</span>
                    <span>{formData.scholarId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-xs">
                    <span className="font-bold text-[#718096]">University:</span>
                    <span>{formData.college}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-xs">
                    <span className="font-bold text-[#718096]">Branch:</span>
                    <span>{formData.branch}</span>
                  </div>
                  <div className="flex justify-between pb-xs">
                    <span className="font-bold text-[#718096]">Graduation:</span>
                    <span>{formData.gradYear}</span>
                  </div>
                </div>

                <div className="flex items-start gap-sm mt-sm">
                  <input 
                    name="terms"
                    className="mt-xs rounded border-outline-variant text-[#0a58ca] focus:ring-[#0a58ca]" 
                    id="terms" 
                    checked={formData.terms}
                    onChange={handleInputChange}
                    required 
                    type="checkbox"
                  />
                  <label className="text-sm text-[#4a5568]" htmlFor="terms">
                    I agree to the AlumniConnect <a className="text-[#0a58ca] font-bold hover:underline" href="#">Terms of Service</a> and <a className="text-[#0a58ca] font-bold hover:underline" href="#">Privacy Policy</a>.
                  </label>
                </div>
              </div>
            )}

            {/* Stepper Navigation Actions */}
            <div className="flex items-center justify-between pt-lg border-t border-[#edf2f7]">
              {currentStepIndex > 0 ? (
                <button 
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-xs px-md py-sm text-[#0a58ca] font-bold hover:bg-[#edf2f7] transition-all rounded-lg text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back
                </button>
              ) : (
                <div />
              )}
              
              {currentStepIndex < stepsCount - 1 ? (
                <button 
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-xs px-xl py-sm bg-[#0a58ca] text-white font-bold rounded-lg shadow-sm hover:bg-[#084ea6] transition-all text-sm ml-auto cursor-pointer"
                >
                  Continue
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-xs px-xl py-sm bg-[#0a58ca] text-white font-bold rounded-lg shadow-sm hover:bg-[#084ea6] disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm ml-auto cursor-pointer"
                >
                  {loading ? 'Processing...' : 'Complete Profile'}
                  {!loading && <span className="material-symbols-outlined text-lg">check_circle</span>}
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Footer help link */}
        <footer className="mt-xl text-center">
          <p className="text-sm text-[#718096]">
            Already have an account? <Link className="text-[#0a58ca] font-bold hover:underline" to="/login?tab=login">Sign In</Link>
          </p>
        </footer>
      </main>

      {/* Footer bar */}
      <footer className="w-full text-center py-md text-xs text-[#718096] border-t border-[#e2e8f0]/40 relative z-10 bg-white/20">
        © 2024 AlumniConnect Global Network. All rights reserved.
      </footer>
    </div>
  );
}

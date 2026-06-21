import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../api';

export default function AlumniAccountCreation() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    // Step 1: Professional, Social, and Preferences
    company: '',
    jobTitle: '',
    industry: 'Information Technology',
    location: '',
    linkedin: '',
    facebook: '',
    openToMentoring: true,
    openToReferrals: false,
    
    // Step 2: Academic history
    college: '',
    major: '',
    gradYear: '',

    // Step 3: Terms
    terms: false
  });

  const stepLabels = ['Professional Profile', 'Academic Details', 'Terms & Review'];
  const stepsCount = 3;

  // Protect route: must be logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login?tab=register&role=alumni');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleNext = () => {
    setError('');
    // Step 1 Validation
    if (currentStepIndex === 0) {
      if (!formData.company.trim() || !formData.jobTitle.trim() || !formData.location.trim()) {
        setError('Please fill out all professional details.');
        return;
      }
      if (!formData.linkedin.trim()) {
        setError('LinkedIn profile URL is required.');
        return;
      }
    }
    // Step 2 Validation
    if (currentStepIndex === 1) {
      if (!formData.college.trim() || !formData.major.trim() || !formData.gradYear) {
        setError('Please fill out all academic details.');
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
      // Update Alumni Profile details in Database
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      const profileData = {
        name: localUser.name,
        company: formData.company,
        jobTitle: formData.jobTitle,
        location: formData.location,
        branch: formData.industry, // Map industry to branch
        openToMentoring: formData.openToMentoring,
        openToReferrals: formData.openToReferrals,
        linkedin: formData.linkedin,
        college: formData.college,
        gradYear: formData.gradYear
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

      {/* Header bar */}
      <header className="relative z-10 w-full px-xl py-md bg-white/70 backdrop-blur-md border-b border-[#e2e8f0] flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-xs cursor-pointer">
          <span className="material-symbols-outlined text-[#0a58ca] text-3xl font-bold">school</span>
          <span className="font-sans text-xl font-bold text-[#0a58ca] tracking-tight">AlumniConnect</span>
        </Link>
        <div className="flex items-center gap-xs">
          <span className="text-[#718096] text-sm">Already have an account?</span>
          <Link to="/login?tab=login" className="text-[#0a58ca] text-sm font-bold hover:underline">Log In</Link>
        </div>
      </header>

      {/* Main card area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-md md:p-xl">
        <div className="w-full max-w-[760px] bg-white rounded-2xl border border-[#e2e8f0] shadow-xl p-lg md:p-xl">
          
          {/* Join the Network Stepper Header */}
          <div className="flex items-center justify-between mb-md">
            <h1 className="text-2xl font-bold text-[#0f2942]">Join the Network</h1>
            <span className="bg-[#edf2f7] text-[#4a5568] font-bold text-xs px-md py-xs rounded-full uppercase tracking-wider">
              Step {currentStepIndex + 1} of {stepsCount}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full h-2.5 bg-[#edf2f7] rounded-full overflow-hidden mb-xl">
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

            {/* STEP 1: Professional Profile, Social Links, Preferences */}
            {currentStepIndex === 0 && (
              <div className="space-y-lg animate-fade-in">
                
                {/* Section 1: Professional Profile */}
                <div className="space-y-md">
                  <div>
                    <h2 className="text-lg font-bold text-[#2d3748]">Professional Profile</h2>
                    <p className="text-[#718096] text-sm">Tell us what you've been up to since graduation.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="flex flex-col gap-xs">
                      <label className="text-xs font-bold text-[#718096] tracking-wide uppercase pl-xs">Current Company *</label>
                      <input 
                        name="company"
                        className="w-full px-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="e.g. Skyline Tech Solutions"
                        value={formData.company}
                        onChange={handleInputChange}
                        required 
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="text-xs font-bold text-[#718096] tracking-wide uppercase pl-xs">Job Title *</label>
                      <input 
                        name="jobTitle"
                        className="w-full px-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="e.g. Senior Systems Architect"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        required 
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="flex flex-col gap-xs">
                      <label className="text-xs font-bold text-[#718096] tracking-wide uppercase pl-xs">Industry *</label>
                      <div className="relative">
                        <select 
                          name="industry"
                          className="w-full pl-md pr-xl py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm appearance-none"
                          value={formData.industry}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Information Technology">Information Technology</option>
                          <option value="Financial Services">Financial Services</option>
                          <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                          <option value="Education">Education</option>
                          <option value="Arts & Entertainment">Arts & Entertainment</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-[#718096] pointer-events-none">arrow_drop_down</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="text-xs font-bold text-[#718096] tracking-wide uppercase pl-xs">Office Location *</label>
                      <input 
                        name="location"
                        className="w-full px-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                        placeholder="e.g. San Francisco, CA"
                        value={formData.location}
                        onChange={handleInputChange}
                        required 
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Social Links */}
                <div className="space-y-md pt-md border-t border-[#edf2f7]">
                  <div>
                    <h2 className="text-lg font-bold text-[#2d3748]">Social Links</h2>
                    <p className="text-[#718096] text-sm">Connect your professional and social networks.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="flex flex-col gap-xs">
                      <label className="text-xs font-bold text-[#718096] tracking-wide uppercase pl-xs">LinkedIn Profile (Required) *</label>
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
                    <div className="flex flex-col gap-xs">
                      <label className="text-xs font-bold text-[#718096] tracking-wide uppercase pl-xs">Facebook Profile (Optional)</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[#718096] text-lg">link</span>
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
                </div>

                {/* Section 3: Networking Preferences */}
                <div className="space-y-md pt-md border-t border-[#edf2f7]">
                  <div>
                    <h2 className="text-lg font-bold text-[#2d3748]">Networking Preferences</h2>
                    <p className="text-[#718096] text-sm">Set your availability for the alumni community.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    {/* Mentorship Preference card */}
                    <div 
                      onClick={() => handleToggle('openToMentoring')}
                      className={`flex items-center justify-between p-md border rounded-xl cursor-pointer transition-all ${
                        formData.openToMentoring 
                          ? 'border-[#0a58ca] bg-blue-50/20' 
                          : 'border-[#cbd5e1] bg-[#f8fafc] hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex gap-md items-center pr-sm">
                        <div className="w-10 h-10 rounded-full bg-[#e0effe] flex items-center justify-center text-[#0a58ca] shrink-0">
                          <span className="material-symbols-outlined text-xl">psychology</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#2d3748]">Available for Mentorship</h3>
                          <p className="text-[#718096] text-xs">Allow students to reach out for career guidance.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                        <input 
                          type="checkbox" 
                          checked={formData.openToMentoring}
                          readOnly
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a58ca]"></div>
                      </label>
                    </div>

                    {/* Referrals Preference card */}
                    <div 
                      onClick={() => handleToggle('openToReferrals')}
                      className={`flex items-center justify-between p-md border rounded-xl cursor-pointer transition-all ${
                        formData.openToReferrals 
                          ? 'border-[#0a58ca] bg-blue-50/20' 
                          : 'border-[#cbd5e1] bg-[#f8fafc] hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex gap-md items-center pr-sm">
                        <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#15803d] shrink-0">
                          <span className="material-symbols-outlined text-xl">handshake</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#2d3748]">Open to Job Referrals</h3>
                          <p className="text-[#718096] text-xs">Let students request referrals for open roles.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                        <input 
                          type="checkbox" 
                          checked={formData.openToReferrals}
                          readOnly
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0a58ca]"></div>
                      </label>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: Academic details */}
            {currentStepIndex === 1 && (
              <div className="space-y-md animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-[#2d3748]">Academic Details</h2>
                  <p className="text-[#718096] text-sm">Tell us where you studied and graduated from.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] tracking-wide uppercase pl-xs">University / College studied *</label>
                    <input 
                      name="college"
                      className="w-full px-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                      placeholder="e.g. Stanford University"
                      value={formData.college}
                      onChange={handleInputChange}
                      required 
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] tracking-wide uppercase pl-xs">Major / Branch *</label>
                    <input 
                      name="major"
                      className="w-full px-md py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm"
                      placeholder="e.g. Computer Science"
                      value={formData.major}
                      onChange={handleInputChange}
                      required 
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-xs font-bold text-[#718096] tracking-wide uppercase pl-xs">Graduation Year *</label>
                    <div className="relative">
                      <select 
                        name="gradYear"
                        className="w-full pl-md pr-xl py-sm bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#0a58ca]/20 focus:border-[#0a58ca] outline-none transition-all text-sm appearance-none"
                        value={formData.gradYear}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                        <option value="2015">2015</option>
                        <option value="2010">2010</option>
                        <option value="2005">2005</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-[#718096] pointer-events-none">arrow_drop_down</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Terms and Confirmation */}
            {currentStepIndex === 2 && (
              <div className="space-y-md animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-[#2d3748]">Verification & Agreement</h2>
                  <p className="text-[#718096] text-sm">Please review the details and complete your profile setup.</p>
                </div>

                <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-md space-y-sm text-sm">
                  <div className="flex justify-between border-b border-slate-200 pb-xs">
                    <span className="font-bold text-[#718096]">Company:</span>
                    <span>{formData.company}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-xs">
                    <span className="font-bold text-[#718096]">Job Title:</span>
                    <span>{formData.jobTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-xs">
                    <span className="font-bold text-[#718096]">University:</span>
                    <span>{formData.college}</span>
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
      </main>

      {/* Footer bar */}
      <footer className="w-full text-center py-md text-xs text-[#718096] border-t border-[#e2e8f0]/40 relative z-10 bg-white/20">
        © 2024 AlumniConnect Global Network. All rights reserved.
      </footer>
    </div>
  );
}

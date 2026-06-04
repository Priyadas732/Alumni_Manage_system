import React, { useState, useRef } from 'react';

export default function StudentProfile({ profile, onSave }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    scholarId: profile.scholarId || '',
    college: profile.college || '',
    linkedin: profile.linkedin || '',
    facebook: profile.facebook || '',
    leetcode: profile.leetcode || '',
    avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    resumeName: profile.resumeName || null
  });

  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, resumeName: file.name }));
    }
  };

  const handleRemoveResume = () => {
    setFormData(prev => ({ ...prev, resumeName: null }));
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
            className={`w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 ${
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
          <h2 className="font-headline-lg text-headline-lg text-on-surface truncate font-bold">{formData.name || 'Student Profile'}</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container/10 text-primary font-label-md text-xs border border-primary/20 mt-xs">
            Current Student
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
            placeholder="Rahul Das"
            required
          />
        </div>

        {/* Scholar ID */}
        <div className="col-span-1">
          <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Scholar ID</label>
          <input
            type="text"
            name="scholarId"
            disabled={!isEditMode}
            value={formData.scholarId}
            onChange={handleInputChange}
            className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md disabled:bg-surface-container-lowest disabled:text-on-surface/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
            placeholder="e.g. 2021CS001"
            required
          />
        </div>

        {/* College Name */}
        <div className="col-span-1">
          <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">College Name</label>
          <input
            type="text"
            name="college"
            disabled={!isEditMode}
            value={formData.college}
            onChange={handleInputChange}
            className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md disabled:bg-surface-container-lowest disabled:text-on-surface/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
            placeholder="e.g. NIT Silchar"
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

        {/* LeetCode */}
        <div className="flex flex-col gap-xs">
          <label className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant">
            <svg className="w-4 h-4 fill-current text-[#ffa116]" viewBox="0 0 24 24">
              <path d="M16.102 17.93l-2.69 2.607c-.466.451-1.111.696-1.744.696a2.285 2.285 0 0 1-1.745-.696L4.398 15.28c-.465-.45-.693-1.075-.693-1.686 0-.613.228-1.238.693-1.688l5.524-5.352c.465-.45 1.11-.696 1.745-.696.632 0 1.277.246 1.744.696l2.69 2.607a.754.754 0 0 1 0 1.093.801.801 0 0 1-1.127 0l-2.69-2.607a.782.782 0 0 0-1.127 0l-5.524 5.352a.765.765 0 0 0 0 1.094l5.524 5.352c.313.303.815.303 1.127 0l2.69-2.606a.754.754 0 0 1 1.127 0 .802.802 0 0 1 0 1.093zm3.502-4.148a.754.754 0 0 1 0 1.093l-2.69 2.608a.802.802 0 0 1-1.128 0 .754.754 0 0 1 0-1.093l2.69-2.608a.801.801 0 0 1 1.128 0zM12.43 2.185a.765.765 0 0 1 1.09-.033l8.286 8.03a1.642 1.642 0 0 1 0 2.37l-8.286 8.03a.765.765 0 0 1-1.09-.033.805.805 0 0 1-.03-1.118l8.29-8.033a.074.074 0 0 0 0-.106l-8.29-8.033a.805.805 0 0 1 .03-1.118z"/>
            </svg>
            LeetCode URL
          </label>
          <div className="flex items-center gap-md">
            <input
              type="url"
              name="leetcode"
              disabled={!isEditMode}
              value={formData.leetcode}
              onChange={handleInputChange}
              className="flex-1 bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm px-md disabled:bg-surface-container-lowest disabled:text-on-surface/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
              placeholder="https://leetcode.com/username"
            />
            {!isEditMode && formData.leetcode && (
              <a 
                href={formData.leetcode} 
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

      {/* Resume Section */}
      <div className="flex flex-col gap-sm">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs border-b border-outline-variant/10 pb-xs">Resume Attachment</h3>
        
        <div className="bg-surface-container-low p-md border border-outline-variant/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-md">
          {formData.resumeName ? (
            <>
              <div className="flex items-center gap-md min-w-0">
                <span className="material-symbols-outlined text-primary text-[32px] shrink-0">picture_as_pdf</span>
                <div className="min-w-0">
                  <p className="font-body-md text-body-md text-on-surface font-medium truncate">{formData.resumeName}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Document Uploaded</p>
                </div>
              </div>
              
              <div className="flex items-center gap-sm shrink-0">
                <button 
                  type="button"
                  onClick={() => alert(`Opening resume: ${formData.resumeName}`)}
                  className="px-md py-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/50 rounded-lg font-label-md text-label-md transition-colors cursor-pointer"
                >
                  View Resume
                </button>
                {isEditMode && (
                  <button 
                    type="button"
                    onClick={handleRemoveResume}
                    className="px-md py-sm bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-lg font-label-md text-label-md transition-colors cursor-pointer flex items-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Remove
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-on-surface-variant text-[32px]">upload_file</span>
                <div>
                  <p className="font-body-md text-body-md text-on-surface-variant font-medium">No resume uploaded</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Upload PDF, DOC, DOCX up to 5MB</p>
                </div>
              </div>

              {isEditMode ? (
                <div>
                  <button 
                    type="button"
                    onClick={() => resumeInputRef.current.click()}
                    className="px-md py-sm bg-primary text-on-primary hover:brightness-110 rounded-lg font-label-md text-label-md shadow-sm transition-colors cursor-pointer"
                  >
                    Upload Resume
                  </button>
                  <input 
                    type="file" 
                    ref={resumeInputRef}
                    onChange={handleResumeChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                </div>
              ) : (
                <span className="font-label-md text-label-md text-on-surface-variant italic">Edit profile to upload</span>
              )}
            </>
          )}
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

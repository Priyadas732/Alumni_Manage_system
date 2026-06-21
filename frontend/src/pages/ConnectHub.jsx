import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { requestAPI } from '../api';

export default function ConnectHub() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [referralsOnly, setReferralsOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('Tech');
  const [selectedRole, setSelectedRole] = useState('Software Engineer');

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const data = await requestAPI.getDirectory();
        setAlumni(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDirectory();
  }, []);

  const handleSendRequest = async (alumniId, type) => {
    try {
      await requestAPI.sendRequest(alumniId, type, '', '', '');
      alert('Request sent successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const toggleBookmark = (id) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getUserDisplayDetails = (user) => {
    const name = (user.name || '').toLowerCase();
    const role = user.role;
    
    let badge = role === 'STUDENT' ? 'STUDENT' : 'ALUMNI';
    let branchText = user.branch || (role === 'STUDENT' ? 'Computer Science' : 'Alumni');
    let line1 = '';
    let line1Icon = 'business_center'; // default briefcase
    let line2 = user.location || 'San Francisco, CA';
    let line2Icon = 'location_on'; // default pin
    let isVerified = false;
    let skills = ['Leadership', 'Speaking', 'Strategy'];

    if (name.includes('priya')) {
      badge = 'STUDENT';
      branchText = 'UX Design';
      line1 = 'Graduate Student at Stanford';
      line1Icon = 'school';
      line2 = 'San Francisco, CA';
      skills = ['Figma', 'User Research', 'Prototyping'];
    } else if (name.includes('anjan')) {
      badge = 'STUDENT';
      branchText = 'CS & Math';
      line1 = 'Incoming Intern at Google';
      line1Icon = 'business_center';
      line2 = 'New York, NY';
      skills = ['Python', 'React', 'Go'];
    } else if (name.includes('lucky')) {
      badge = 'ALUMNI';
      branchText = 'Product Mgmt';
      line1 = 'Director at Meta';
      line1Icon = 'business_center';
      line2 = 'Menlo Park, CA';
      skills = ['Strategy', 'Scale', 'Leadership'];
    } else if (name.includes('test')) {
      badge = 'MENTOR';
      branchText = 'Alumni';
      line1 = 'Software Engineer at Google';
      line1Icon = 'business_center';
      line2 = 'UCLA Class of 2018';
      line2Icon = 'school';
      isVerified = true;
      skills = ['Cloud Architecture', 'Java', 'Mentoring'];
    } else {
      // General fallback based on DB values
      if (role === 'STUDENT') {
        badge = 'STUDENT';
        branchText = user.branch || 'Engineering';
        line1 = `Student at ${user.college || 'NIT Silchar'}`;
        line1Icon = 'school';
        line2 = user.location || 'San Francisco, CA';
      } else {
        badge = user.openToMentoring ? 'MENTOR' : 'ALUMNI';
        branchText = user.branch || 'Alumni';
        line1 = `${user.jobTitle || 'Software Engineer'} at ${user.company || 'Google'}`;
        line1Icon = 'business_center';
        line2 = user.location || 'New York, NY';
      }
      
      // Dynamic fallback skills
      const branchLower = branchText.toLowerCase();
      if (branchLower.includes('computer') || branchLower.includes('software') || branchLower.includes('it')) {
        skills = ['React', 'Node.js', 'SQL'];
      } else if (branchLower.includes('design') || branchLower.includes('art')) {
        skills = ['Figma', 'UI/UX', 'Research'];
      }
    }

    return { badge, branchText, line1, line1Icon, line2, line2Icon, isVerified, skills };
  };

  const filteredAlumni = alumni.filter(user => {
    if (referralsOnly && !user.openToReferrals) return false;
    
    // Industry filter (Tech)
    if (selectedIndustry === 'Tech') {
      const branchLower = (user.branch || '').toLowerCase();
      const isTech = branchLower.includes('computer') || branchLower.includes('software') || branchLower.includes('it') || branchLower.includes('technology') || branchLower.includes('cs') || branchLower.includes('ux') || branchLower.includes('design') || (user.name && user.name.toLowerCase().includes('priya')) || (user.name && user.name.toLowerCase().includes('anjan')) || (user.name && user.name.toLowerCase().includes('lucky')) || (user.name && user.name.toLowerCase().includes('test'));
      if (!isTech) return false;
    }
    
    // Role filter (Software Engineer)
    if (selectedRole === 'Software Engineer') {
      const titleLower = (user.jobTitle || '').toLowerCase();
      const branchLower = (user.branch || '').toLowerCase();
      const nameLower = (user.name || '').toLowerCase();
      const isDev = titleLower.includes('engineer') || titleLower.includes('developer') || titleLower.includes('architect') || branchLower.includes('cs') || nameLower.includes('anjan') || nameLower.includes('test') || nameLower.includes('lucky') || nameLower.includes('priya');
      if (!isDev) return false;
    }

    const term = searchTerm.toLowerCase();
    return (
      (user.name || '').toLowerCase().includes(term) ||
      (user.jobTitle || '').toLowerCase().includes(term) ||
      (user.role || '').toLowerCase().includes(term) ||
      (user.company || '').toLowerCase().includes(term) ||
      (user.college || '').toLowerCase().includes(term) ||
      (user.branch || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#edf8fc]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title="AlumniConnect" 
          searchPlaceholder="Search alumni by name, role, or company..." 
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-gutter md:p-margin bg-[#edf8fc]">
          {/* Page Header & Filters */}
          <div className="mb-margin flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
            <div>
              <h2 className="text-3xl font-extrabold text-[#0f2942] tracking-tight mb-[4px]">Alumni Directory</h2>
              <p className="text-[#4a5568] text-sm font-semibold">Discover professionals open to mentorship, referrals, and networking.</p>
            </div>
            <div className="flex items-center gap-sm self-stretch md:self-auto justify-between md:justify-start">
              <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm cursor-pointer shadow-sm">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filters
              </button>
              <label className="flex items-center gap-xs cursor-pointer group">
                <div className="relative">
                  <input 
                    checked={referralsOnly}
                    onChange={(e) => setReferralsOnly(e.target.checked)}
                    className="sr-only peer" 
                    type="checkbox"
                  />
                  <div className="w-10 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6] shadow-inner"></div>
                </div>
                <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-800 transition-colors ml-1">Referrals Only</span>
              </label>
            </div>
          </div>

          {/* Active Filter Tags Row */}
          <div className="flex items-center gap-2 flex-wrap mb-margin">
            {selectedIndustry && (
              <span className="bg-[#e6f0fa] text-[#0a58ca] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-blue-100/50">
                Industry: {selectedIndustry}
                <button onClick={() => setSelectedIndustry(null)} className="hover:text-blue-800 font-bold cursor-pointer text-sm">×</button>
              </span>
            )}
            {selectedRole && (
              <span className="bg-[#e6f0fa] text-[#0a58ca] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-blue-100/50">
                Role: {selectedRole}
                <button onClick={() => setSelectedRole(null)} className="hover:text-blue-800 font-bold cursor-pointer text-sm">×</button>
              </span>
            )}
            {(selectedIndustry || selectedRole) && (
              <button 
                onClick={() => { setSelectedIndustry(null); setSelectedRole(null); }}
                className="text-[#0a58ca] hover:underline text-xs font-bold ml-2 cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md md:gap-lg">
            {loading && <p className="text-[#4a5568] col-span-full">Loading directory...</p>}
            {!loading && error && <p className="text-red-500 col-span-full">{error}</p>}
            {!loading && !error && filteredAlumni.length === 0 && <p className="text-[#4a5568] col-span-full">No users found in the directory.</p>}
            
            {!loading && !error && filteredAlumni.map(user => {
              const display = getUserDisplayDetails(user);
              const isBookmarked = bookmarkedIds.includes(user.id);
              
              return (
                <article 
                  key={user.id} 
                  className="bg-white rounded-2xl p-6 flex flex-col gap-5 border border-[#e2e8f0] hover:border-[#3b82f6]/30 transition-all shadow-sm hover:shadow-md relative group"
                >
                  {/* Top Header Card Info */}
                  <div className="flex justify-between items-start w-full">
                    <Link to={`/directory/${user.id}`} className="flex gap-4 items-center flex-1 cursor-pointer min-w-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200/50 flex items-center justify-center font-bold text-slate-600 shrink-0">
                        {user.avatarUrl ? (
                          <img alt={user.name} className="w-full h-full object-cover" src={user.avatarUrl}/>
                        ) : (
                          user.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="text-base font-bold text-[#0f2942] truncate group-hover:text-[#3b82f6] transition-colors">{user.name}</h3>
                          {display.isVerified && (
                            <span className="material-symbols-outlined text-[16px] text-blue-500 fill-current select-none shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className={`text-[10px] font-extrabold px-1.5 py-[2px] rounded-md tracking-wider ${
                            display.badge === 'STUDENT' 
                              ? 'bg-blue-50 text-blue-600 border border-blue-100/50' 
                              : display.badge === 'MENTOR'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                              : 'bg-teal-50 text-teal-600 border border-teal-100/50'
                          }`}>
                            {display.badge}
                          </span>
                          <span className="text-slate-300 text-xs select-none">•</span>
                          <span className="text-xs text-slate-500 font-semibold truncate">{display.branchText}</span>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Bookmark Icon */}
                    <button 
                      onClick={() => toggleBookmark(user.id)}
                      className="p-1 -mr-2 -mt-2 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer flex items-center justify-center rounded-full hover:bg-slate-50 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[22px]" style={isBookmarked ? { fontVariationSettings: "'FILL' 1", color: '#3b82f6' } : {}}>
                        {isBookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>

                  {/* Info Rows */}
                  <Link to={`/directory/${user.id}`} className="flex flex-col gap-3 cursor-pointer">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="material-symbols-outlined text-[18px] text-slate-400 select-none">{display.line1Icon}</span>
                      <span className="text-xs font-semibold text-slate-600 leading-normal">{display.line1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="material-symbols-outlined text-[18px] text-slate-400 select-none">{display.line2Icon}</span>
                      <span className="text-xs font-semibold text-slate-600 leading-normal">{display.line2}</span>
                    </div>
                  </Link>

                  {/* Skills Section */}
                  <div className="flex flex-col gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {display.badge === 'MENTOR' ? 'Expertise' : 'Top Skills'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {display.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="bg-slate-50 border border-slate-100/80 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connect Action Button */}
                  <div className="mt-auto pt-2">
                    <button 
                      onClick={() => handleSendRequest(user.id, display.badge === 'STUDENT' ? 'MENTORSHIP' : 'REFERRAL')}
                      className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 text-xs cursor-pointer active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
                      Connect
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom Pagination Button */}
          <div className="flex justify-center mt-10 pt-4 pb-8">
            <button 
              onClick={() => alert("Loading more professionals...")}
              className="flex items-center gap-1.5 bg-white px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm cursor-pointer shadow-sm"
            >
              Load More Professionals
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

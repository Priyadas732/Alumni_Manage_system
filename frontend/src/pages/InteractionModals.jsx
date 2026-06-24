import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { requestAPI } from '../api';
import UserAvatar from '../components/UserAvatar';

export default function InteractionModals() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'referral' or null
  const [selectedMember, setSelectedMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [jobLink, setJobLink] = useState('');
  const [fitMessage, setFitMessage] = useState('');

  // Fetch alumni directory on mount
  useEffect(() => {
    requestAPI.getDirectory()
      .then(data => {
        // Only show alumni (they can provide referrals)
        const alumni = (data.users || data || []).filter(u => u.role === 'ALUMNI');
        setMembers(alumni);
      })
      .catch(err => console.error('Failed to load directory:', err))
      .finally(() => setLoading(false));
  }, []);

  const openReferralModal = (member) => {
    setSelectedMember(member);
    setActiveModal('referral');
    setJobLink('');
    setFitMessage('');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedMember(null);
  };

  const handleSendReferral = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    setSubmitting(true);
    try {
      await requestAPI.sendRequest(
        selectedMember.id,
        'REFERRAL',
        fitMessage,
        jobLink,
        ''
      );
      alert(`Referral request sent to ${selectedMember.name} successfully!`);
      closeModal();
    } catch (err) {
      alert('Failed to send request: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMembers = members.filter(m =>
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.branch?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden md:pl-64">
        <TopBar
          onMenuClick={() => setIsSidebarOpen(true)}
          title="AlumniConnect"
          showSearch={false}
        />

        <main className="flex-1 overflow-y-auto p-margin relative bg-surface">
          <div className="max-w-5xl mx-auto space-y-xl">

            {/* Header */}
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Interaction Hub</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Search alumni connections to send mentorship or referral requests.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center bg-surface-container-lowest rounded-lg px-md py-sm border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all w-full max-w-2xl">
              <span className="material-symbols-outlined text-on-surface-variant mr-sm">search</span>
              <input
                type="text"
                placeholder="Search by name, role, or company..."
                className="flex-1 min-w-0 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 text-body-md font-body-md outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-surface-container-lowest rounded-xl p-margin border border-outline-variant/30 animate-pulse">
                    <div className="flex gap-md items-center mb-md">
                      <div className="w-14 h-14 rounded-lg bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="flex gap-sm pt-md border-t border-outline-variant/20">
                      <div className="flex-1 h-9 bg-slate-100 rounded-lg" />
                      <div className="flex-1 h-9 bg-slate-200 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Members Grid */}
            {!loading && filteredMembers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {filteredMembers.map(member => (
                  <div key={member.id} className="bg-surface-container-lowest rounded-xl p-margin flex flex-col gap-md border border-outline-variant/30 hover:shadow-md transition-all group relative">
                    <div className="flex gap-md items-center">
                      <UserAvatar user={member} className="w-14 h-14" rounded="rounded-lg" />
                      <div>
                        <h3 className="font-headline-md text-[18px] leading-snug font-bold text-on-surface group-hover:text-primary transition-colors">
                          {member.name}
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          {member.jobTitle || 'Alumni'}
                        </p>
                        <p className="font-label-md text-label-md text-primary mt-xs font-semibold">
                          {member.company || member.branch || 'AlumniConnect'}
                        </p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2 flex-wrap">
                      {member.openToMentoring && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Open to Mentoring
                        </span>
                      )}
                      {member.openToReferrals && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          Open to Referrals
                        </span>
                      )}
                    </div>

                    <div className="mt-xs flex gap-sm border-t border-outline-variant/20 pt-md">
                      <button
                        onClick={() => navigate('/communications')}
                        className="flex-1 border border-outline text-on-surface rounded-lg py-sm font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-center gap-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        Message
                      </button>
                      <button
                        onClick={() => openReferralModal(member)}
                        disabled={!member.openToReferrals}
                        className={`flex-1 rounded-lg py-sm font-label-md text-label-md transition-all font-medium cursor-pointer flex items-center justify-center gap-xs ${
                          member.openToReferrals
                            ? 'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-sm'
                            : 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed border border-outline-variant/20'
                        }`}
                      >
                        Request Referral
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredMembers.length === 0 && (
              <div className="text-center p-xl bg-surface-container-lowest border border-outline-variant/30 rounded-xl max-w-xl">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-sm block">
                  {members.length === 0 ? 'group_off' : 'search_off'}
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">
                  {members.length === 0 ? 'No Alumni Found' : 'No Matches Found'}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {members.length === 0
                    ? 'There are no alumni in the directory yet.'
                    : 'Try adjusting your search keywords.'}
                </p>
              </div>
            )}
          </div>

          {/* Referral Request Modal */}
          {activeModal === 'referral' && selectedMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-background/60 backdrop-blur-sm overflow-y-auto">
              <form
                onSubmit={handleSendReferral}
                className="bg-surface-container-lowest rounded-xl shadow-xl flex flex-col border border-outline-variant/30 overflow-hidden w-full max-w-lg"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-lg border-b border-surface-container">
                  <div className="flex items-center gap-sm text-primary">
                    <span className="material-symbols-outlined icon-fill">workspace_premium</span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Formal Referral Request</h2>
                  </div>
                  <button type="button" onClick={closeModal} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Body */}
                <div className="p-lg space-y-lg overflow-y-auto max-h-[70vh]">
                  {/* Target Person */}
                  <div className="flex items-center gap-md bg-surface-container-low p-md rounded-lg border border-outline-variant/20">
                    <UserAvatar user={selectedMember} className="w-10 h-10" />
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold">
                        Requesting referral from {selectedMember.name}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {selectedMember.jobTitle || 'Alumni'} @ {selectedMember.company || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {/* Job Link */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-sm" htmlFor="job-link">
                      Target Job Posting URL *
                    </label>
                    <div className="relative">
                      <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">link</span>
                      <input
                        className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm pr-md pl-[44px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                        id="job-link"
                        placeholder="https://careers.company.com/job..."
                        type="url"
                        value={jobLink}
                        onChange={e => setJobLink(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Why You're a Fit */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-sm" htmlFor="fit-message">
                      Why are you a strong fit for this role? *
                    </label>
                    <textarea
                      className="w-full bg-surface-container-low rounded-lg border border-outline-variant p-md font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                      id="fit-message"
                      placeholder="Highlight key skills and experiences..."
                      rows="4"
                      maxLength={500}
                      value={fitMessage}
                      onChange={e => setFitMessage(e.target.value)}
                      required
                    />
                    <p className="font-label-md text-label-md text-on-surface-variant mt-xs text-right">
                      {fitMessage.length} / 500
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-lg border-t border-surface-container flex justify-between items-center bg-surface-container-low/50">
                  <p className="font-label-md text-label-md text-on-surface-variant flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    Request goes to {selectedMember.name}
                  </p>
                  <div className="flex gap-md">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-lg py-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-lg py-sm rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-sm transition-all flex items-center justify-center gap-sm cursor-pointer disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      {submitting ? 'Sending...' : 'Submit Request'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

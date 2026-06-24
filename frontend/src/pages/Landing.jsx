import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';

export default function Landing() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const userName = user?.name || 'User';

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full px-lg py-sm bg-background/80 backdrop-blur-md border-b border-outline-variant/20">
        <div className="flex items-center gap-sm cursor-pointer" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined text-primary text-3xl">hub</span>
          <span className="font-headline-md text-headline-md font-bold text-primary">AlumniConnect</span>
        </div>
        
        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-lg">
          <Link className="font-label-md text-label-md text-primary font-bold transition-all" to="/">Home</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/hub">Directory</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/feed">Feed</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/requests">My Requests</Link>
        </div>

        {/* Auth / Avatar Section */}
        <div className="flex items-center gap-md">
          {isLoggedIn ? (
            <div className="flex items-center gap-md">
              <Link to="/hub" className="hidden sm:inline-flex items-center justify-center bg-primary text-on-primary font-label-md text-label-md px-md py-xs rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all">
                Go to Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center justify-center border border-outline text-on-surface-variant font-label-md text-label-md px-md py-xs rounded-lg hover:bg-surface-container transition-all"
              >
                Log Out
              </button>
              <Link to="/profile">
                <UserAvatar user={user} className="w-10 h-10 border border-outline-variant hover:ring-2 hover:ring-primary/50 transition-all shrink-0" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-sm">
              <span className="hidden sm:inline-block font-label-md text-label-md text-on-surface-variant">Already have an account?</span>
              <Link to="/login?tab=login" className="font-label-md text-label-md font-bold text-primary hover:underline">
                Log In
              </Link>
              <Link to="/login?tab=register" className="bg-primary text-on-primary font-label-md text-label-md px-md py-xs rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-xs rounded-full transition-colors flex items-center justify-center"
          >
            {isMobileMenuOpen ? 'close' : 'menu'}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-margin py-xl lg:py-36 min-h-[600px] flex flex-col items-center justify-center text-center bg-[radial-gradient(circle_at_top_right,#cee5ff_0%,#edfcfc_100%)]">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary-fixed opacity-30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-tertiary-fixed opacity-30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-md px-gutter">
            <span className="inline-block px-md py-xs bg-primary-container text-on-primary-container rounded-full font-label-md text-label-md shadow-sm">
              New: Expert-led career workshops
            </span>
            <h1 className="font-headline-lg text-headline-lg sm:text-5xl md:text-6xl font-extrabold text-primary leading-tight tracking-tight">
              Bridge the gap between <br className="hidden md:block" /> education and career.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              A premium networking ecosystem connecting tomorrow's talent with today's industry leaders. Unlock exclusive mentorships, referrals, and professional growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-md justify-center pt-md">
              {isLoggedIn ? (
                <Link to="/hub" className="bg-primary text-on-primary font-label-md text-label-md px-xl py-md rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-xs">
                  Go to Connect Hub
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              ) : (
                <>
                  <Link to="/login?tab=register" className="bg-primary text-on-primary font-label-md text-label-md px-xl py-md rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-xs">
                    Get Started
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                  <Link to="/login?tab=login" className="border border-primary text-primary font-label-md text-label-md px-xl py-md rounded-lg hover:bg-surface-container transition-all flex items-center justify-center">
                    Explore Network
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Primary User Paths (Cards Section) */}
        <section className="px-margin py-xl max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl px-gutter">
            
            {/* Student Card */}
            <div className="group relative bg-surface-container rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 p-lg flex flex-col justify-between border border-outline-variant/40 h-[420px]">
              <div className="absolute top-0 right-0 p-lg opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-9xl text-primary">school</span>
              </div>
              <div className="relative z-10 space-y-md">
                <div className="w-14 h-14 rounded-lg bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-primary font-bold">Join as a Student</h2>
                <ul className="space-y-sm">
                  <li className="flex items-center gap-sm font-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Find a dedicated industry mentor
                  </li>
                  <li className="flex items-center gap-sm font-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Access exclusive referral opportunities
                  </li>
                  <li className="flex items-center gap-sm font-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Accelerate your professional career growth
                  </li>
                </ul>
              </div>
              <div className="relative z-10 pt-lg">
                <Link to={isLoggedIn ? "/hub" : "/login?tab=register&role=student"} className="w-full inline-flex items-center justify-center bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg group-hover:shadow-lg transition-all active:scale-[0.98]">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Alumnus Card */}
            <div className="group relative bg-secondary-container text-on-secondary-container rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 p-lg flex flex-col justify-between border border-outline-variant/40 h-[420px]">
              <div className="absolute top-0 right-0 p-lg opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-9xl text-on-secondary-container">workspace_premium</span>
              </div>
              <div className="relative z-10 space-y-md">
                <div className="w-14 h-14 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container text-3xl">volunteer_activism</span>
                </div>
                <h2 className="font-headline-md text-headline-md font-bold">Join as an Alumnus</h2>
                <ul className="space-y-sm">
                  <li className="flex items-center gap-sm font-body-md">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Give back to your alma mater
                  </li>
                  <li className="flex items-center gap-sm font-body-md">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Mentor the next generation of leaders
                  </li>
                  <li className="flex items-center gap-sm font-body-md">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Expand your professional senior network
                  </li>
                </ul>
              </div>
              <div className="relative z-10 pt-lg">
                <Link to={isLoggedIn ? "/hub" : "/login?tab=register&role=alumni"} className="w-full inline-flex items-center justify-center bg-secondary text-on-secondary font-label-md text-label-md py-md rounded-lg group-hover:shadow-lg transition-all active:scale-[0.98]">
                  Join Now
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-surface-container-low px-margin py-xl lg:py-24">
          <div className="max-w-7xl mx-auto px-gutter">
            <div className="text-center mb-xl space-y-sm">
              <h2 class="font-headline-lg text-headline-lg text-primary font-bold">How it Works</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">Our streamlined process ensures every connection is meaningful and professional.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              
              {/* Step 1 */}
              <div className="bg-surface p-lg rounded-xl shadow-sm border border-outline-variant/30 space-y-md text-center hover:-translate-y-1 transition-all">
                <div className="w-16 h-16 rounded-full bg-primary-fixed mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">person_add</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Create Profile</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Build a professional profile highlighting your skills, interests, or industry experience.</p>
              </div>

              {/* Step 2 */}
              <div className="bg-surface p-lg rounded-xl shadow-sm border border-outline-variant/30 space-y-md text-center hover:-translate-y-1 transition-all">
                <div className="w-16 h-16 rounded-full bg-secondary-fixed mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-2xl">hub</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Smart Match</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Our smart directory helps match students with mentors based on shared career trajectories.</p>
              </div>

              {/* Step 3 */}
              <div className="bg-surface p-lg rounded-xl shadow-sm border border-outline-variant/30 space-y-md text-center hover:-translate-y-1 transition-all">
                <div className="w-16 h-16 rounded-full bg-tertiary-fixed-dim mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-2xl">handshake</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Connect &amp; Grow</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Schedule virtual coffee chats, request referrals, or engage in mentorship sessions.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-margin py-xl bg-primary text-on-primary">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-around gap-lg text-center">
            <div>
              <div className="text-4xl font-extrabold">12k+</div>
              <div className="font-label-md text-label-md opacity-80 uppercase tracking-widest mt-xs">Active Alumni</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold">45k+</div>
              <div className="font-label-md text-label-md opacity-80 uppercase tracking-widest mt-xs">Student Successes</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold">850+</div>
              <div className="font-label-md text-label-md opacity-80 uppercase tracking-widest mt-xs">Companies Represented</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold">94%</div>
              <div className="font-label-md text-label-md opacity-80 uppercase tracking-widest mt-xs">Satisfaction Rate</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-dim text-on-surface px-margin py-xl border-t border-outline-variant/40 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-xl px-gutter">
          <div className="col-span-1 md:col-span-2 space-y-md">
            <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-3xl">hub</span>
              AlumniConnect
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              The premier gateway for university alumni and students to build meaningful professional relationships that last a lifetime.
            </p>
            <div className="flex gap-md">
              <button className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">public</button>
              <button className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">chat</button>
              <button className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">share</button>
            </div>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold mb-md uppercase tracking-wider">Resources</h4>
            <ul className="space-y-sm font-body-md text-body-md text-on-surface-variant">
              <li><a className="hover:text-primary" href="#">Career Blog</a></li>
              <li><a className="hover:text-primary" href="#">Mentorship Guide</a></li>
              <li><a className="hover:text-primary" href="#">Referral Policy</a></li>
              <li><a className="hover:text-primary" href="#">Events</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold mb-md uppercase tracking-wider">Legal</h4>
            <ul className="space-y-sm font-body-md text-body-md text-on-surface-variant">
              <li><a className="hover:text-primary" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-primary" href="#">Terms of Service</a></li>
              <li><a className="hover:text-primary" href="#">Cookie Policy</a></li>
              <li><a className="hover:text-primary" href="#">University Partners</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-xl pt-lg border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center text-on-surface-variant font-label-md text-label-md px-gutter gap-sm">
          <span>© 2026 AlumniConnect. All rights reserved.</span>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">language</span>
            <span>English (US)</span>
          </div>
        </div>
      </footer>

      {/* Side Navigation Shell (Mobile Menu Drawer) */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
        >
          <aside 
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-full w-64 flex flex-col p-md border-l border-outline-variant/30 bg-surface-container z-50 animate-slide-in"
          >
            <div className="flex items-center justify-between mb-xl">
              <div className="font-headline-md text-headline-md font-extrabold text-primary flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">hub</span>
                AlumniConnect
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-xs text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-variant flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <nav className="flex flex-col gap-md">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-md text-on-surface-variant hover:text-primary px-md py-base font-label-md text-label-md hover:bg-surface-variant rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">home</span> Home
              </Link>
              <Link 
                to="/hub" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-md text-on-surface-variant hover:text-primary px-md py-base font-label-md text-label-md hover:bg-surface-variant rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">group</span> Directory
              </Link>
              <Link 
                to="/feed" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-md text-on-surface-variant hover:text-primary px-md py-base font-label-md text-label-md hover:bg-surface-variant rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">rss_feed</span> Feed
              </Link>
              <Link 
                to="/requests" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-md text-on-surface-variant hover:text-primary px-md py-base font-label-md text-label-md hover:bg-surface-variant rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">handshake</span> My Requests
              </Link>
              <hr className="border-outline-variant/30 my-sm" />
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/hub" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center bg-primary text-on-primary py-sm rounded-lg font-label-md text-label-md shadow-sm"
                  >
                    Go to Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full border border-outline text-on-surface-variant py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login?tab=login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center border border-primary text-primary py-sm rounded-lg font-label-md text-label-md"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/login?tab=register" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center bg-primary text-on-primary py-sm rounded-lg font-label-md text-label-md"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}

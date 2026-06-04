import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GatewayLoginRegister() {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Pre-populate default profile if none exists
    if (!localStorage.getItem('userRole')) {
      localStorage.setItem('userRole', 'student');
    }
    if (!localStorage.getItem('userProfile')) {
      const defaultProfile = {
        name: 'Rahul Das',
        scholarId: 'SCH-2025-4812',
        college: 'NIT Silchar',
        branch: 'Computer Science',
        linkedin: 'https://linkedin.com/in/rahuldas',
        facebook: 'https://facebook.com/rahuldas',
        leetcode: 'https://leetcode.com/rahuldas',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        resumeName: 'Rahul_Das_Resume.pdf'
      };
      localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
    }
    navigate('/hub');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/setup');
  };

  return (
    <div className="flex min-h-screen w-full bg-background font-body-md text-on-background">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen relative overflow-hidden flex-col justify-between p-xl bg-surface-container-lowest border-r border-outline-variant/30">
        <div className="absolute inset-0 bg-cover bg-center opacity-70 transition-transform duration-1000 hover:scale-105" data-alt="A sophisticated, airy architectural interior shot" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
        
        <div className="relative z-10 flex items-center gap-sm">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined" data-icon="hub">hub</span>
          </div>
          <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">AlumniConnect</h1>
        </div>
        
        <div className="relative z-10 max-w-lg pb-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Bridge the Gap:<br/>Connect, Learn, and Grow.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
            Join a curated network of professionals and peers. Access exclusive opportunities, share knowledge, and build lasting relationships within our secure ecosystem.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 p-gutter sm:p-margin bg-surface-bright relative w-full min-h-screen">
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-lg sm:p-xl shadow-xl relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="text-center mb-xl mt-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">
              {activeTab === 'login' ? 'Welcome Back' : 'Join the Network'}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {activeTab === 'login' ? 'Enter your credentials to access your account.' : 'Create an account to connect with peers.'}
            </p>
          </div>
          
          <div className="flex border-b border-outline-variant/30 mb-xl relative">
            <div 
              className="absolute bottom-[-1px] left-0 h-0.5 bg-primary w-1/2 transition-transform duration-300 ease-out" 
              style={{ transform: activeTab === 'login' ? 'translateX(0%)' : 'translateX(100%)' }}
            ></div>
            <button 
              className={`flex-1 pb-sm font-label-md text-label-md transition-colors hover:bg-surface-container/50 rounded-t-lg ${activeTab === 'login' ? 'text-primary' : 'text-on-surface-variant'}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={`flex-1 pb-sm font-label-md text-label-md transition-colors hover:bg-surface-container/50 rounded-t-lg ${activeTab === 'register' ? 'text-primary' : 'text-on-surface-variant'}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>
          
          <div className="relative">
            {/* Login Form */}
            {activeTab === 'login' && (
              <form 
                className="flex flex-col gap-md transition-opacity duration-300"
                onSubmit={handleLogin}
              >
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant mb-xs block pl-xs">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline pointer-events-none">mail</span>
                    <input className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm pr-md pl-xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all placeholder:text-outline/60 font-body-md" placeholder="name@university.edu" type="email" required />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-xs pl-xs pr-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant">Password</label>
                    <a className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant hover:underline transition-colors" href="#">Forgot?</a>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline pointer-events-none">lock</span>
                    <input className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm pr-md pl-xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all placeholder:text-outline/60 font-body-md" placeholder="••••••••" type="password" required />
                  </div>
                </div>
                <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg mt-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-xs shadow-md shadow-primary/10" type="submit">
                  Sign In
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
            )}
            
            {/* Register Form */}
            {activeTab === 'register' && (
              <form 
                className="flex flex-col gap-md transition-opacity duration-300"
                onSubmit={handleRegister}
              >
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant mb-xs block pl-xs">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline pointer-events-none">person</span>
                    <input className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm pr-md pl-xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all placeholder:text-outline/60 font-body-md" placeholder="Jane Doe" type="text" required />
                  </div>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant mb-xs block pl-xs">University Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline pointer-events-none">school</span>
                    <input className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm pr-md pl-xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all placeholder:text-outline/60 font-body-md" placeholder="name@university.edu" type="email" required />
                  </div>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant mb-xs block pl-xs">Create Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline pointer-events-none">key</span>
                    <input className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg py-sm pr-md pl-xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all placeholder:text-outline/60 font-body-md" placeholder="Strong password" type="password" required />
                  </div>
                </div>
                <button className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-md rounded-lg mt-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-xs shadow-md shadow-secondary/10" type="submit">
                  Create Account
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="mt-lg flex gap-md text-on-surface-variant font-label-md text-label-md">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <span className="text-outline-variant/50">•</span>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

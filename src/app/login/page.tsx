"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Set local storage for UI stat
    localStorage.setItem('isLoggedIn', 'true');
    const userName = data.user?.user_metadata?.full_name || email.split('@')[0] || 'User';
    localStorage.setItem('userName', userName);
    
    // Redirect logic - langsung ke menu
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect') || '/menu';
    router.push(redirectUrl);
  };

  return (
    <div style={{
      backgroundColor: '#2C1B18',
      backgroundImage: 'radial-gradient(rgba(245, 230, 202, 0.05) 2px, transparent 2px)',
      backgroundSize: '30px 30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      margin: 0,
      padding: '1.5rem',
      boxSizing: 'border-box'
    }}>
      <div className="w-full max-w-[440px] animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 font-serif text-3xl font-bold text-[#F5E6CA] mb-2">
            Cat Caffe 
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#C69C6D]">
              <path d="M12 18c-2.21 0-4-1.79-4-4 0-1.66.68-3.21 1.76-4.24C10.83 8.72 11.4 8.5 12 8.5s1.17.22 1.76.76C14.84 10.29 15.52 11.34 15.52 14c0 2.21-1.57 4-3.52 4zM7.5 12.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z M16.5 12.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
              <path d="M9 7.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z M15 7.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
            </svg>
          </div>
          <p className="text-[#D4A373] text-[0.95rem] m-0">Welcome back to your favorite spot</p>
        </div>

        <div className="bg-[#F5E6CA] rounded-[24px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden">
          <form id="loginForm" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="mb-4 bg-red-100 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                {errorMsg}
              </div>
            )}
            <div className="mb-5">
              <label className="flex justify-between text-[0.85rem] font-semibold text-[#1B1B1B] mb-2" htmlFor="username">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  id="username" 
                  className="w-full bg-[#FAF3E0] border-2 border-transparent px-4 py-3.5 rounded-xl font-sans text-[0.95rem] text-[#1B1B1B] box-border transition-all duration-300 focus:outline-none focus:border-[#C69C6D] focus:bg-white placeholder-[#A0A0A0]" 
                  placeholder="hello@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="flex justify-between text-[0.85rem] font-semibold text-[#1B1B1B] mb-2" htmlFor="password">Password</label>
              <div className="relative flex items-center">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  className="w-full bg-[#FAF3E0] border-2 border-transparent px-4 py-3.5 pr-12 rounded-xl font-sans text-[0.95rem] text-[#1B1B1B] box-border transition-all duration-300 focus:outline-none focus:border-[#C69C6D] focus:bg-white placeholder-[#A0A0A0]" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="absolute right-3.5 z-20 bg-transparent border-none cursor-pointer text-[#6D6D6D] p-2 flex items-center transition-colors hover:text-[#1B1B1B]"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? (
                    <svg className="pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg className="pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#C69C6D] hover:bg-[#D4A373] disabled:opacity-50 text-white border-none p-4 rounded-full text-base font-semibold cursor-pointer font-sans transition-all duration-300 flex justify-center items-center gap-2 mt-3 shadow-[0_8px_20px_rgba(198,156,109,0.3)]">
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="text-center mt-6 text-[0.9rem] text-[#6D6D6D]">
            Don't have an account? <Link href="/register" className="text-[#C69C6D] no-underline font-semibold transition-colors hover:text-[#1B1B1B]">Sign Up</Link>
            <br /><br />
            <Link href="/" className="text-[0.8rem] text-[#6D6D6D] no-underline">← Back to Menu</Link>
          </div>

          <svg className="absolute -bottom-[15px] -right-[10px] w-20 h-20 opacity-5 pointer-events-none fill-[#2C1B18]" viewBox="0 0 24 24">
            <path d="M12 18c-2.21 0-4-1.79-4-4 0-1.66.68-3.21 1.76-4.24C10.83 8.72 11.4 8.5 12 8.5s1.17.22 1.76.76C14.84 10.29 15.52 11.34 15.52 14c0 2.21-1.57 4-3.52 4zM7.5 12.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z M16.5 12.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
            <path d="M9 7.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z M15 7.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
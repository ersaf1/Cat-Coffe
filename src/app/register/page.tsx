"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <p className="text-[#D4A373] text-[0.95rem] m-0">Join the coziest coffee experience</p>
        </div>

        <div className="bg-[#F5E6CA] rounded-[24px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden">
          <form id="registerForm">
            
            <div className="mb-5">
              <label className="flex justify-between text-[0.85rem] font-semibold text-[#1B1B1B] mb-2" htmlFor="fullName">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  id="fullName" 
                  className="w-full bg-[#FAF3E0] border-2 border-transparent px-4 py-3.5 rounded-xl font-sans text-[0.95rem] text-[#1B1B1B] box-border transition-all duration-300 focus:outline-none focus:border-[#C69C6D] focus:bg-white placeholder-[#A0A0A0]" 
                  placeholder="John Doe" 
                  required 
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="flex justify-between text-[0.85rem] font-semibold text-[#1B1B1B] mb-2" htmlFor="email">Email / Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  id="email" 
                  className="w-full bg-[#FAF3E0] border-2 border-transparent px-4 py-3.5 rounded-xl font-sans text-[0.95rem] text-[#1B1B1B] box-border transition-all duration-300 focus:outline-none focus:border-[#C69C6D] focus:bg-white placeholder-[#A0A0A0]" 
                  placeholder="hello@example.com" 
                  required 
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="flex justify-between text-[0.85rem] font-semibold text-[#1B1B1B] mb-2" htmlFor="phone">Phone Number (Optional)</label>
              <div className="relative">
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full bg-[#FAF3E0] border-2 border-transparent px-4 py-3.5 rounded-xl font-sans text-[0.95rem] text-[#1B1B1B] box-border transition-all duration-300 focus:outline-none focus:border-[#C69C6D] focus:bg-white placeholder-[#A0A0A0]" 
                  placeholder="+62 812 3456 7890" 
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="flex justify-between text-[0.85rem] font-semibold text-[#1B1B1B] mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  className="w-full bg-[#FAF3E0] border-2 border-transparent px-4 py-3.5 rounded-xl font-sans text-[0.95rem] text-[#1B1B1B] box-border transition-all duration-300 focus:outline-none focus:border-[#C69C6D] focus:bg-white placeholder-[#A0A0A0]" 
                  placeholder="••••••••" 
                  required 
                  minLength={6}
                />
                <button 
                  type="button" 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#6D6D6D] p-0 flex items-center transition-colors hover:text-[#1B1B1B]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-5">
              <label className="flex justify-between text-[0.85rem] font-semibold text-[#1B1B1B] mb-2" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  id="confirmPassword" 
                  className="w-full bg-[#FAF3E0] border-2 border-transparent px-4 py-3.5 rounded-xl font-sans text-[0.95rem] text-[#1B1B1B] box-border transition-all duration-300 focus:outline-none focus:border-[#C69C6D] focus:bg-white placeholder-[#A0A0A0]" 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#6D6D6D] p-0 flex items-center transition-colors hover:text-[#1B1B1B]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#C69C6D] hover:bg-[#D4A373] text-white border-none p-4 rounded-full text-base font-semibold cursor-pointer font-sans transition-all duration-300 flex justify-center items-center gap-2 mt-3 shadow-[0_8px_20px_rgba(198,156,109,0.3)]">
              <span>Create Account</span>
            </button>
          </form>

          <div className="text-center mt-6 text-[0.9rem] text-[#6D6D6D]">
            Already have an account? <Link href="/login" className="text-[#C69C6D] no-underline font-semibold transition-colors hover:text-[#1B1B1B]">Sign In</Link>
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
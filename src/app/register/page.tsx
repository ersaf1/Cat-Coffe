"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { validatePasswordStrength, getPasswordStrength } from '@/lib/password';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  
  const router = useRouter();

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password));
  }, [password]);

  const checkPasswordPwned = async (pwd: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      if (!res.ok) {
        console.warn('Gagal menghubungi HIBP API');
        return false;
      }
      const data = await res.json();
      return data.isLeaked;
    } catch {
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Password dan Konfirmasi Password tidak sama!");
      return;
    }
    
    const validation = validatePasswordStrength(password);
    if (!validation.isValid) {
      setErrorMsg(validation.error || "Password tidak valid");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Pengecekan Pwned Passwords via API Route (aman karena HIBP dipanggil dari /api)
      const isLeaked = await checkPasswordPwned(password);
      if (isLeaked) {
        setLoading(false);
        setErrorMsg("Peringatan: Password ini terlalu umum atau pernah bocor di internet berdasarkan database keamanan global. Silakan gunakan password lain.");
        return;
      }

      console.log("Mencoba registrasi untuk:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });
      console.log("Hasil res API Supabase:", { data, error });

      setLoading(false);

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // Deteksi jika email sudah terdaftar sebelumnya (Supabase mengembalikan identitas kosong untuk cegah enumerasi email)
      if (data?.user?.identities && data.user.identities.length === 0) {
        setErrorMsg("Email ini sudah pernah digunakan atau sedang menunggu konfirmasi! Silakan gunakan email yang lain atau coba Login.");
        return;
      }
      
      setSuccessMsg('Registrasi berhasil! Mengarahkan ke halaman login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      console.error("Fetch error:", error);
      setLoading(false);
      setErrorMsg("Error sistem: " + (error?.message || "Terjadi kesalahan yang tidak diketahui."));
    }
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
          <p className="text-[#D4A373] text-[0.95rem] m-0">Join the coziest coffee experience</p>
        </div>

        <div className="bg-[#F5E6CA] rounded-[24px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden">
          <form id="registerForm" onSubmit={handleRegister}>
            {errorMsg && (
              <div className="mb-4 bg-red-100 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 bg-green-100 text-green-600 text-sm p-4 rounded-lg border border-green-200 font-semibold font-sans text-center shadow-sm">
                {successMsg}
              </div>
            )}
            <div className="mb-5">
              <label className="flex justify-between text-[0.85rem] font-semibold text-[#1B1B1B] mb-2" htmlFor="fullName">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  id="fullName" 
                  className="w-full bg-[#FAF3E0] border-2 border-transparent px-4 py-3.5 rounded-xl font-sans text-[0.95rem] text-[#1B1B1B] box-border transition-all duration-300 focus:outline-none focus:border-[#C69C6D] focus:bg-white placeholder-[#A0A0A0]" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="flex justify-between text-[0.85rem] font-semibold text-[#1B1B1B] mb-2" htmlFor="email">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-[#FAF3E0] border-2 border-transparent px-4 py-3.5 rounded-xl font-sans text-[0.95rem] text-[#1B1B1B] box-border transition-all duration-300 focus:outline-none focus:border-[#C69C6D] focus:bg-white placeholder-[#A0A0A0]" 
                  placeholder="hello@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  required 
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <p className="text-[0.75rem] text-[#6D6D6D] mt-2 mb-0 leading-tight">
                Password harus minimal 8 karakter, serta menggunakan kombinasi <strong className="text-[#1B1B1B]">huruf kapital</strong>, <strong className="text-[#1B1B1B]">huruf kecil</strong>, dan <strong className="text-[#1B1B1B]">angka</strong>.
              </p>
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1 h-1.5 opacity-80">
                    <div className={`flex-1 rounded-full ${passwordStrength === 'weak' ? 'bg-red-400' : passwordStrength === 'medium' ? 'bg-amber-400' : 'bg-green-500'}`}></div>
                    <div className={`flex-1 rounded-full ${(passwordStrength === 'medium' || passwordStrength === 'strong') ? (passwordStrength === 'strong' ? 'bg-green-500' : 'bg-amber-400') : 'bg-gray-200'}`}></div>
                    <div className={`flex-1 rounded-full ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  </div>
                  <span className={`text-[0.7rem] font-bold uppercase tracking-wider ${passwordStrength === 'weak' ? 'text-red-500' : passwordStrength === 'medium' ? 'text-amber-500' : 'text-green-600'}`}>
                    {passwordStrength === 'weak' ? 'Lemah' : passwordStrength === 'medium' ? 'Sedang' : 'Kuat'}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-5">
              <label className="flex justify-between text-[0.85rem] font-semibold text-[#1B1B1B] mb-2" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative flex items-center">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  id="confirmPassword" 
                  className="w-full bg-[#FAF3E0] border-2 border-transparent px-4 py-3.5 pr-12 rounded-xl font-sans text-[0.95rem] text-[#1B1B1B] box-border transition-all duration-300 focus:outline-none focus:border-[#C69C6D] focus:bg-white placeholder-[#A0A0A0]" 
                  placeholder="••••••••" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="absolute right-3.5 z-20 bg-transparent border-none cursor-pointer text-[#6D6D6D] p-2 flex items-center transition-colors hover:text-[#1B1B1B]"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  {showConfirmPassword ? (
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

            <button type="submit" disabled={loading || (password.length > 0 && !validatePasswordStrength(password).isValid)} className="w-full bg-[#C69C6D] hover:bg-[#D4A373] disabled:opacity-50 disabled:cursor-not-allowed text-white border-none p-4 rounded-full text-base font-semibold cursor-pointer font-sans transition-all duration-300 flex justify-center items-center gap-2 mt-3 shadow-[0_8px_20px_rgba(198,156,109,0.3)]">
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
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
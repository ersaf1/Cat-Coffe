'use client';

import React from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Typography Configuration
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// --- REUSABLE COMPONENTS ---

// 1. Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseStyles = "px-8 py-3 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 inline-flex items-center justify-center cursor-pointer";
  
  const variants = {
    primary: "bg-[#2c2c2c] text-[#f5f1eb] hover:bg-black hover:shadow-lg",
    outline: "border-2 border-[#2c2c2c] text-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-[#f5f1eb]",
    ghost: "text-[#2c2c2c] hover:text-[#c8a97e] px-4 py-2"
  };

  return (
    <button type="button" className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// 2. Navbar Component
const Navbar = () => {
  return (
    <nav className="w-full py-6 flex items-center justify-between z-10 relative">
      <Link href="/" className="text-2xl font-bold font-serif tracking-widest text-[#2c2c2c]">
        CAFE
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-wider font-semibold text-[#2c2c2c]">
        <Link href="/" className="text-[#c8a97e] transition-colors duration-300">Home</Link>
        <Link href="/menu" className="hover:text-[#c8a97e] transition-colors duration-300">Menu</Link>
        <Link href="#" className="hover:text-[#c8a97e] transition-colors duration-300">About</Link>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className="relative flex items-center gap-2 px-5 py-2.5 bg-white/40 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-white hover:shadow-sm transition-all duration-300 cursor-pointer">
          <svg className="w-5 h-5 text-[#2c2c2c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-semibold text-[#2c2c2c] text-sm hidden sm:inline-block">Rp 0</span>
        </button>
      </div>
    </nav>
  );
};

// 3. Card Component
interface CardProps {
  title: string;
  description: string;
  image: string;
}

const CategoryCard = ({ title, description, image }: CardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-8">
        <h3 className="font-serif text-2xl font-bold text-[#2c2c2c] mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

// --- MAIN PAGE LAYOUT ---

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className={`min-h-screen bg-[#f5f1eb] ${playfair.variable} ${inter.variable} font-sans text-[#2c2c2c] selection:bg-[#c8a97e] selection:text-white`}>
      
      {/* Container max-width */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col min-h-screen">
        
        <Navbar />

        {/* Hero Section */}
        <main className="flex-1 py-12 lg:py-24 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">
            
            {/* Left Box (Text) */}
            <div className="flex flex-col items-start space-y-8 max-w-lg">
              <span className="uppercase text-xs font-bold tracking-[0.2em] text-gray-500">
                Brewed to Perfection
              </span>
              
              <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-[1.15] text-[#2c2c2c]">
                Awaken your <br />
                senses with <br />
                <span className="text-[#c8a97e]">pure joy.</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                Experience the harmony of deeply roasted local beans, delicate pastries, and a warm, inviting atmosphere designed for true connoisseurs.
              </p>
              
              <div className="pt-4">
                <Link href="/menu">
                  <Button>Explore Our Menu</Button>
                </Link>
              </div>
            </div>

            {/* Right Box (Image) */}
            <div className="relative w-full aspect-[4/5] lg:aspect-square flex justify-end">
              <div className="w-[90%] h-full rounded-2xl overflow-hidden shadow-2xl relative shadow-black/10 group">
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1447&auto=format&fit=crop" 
                  alt="Aesthetic Cafe Experience" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#c8a97e]/20 rounded-full blur-3xl -z-10"></div>
            </div>

          </div>
        </main>

      </div>

      {/* Feature / Category Section */}
      <section className="bg-white py-24 px-6 lg:px-12 mt-12 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="text-center mb-16">
            <span className="uppercase text-xs font-bold tracking-[0.2em] text-[#c8a97e] mb-4 block">
              Curated Offerings
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#2c2c2c]">
              Signature Collections
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <CategoryCard 
              title="Artisan Coffee" 
              description="Rich, ethically sourced single-origin roasts crafted by our master baristas for the perfect cup every single time."
              image="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1287&auto=format&fit=crop"
            />
            <CategoryCard 
              title="Delicate Pastries" 
              description="Freshly baked daily, our selection of European-style pastries are made with premium butter and love."
              image="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=1532&auto=format&fit=crop"
            />
          </div>

        </div>
      </section>

    </div>
  );
}

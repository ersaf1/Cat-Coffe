import React from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import Link from 'next/link';

// Typography Configuration
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function MakananMinumanPage() {
  const menuMakanan = [
    { name: 'Nasi Goreng Spesial', price: 'Rp 45.000', desc: 'Nasi goreng dengan telur, sosis, dan suwiran ayam.' },
    { name: 'Spaghetti Carbonara', price: 'Rp 55.000', desc: 'Pasta creamy dengan smoked beef dan keju parmesan.' },
    { name: 'Ayam Bakar Madu', price: 'Rp 48.000', desc: 'Ayam bakar manis gurih disajikan dengan sambal dan lalapan.' },
    { name: 'Beef Burger', price: 'Rp 60.000', desc: 'Burger sapi dengan patty tebal, keju slice, dan kentang goreng.' },
  ];

  const menuMinuman = [
    { name: 'Kopi Kenangan Mantan', price: 'Rp 28.000', desc: 'Es kopi susu gula aren yang manis dan creamy.' },
    { name: 'Matcha Latte', price: 'Rp 35.000', desc: 'Perpaduan bubuk teh hijau premium dengan susu segar.' },
    { name: 'Lemon Tea', price: 'Rp 20.000', desc: 'Teh rasa lemon yang segar dan melegakan dahaga.' },
    { name: 'Red Velvet Blend', price: 'Rp 38.000', desc: 'Minuman blended rasa red velvet dengan whipped cream.' },
  ];

  return (
    <div className={`min-h-screen bg-[#f9f6f0] ${playfair.variable} ${inter.variable} font-sans text-[#2c2c2c] selection:bg-[#c8a97e] selection:text-white`}>
      {/* Navbar Container */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <nav className="w-full py-6 flex items-center justify-between z-10 relative">
          <Link href="/" className="text-2xl font-bold font-serif tracking-widest text-[#2c2c2c]">
            CAFE
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-wider font-semibold text-[#2c2c2c]">
            <Link href="/" className="hover:text-[#c8a97e] transition-colors duration-300">Home</Link>
            <Link href="/menu" className="hover:text-[#c8a97e] transition-colors duration-300">Menu Utama</Link>
            <Link href="/makanan-minuman" className="text-[#c8a97e] transition-colors duration-300">Makanan & Minuman</Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="py-12 lg:py-20 px-6 lg:px-12 relative overflow-hidden text-center">
        <div className="max-w-[800px] mx-auto">
          <span className="uppercase text-xs font-bold tracking-[0.2em] text-[#c8a97e]">
            Spesial Untuk Anda
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#2c2c2c] mt-4 mb-6">
            Makanan & Minuman
          </h1>
          <p className="text-gray-600">Jelajahi beragam pilihan hidangan lezat dan minuman menyegarkan yang dibuat khusus dengan bahan berkualitas.</p>
          <div className="w-20 h-[2px] bg-[#c8a97e] mx-auto mt-8"></div>
        </div>
      </section>

      {/* Menu List Section */}
      <section className="pb-24 px-6 lg:px-12">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Makanan */}
          <div>
            <h2 className="font-serif text-3xl text-[#2c2c2c] mb-8 font-semibold tracking-wide border-b border-[#2c2c2c]/10 pb-4">
              Makanan Utama
            </h2>
            <div className="space-y-8">
              {menuMakanan.map((item, i) => (
                <div key={i} className="group flex flex-col transition-transform duration-300 hover:translate-x-2">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-bold text-lg text-[#2c2c2c] bg-[#f9f6f0] pr-4 relative z-10">{item.name}</h3>
                    <div className="flex-1 border-b-2 border-dotted border-gray-300 mx-4 relative top-[-6px]"></div>
                    <span className="font-serif font-bold text-[#c8a97e] text-lg bg-[#f9f6f0] pl-4 relative z-10">{item.price}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Minuman */}
          <div>
            <h2 className="font-serif text-3xl text-[#2c2c2c] mb-8 font-semibold tracking-wide border-b border-[#2c2c2c]/10 pb-4">
              Minuman Segar
            </h2>
            <div className="space-y-8">
              {menuMinuman.map((item, i) => (
                <div key={i} className="group flex flex-col transition-transform duration-300 hover:translate-x-2">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-bold text-lg text-[#2c2c2c] bg-[#f9f6f0] pr-4 relative z-10">{item.name}</h3>
                    <div className="flex-1 border-b-2 border-dotted border-gray-300 mx-4 relative top-[-6px]"></div>
                    <span className="font-serif font-bold text-[#c8a97e] text-lg bg-[#f9f6f0] pl-4 relative z-10">{item.price}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

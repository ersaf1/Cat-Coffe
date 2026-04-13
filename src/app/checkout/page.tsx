'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Playfair_Display, Inter } from 'next/font/google';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Typography Configuration
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const PAYMENT_METHODS = [
  { id: 'bca', name: 'BCA Virtual Account', icon: '🏦' },
  { id: 'mandiri', name: 'Mandiri Virtual Account', icon: '🏦' },
  { id: 'gopay', name: 'GoPay', icon: '📱' },
  { id: 'dana', name: 'DANA', icon: '📱' },
  { id: 'ovo', name: 'OVO', icon: '📱' }
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    // Check login state
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login?redirect=/checkout');
      return;
    }

    // Load cart
    const savedCart = localStorage.getItem('guestCart'); // Using guestCart now
    
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      const newTotal = parsedCart.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
      setTotalPrice(newTotal);
    }
  }, [router]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // 1. Dapatkan user session dari Supabase
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        alert('Anda harus login terlebih dahulu.');
        router.push('/login?redirect=/checkout');
        return;
      }

      // 2. Simpan order Dummy ke database (tabel orders) PENDING
      const grandTotal = Math.round(totalPrice * 1.1); // + tax 10%
      
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userData.user.id,
            total_price: grandTotal,
            status: 'PENDING',
            items: cartItems, // JSONB column
            payment_method: paymentMethod
          }
        ])
        .select();

      if (error) {
        console.warn('Supabase Error:', error);
        // Kita abaikan error database untuk sementara agar mockup tetap jalan
      }

      // 3. Clear cart
      localStorage.removeItem('guestCart');

      // 4. Redirect dummy success
      router.push('/payment/success');
      
    } catch (error: any) {
      console.error('Error during payment insertion:', error);
      alert(`Terjadi kesalahan saat memproses pesanan Anda. \nDetail: ${error.message || 'Unknown error'}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#f5f1eb] ${playfair.variable} ${inter.variable} font-sans text-[#2c2c2c]`}>
      {/* Navigation */}
      <nav className="w-full py-6 px-6 lg:px-12 max-w-[1200px] mx-auto border-b border-gray-200/60 mb-8">
        <Link href="/menu" className="flex items-center gap-2 text-gray-500 hover:text-[#c8a97e] transition-colors w-fit font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali ke Menu
        </Link>
      </nav>

      <div className="max-w-[1000px] mx-auto px-6 lg:px-12 pb-24">
        <div className="mb-10">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#2c2c2c]">Selesaikan Pesanan</h1>
          <p className="text-gray-500 mt-2">Pilih metode pembayaran favorit Anda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-serif text-2xl font-bold text-[#2c2c2c] mb-6 border-b pb-4 border-gray-100">Ringkasan Pesanan</h2>
              
              {cartItems.length === 0 ? (
                <p className="text-gray-500 italic">Tidak ada item di keranjang.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-[#2c2c2c]">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#c8a97e]">Rp {formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Subtotal</span>
                  <span>Rp {formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Pajak (10%)</span>
                  <span>Rp {formatPrice(Math.round(totalPrice * 0.1))}</span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                  <span className="font-bold text-lg text-[#2c2c2c]">Total Pembayaran</span>
                  <span className="font-serif font-bold text-3xl text-[#c8a97e]">
                    Rp {formatPrice(Math.round(totalPrice * 1.1))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Method (Mockup) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-serif text-2xl font-bold text-[#2c2c2c] mb-6">Metode Pembayaran</h2>
              
              <div className="space-y-4 mb-8">
                {PAYMENT_METHODS.map((method) => (
                  <label 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)} 
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-[#c8a97e] bg-[#c8a97e]/5' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-[#c8a97e]' : 'border-gray-300'}`}>
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-[#c8a97e] rounded-full"></div>}
                      </div>
                      <span className="text-lg">{method.icon}</span>
                      <span className="font-bold text-[#2c2c2c]">{method.name}</span>
                    </div>
                  </label>
                ))}
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-[#2c2c2c] text-white py-4 rounded-full font-bold hover:bg-black hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 relative overflow-hidden"
              >
                {isProcessing ? 'Memproses...' : 'Selesaikan Pesanan'}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

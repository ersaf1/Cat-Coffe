'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Playfair_Display, Inter } from 'next/font/google';
import Link from 'next/link';

// Typography Configuration
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'transfer'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    const savedCart = localStorage.getItem('checkoutCart');
    const savedTotal = localStorage.getItem('checkoutTotal');
    
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedTotal) setTotalPrice(parseFloat(savedTotal));
  }, [router]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          items: cartItems,
          // Tambahkan email/nama customer jika ada sistem user
          customerDetails: {
            givenNames: 'Pelanggan Cat Coffee',
          }
        }),
      });
      
      const data = await response.json();
      
      if (data.invoiceUrl) {
        // Arahkan ke halaman pembayaran Xendit
        window.location.href = data.invoiceUrl;
      } else {
        alert('Gagal membuat pesanan: ' + (data.error || 'Terjadi kesalahan'));
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error during payment', error);
      alert('Terjadi kesalahan saat memproses pembayaran');
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`min-h-screen bg-[#f5f1eb] flex items-center justify-center p-6 ${playfair.variable} ${inter.variable} font-sans`}>
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#2c2c2c] mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-8">Thank you for your order. We are preparing your delicious treats right now.</p>
          <div className="animate-pulse flex justify-center items-center gap-2 text-[#c8a97e] font-semibold">
            <span>Redirecting to home...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f5f1eb] ${playfair.variable} ${inter.variable} font-sans text-[#2c2c2c]`}>
      {/* Navigation */}
      <nav className="w-full py-6 px-6 lg:px-12 max-w-[1200px] mx-auto border-b border-gray-200/60 mb-8">
        <Link href="/menu" className="flex items-center gap-2 text-gray-500 hover:text-[#c8a97e] transition-colors w-fit font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Menu
        </Link>
      </nav>

      <div className="max-w-[1000px] mx-auto px-6 lg:px-12 pb-24">
        <div className="mb-10">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#2c2c2c]">Secure Checkout</h1>
          <p className="text-gray-500 mt-2">Complete your coffee order securely.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-serif text-2xl font-bold text-[#2c2c2c] mb-6 border-b pb-4 border-gray-100">Order Summary</h2>
              
              {cartItems.length === 0 ? (
                <p className="text-gray-500 italic">No items found for checkout.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-[#2c2c2c]">{item.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-gray-500">Qty:</p>
                            <div className="flex items-center bg-[#f5f1eb] rounded-full p-0.5 border border-gray-200">
                              <button 
                                onClick={() => {
                                  const newCart = [...cartItems];
                                  if (newCart[i].quantity > 1) {
                                    newCart[i].quantity -= 1;
                                    setCartItems(newCart);
                                    localStorage.setItem('checkoutCart', JSON.stringify(newCart));
                                    const newTotal = newCart.reduce((sum, it) => sum + (it.price * it.quantity), 0);
                                    setTotalPrice(newTotal);
                                    localStorage.setItem('checkoutTotal', newTotal.toString());
                                  } else {
                                    const filtered = newCart.filter((_, index) => index !== i);
                                    setCartItems(filtered);
                                    localStorage.setItem('checkoutCart', JSON.stringify(filtered));
                                    const newTotal = filtered.reduce((sum, it) => sum + (it.price * it.quantity), 0);
                                    setTotalPrice(newTotal);
                                    localStorage.setItem('checkoutTotal', newTotal.toString());
                                  }
                                }}
                                className="w-5 h-5 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all text-xs"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold w-4 text-center text-[#c8a97e]">{item.quantity}</span>
                              <button 
                                onClick={() => {
                                  const newCart = [...cartItems];
                                  newCart[i].quantity += 1;
                                  setCartItems(newCart);
                                  localStorage.setItem('checkoutCart', JSON.stringify(newCart));
                                  const newTotal = newCart.reduce((sum, it) => sum + (it.price * it.quantity), 0);
                                  setTotalPrice(newTotal);
                                  localStorage.setItem('checkoutTotal', newTotal.toString());
                                }}
                                className="w-5 h-5 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
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
                  <span>Tax (10%)</span>
                  <span>Rp {formatPrice(Math.round(totalPrice * 0.1))}</span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                  <span className="font-bold text-lg text-[#2c2c2c]">Total to Pay</span>
                  <span className="font-serif font-bold text-3xl text-[#c8a97e]">
                    Rp {formatPrice(Math.round(totalPrice * 1.1))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-serif text-2xl font-bold text-[#2c2c2c] mb-6">Payment Method</h2>
              
              <div className="space-y-4 mb-8">
                {/* QRIS Option */}
                <label onClick={() => setPaymentMethod('qris')} className={`block flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'qris' ? 'border-[#c8a97e] bg-[#c8a97e]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'qris' ? 'border-[#c8a97e]' : 'border-gray-300'}`}>
                      {paymentMethod === 'qris' && <div className="w-2.5 h-2.5 bg-[#c8a97e] rounded-full"></div>}
                    </div>
                    <span className="font-bold text-[#2c2c2c]">QRIS</span>
                  </div>
                </label>

                {/* Bank Transfer Option */}
                <label onClick={() => setPaymentMethod('transfer')} className={`block flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-[#c8a97e] bg-[#c8a97e]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-[#c8a97e]' : 'border-gray-300'}`}>
                      {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 bg-[#c8a97e] rounded-full"></div>}
                    </div>
                    <span className="font-bold text-[#2c2c2c]">Bank Transfer</span>
                  </div>
                </label>
              </div>

              {/* Payment Details UI */}
              <div className="bg-[#f5f1eb] p-6 rounded-2xl mb-8 flex flex-col items-center justify-center text-center border border-dashed border-gray-300">
                {paymentMethod === 'qris' ? (
                  <div className="animate-fade-in w-full flex flex-col items-center">
                    <p className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-widest">Scan to Pay</p>
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                      {/* Actual QRIS Image */}
                      <img src="/qris.jpg" alt="QRIS Ersaf Targaryen Cafe" className="w-[18rem] h-auto object-contain rounded-lg shadow-sm" />
                    </div>
                    <p className="text-xs text-gray-500">Supports all major banks and e-wallets.</p>
                  </div>
                ) : (
                  <div className="animate-fade-in w-full text-left">
                    <p className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-widest text-center">Transfer Details</p>
                    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                      <div>
                        <p className="text-xs text-gray-400">Bank Name</p>
                        <p className="font-bold text-[#2c2c2c]">BCA (Bank Central Asia)</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Account Number</p>
                        <div className="flex items-center justify-between">
                          <p className="font-mono font-bold text-lg text-[#2c2c2c] tracking-wider">8901 2345 67</p>
                          <button className="text-[#c8a97e] text-xs font-bold hover:underline" onClick={() => navigator.clipboard.writeText('8901234567')}>Copy</button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Account Name</p>
                        <p className="font-bold text-[#2c2c2c]">Cat Coffe Official</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-[#2c2c2c] text-white py-4 rounded-full font-bold hover:bg-black hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 relative overflow-hidden"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Confirm Payment
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </>
                )}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

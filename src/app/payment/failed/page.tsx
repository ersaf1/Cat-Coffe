'use client';
import { useRouter } from 'next/navigation';

export default function PaymentFailedPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-[#2C1B18] flex flex-col items-center justify-center p-4">
      <div className="bg-[#F5E6CA] p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
         <div className="text-red-500 mb-4">
           <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
         </div>
        <h1 className="text-2xl font-bold text-[#2C1B18] mb-2">Pembayaran Gagal / Dibatalkan</h1>
        <p className="text-gray-600 mb-6">Waktu pembayaran telah habis atau pembayaran dibatalkan. Silakan coba keranjang pesanan Anda lagi.</p>
        <button onClick={() => router.push('/checkout')} className="bg-[#C69C6D] hover:bg-[#D4A373] text-white px-6 py-3 rounded-xl font-bold transition-colors">ULANGI PEMBAYARAN</button>
      </div>
    </div>
  );
}
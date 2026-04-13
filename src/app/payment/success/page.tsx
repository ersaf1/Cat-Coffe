'use client';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-[#2C1B18] flex flex-col items-center justify-center p-4">
      <div className="bg-[#F5E6CA] p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
         <div className="text-green-500 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
         </div>
        <h1 className="text-2xl font-bold text-[#2C1B18] mb-2">Pembayaran Berhasil!</h1>
        <p className="text-gray-600 mb-6">Terima kasih, pesanan Cat Caffe Anda sedang diproses dan segera disiapkan.</p>
        <button onClick={() => router.push('/menu')} className="bg-[#C69C6D] hover:bg-[#D4A373] text-white px-6 py-3 rounded-xl font-bold transition-colors">KEMBALI KE MENU</button>
      </div>
    </div>
  );
}
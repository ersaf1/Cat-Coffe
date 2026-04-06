'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function Home() {
  useEffect(() => {
    // Redireksi ke index.html agar vanilla JS project dan style asli berfungsi!
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-[#FAF9F6] text-[#1A1A1A]">
      <h1 className="font-serif text-3xl">Loading Cat Caffe...</h1>
    </div>
  );
}

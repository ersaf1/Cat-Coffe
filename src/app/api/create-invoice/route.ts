import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, email, description, items } = body;

    if (!amount || !email) {
      return NextResponse.json({ error: 'Amount dan Email wajib diisi' }, { status: 400 });
    }

    // 1. Generate Order ID / External ID yang unik
    const order_id = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 2. Format Body untuk Xendit Invoice API
    const xenditPayload = {
      external_id: order_id,
      amount: amount,
      payer_email: email,
      description: description || 'Pembayaran Pesanan Cat Caffe',
      success_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`,
      failure_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/failed`,
      currency: 'IDR',
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))
    };

    // 3. Panggil API Xendit untuk membuat Invoice
    const xenditKey = process.env.XENDIT_SECRET_KEY + ':';
    const base64Key = Buffer.from(xenditKey).toString('base64');

    const xenditResponse = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Key}`
      },
      body: JSON.stringify(xenditPayload)
    });

    const xenditData = await xenditResponse.json();

    if (!xenditResponse.ok) {
      console.error('Xendit Error:', xenditData);
      return NextResponse.json({ error: 'Gagal membuat invoice Xendit' }, { status: 500 });
    }

    // 4. Simpan data order ke Supabase
    const { error: dbError } = await supabase.from('orders').insert([
      {
        order_id: order_id,
        user_email: email,
        amount: amount,
        status: 'PENDING',
        invoice_url: xenditData.invoice_url
      }
    ]);

    if (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json({ error: 'Gagal menyimpan pesanan ke database' }, { status: 500 });
    }

    // 5. Kembalikan URL Invoice ke Frontend
    return NextResponse.json({ 
      invoice_url: xenditData.invoice_url,
      order_id: order_id 
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}

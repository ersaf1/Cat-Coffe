import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const callbackToken = req.headers.get('x-callback-token');
    
    // Verifikasi Webhook Token dari Xendit
    if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const payload = await req.json();

    // 1. Ekstrak data pembayaran
    const external_id = payload.external_id; // Sesuai dengan order_id yang kita buat
    const status = payload.status; // 'PAID', 'EXPIRED'

    if (!external_id || !status) {
      return NextResponse.json({ error: 'Payload tidak lengkap' }, { status: 400 });
    }

    // 2. Update status order di Supabase
    const { data, error } = await supabase
      .from('orders')
      .update({ status: status })
      .eq('order_id', external_id);

    if (error) {
      console.error('Update Database Error:', error);
      return NextResponse.json({ error: 'Gagal update status pesanan' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Status berhasil diubah menjadi ' + status }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Kesalahan server' }, { status: 500 });
  }
}

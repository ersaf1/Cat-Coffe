import { NextRequest, NextResponse } from 'next/server';
import { Invoice as InvoiceClient } from 'xendit-node';

// Pastikan Anda menaruh Secret Key di file `.env.local`
const xenditInvoiceClient = new InvoiceClient({
  secretKey: process.env.XENDIT_SECRET_KEY || 'isi_secret_key_anda_disini',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, amount, customerDetails } = body;

    // Membuat Data Invoice
    const invoiceRequest: any = {
      externalId: `checkout-${Date.now()}`,
      description: 'Pembayaran Pesanan Cat Coffee',
      amount: amount,
      invoiceDuration: 86400, // 24 jam
      currency: 'IDR',
      // items dan kustomer bisa dilampirkan jika mau lebih spesifik
    };

    const response = await xenditInvoiceClient.createInvoice({ 
      data: invoiceRequest 
    });

    return NextResponse.json({ invoiceUrl: response.invoiceUrl });
  } catch (error: any) {
    console.error('Error creating Xendit invoice:', error);
    return NextResponse.json(
      { error: 'Gagal membuat tagihan pembayaran' },
      { status: 500 }
    );
  }
}

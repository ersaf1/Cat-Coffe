import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi ke database Supabase
// PENTING: Ganti URL dan KEY di bawah ini dengan milik Anda dari Dashboard Supabase
const supabaseUrl = 'https://iwsfkufdeoyirhsmoorh.supabase.co'; // Ganti dengan URL Project Supabase Anda
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3c2ZrdWZkZW95aXJoc21vb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDA1MjksImV4cCI6MjA5MDk3NjUyOX0.9ColWxAhOXwdM1mVgcyofPvrHvJlPoGUgCz-wj3KY90'; // Ganti dengan Anon/Public Key Supabase Anda
const supabase = createClient(supabaseUrl, supabaseKey);

// GET: Mengambil semua data menu dari database
app.get('/api/menu', async (req, res) => {
  const { data, error } = await supabase.from('menu_items').select('*');
  if (error) {
    console.error(error);
    return res.status(500).send('Error fetching menu items');
  }
  res.json(data);
});

// POST: Pendaftaran User Baru
app.post('/api/register', async (req, res) => {
  const { username, password, full_name, phone } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi' });
  }

  // Cek jika username sudah ada
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();

  if (existingUser) {
    return res.status(400).json({ error: 'Username sudah digunakan' });
  }

  // Insert user baru
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password, full_name, phone }])
    .select('id, username, full_name, phone')
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Gagal melakukan registrasi' });
  }
  
  res.json({ message: 'Registrasi berhasil', user: data });
});

// POST: Login User
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi' });
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, username')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) {
    console.error(error);
    return res.status(401).json({ error: 'Username atau password salah' });
  }
  
  res.json({ message: 'Login berhasil', user: data });
});

// POST: Membuat order baru
app.post('/api/orders', async (req, res) => {
  const { cart, totalAmount } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).send('Cart is empty');
  }

  try {
    // 1. Insert ke tabel orders
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ total_amount: totalAmount }])
      .select('id')
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    // 2. Siapkan data item pesanan
    const orderItems = cart.map(item => ({
      order_id: orderId,
      menu_item_id: item.id,
      quantity: item.qty,
      price: item.price
    }));

    // 3. Insert ke tabel order_items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.json({ success: true, orderId: orderId, message: 'Order processed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

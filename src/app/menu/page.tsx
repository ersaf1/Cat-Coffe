'use client';

import React, { useState } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Typography Configuration
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function MenuPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<{ name: string; price: number; quantity: number; image: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const coffeeMenu = [
    { name: 'Espresso', price: 40000, desc: 'Single origin, deeply roasted.', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80' },
    { name: 'Pour Over', price: 55000, desc: 'Hand-brewed, seasonal beans.', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=80' },
    { name: 'Vanilla Latte', price: 60000, desc: 'Madagascar vanilla, rich espresso.', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80' },
    { name: 'Matcha Cortado', price: 65000, desc: 'Ceremonial matcha, oat milk.', image: 'https://images.unsplash.com/photo-1536420121512-06ce6c10881d?w=400&q=80' },
    { name: 'Caramel Macchiato', price: 65000, desc: 'Espresso with vanilla, steamed milk, caramel drizzle.', image: 'https://images.unsplash.com/photo-1485617359743-4dc5d2e53c89?w=400&q=80' },
    { name: 'Iced Americano', price: 45000, desc: 'Chilled espresso over water and ice.', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba1?w=400&q=80' },
    { name: 'Hazelnut Latte', price: 60000, desc: 'Rich espresso with roasted hazelnut flavor.', image: 'https://images.unsplash.com/photo-1579888944161-0f73f089601d?w=400&q=80' },
    { name: 'Earl Grey Tea', price: 40000, desc: 'Premium black tea with bergamot.', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400&q=80' }
  ];

  const pastryMenu = [
    { name: 'Butter Croissant', price: 45000, desc: 'Flaky, buttery, baked fresh daily.', image: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?w=400&q=80' },
    { name: 'Almond Danish', price: 55000, desc: 'Sweet almond frangipane filling.', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&q=80' },
    { name: 'Tiramisu Tart', price: 70000, desc: 'Espresso soaked sponge, mascarpone.', image: 'https://images.unsplash.com/photo-1571115177098-24def8ae5020?w=400&q=80' },
    { name: 'Cinnamon Roll', price: 50000, desc: 'Warm spices, rich cream cheese frosting.', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80' },
    { name: 'Chocolate Éclair', price: 60000, desc: 'Choux pastry filled with cream, chocolate glaze.', image: 'https://images.unsplash.com/photo-1612201142855-7873bc1661b4?w=400&q=80' },
    { name: 'Blueberry Muffin', price: 40000, desc: 'Loaded with wild blueberries, streusel top.', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80' },
    { name: 'Lemon Tart', price: 65000, desc: 'Zesty lemon curd in a butter shell.', image: 'https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=400&q=80' }
  ];

  const menuMakanan = [
    { name: 'Nasi Goreng Spesial', price: 45000, desc: 'Nasi goreng dengan telur, sosis, dan suwiran ayam.', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80' },
    { name: 'Spaghetti Carbonara', price: 55000, desc: 'Pasta creamy dengan smoked beef dan keju parmesan.', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80' },
    { name: 'Ayam Bakar Madu', price: 48000, desc: 'Ayam bakar manis gurih disajikan dengan sambal dan lalapan.', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=400&q=80' },
    { name: 'Beef Burger', price: 60000, desc: 'Burger sapi dengan patty tebal, keju slice, dan kentang goreng.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' }
  ];

  const menuMinuman = [
    { name: 'Kopi Kenangan Mantan', price: 28000, desc: 'Es kopi susu gula aren yang manis dan creamy.', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80' },
    { name: 'Matcha Latte', price: 35000, desc: 'Perpaduan bubuk teh hijau premium dengan susu segar.', image: 'https://images.unsplash.com/photo-1536420121512-06ce6c10881d?w=400&q=80' },
    { name: 'Lemon Tea', price: 20000, desc: 'Teh rasa lemon yang segar dan melegakan dahaga.', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400&q=80' },
    { name: 'Red Velvet Blend', price: 38000, desc: 'Minuman blended rasa red velvet dengan whipped cream.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' }
  ];

  const lightBitesMenu = [
    { name: 'Avocado Toast', price: 90000, desc: 'Smashed avocado, cherry tomatoes, chili flakes.', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400&q=80' },
    { name: 'Caprese Sandwich', price: 110000, desc: 'Fresh mozzarella, tomato, basil pesto on ciabatta.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80' },
    { name: 'Smoked Salmon Bagel', price: 125000, desc: 'Cream cheese, capers, red onion, smoked salmon.', image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&q=80' },
    { name: 'Truffle Fries', price: 80000, desc: 'Crispy fries with truffle oil and parmesan cheese.', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&q=80' }
  ];

  const renderMenuItem = (item: { name: string; price: number; desc: string; image?: string }, i: number) => {
    const cartItem = cartItems.find(cart => cart.name === item.name);
    const qty = cartItem ? cartItem.quantity : 0;

    return (
      <div key={i} className="group relative flex flex-col sm:flex-row items-center justify-between animate-fade-in transition-transform duration-300">
        <div className="w-full sm:pr-8 flex-1 group-hover:translate-x-4 transition-transform duration-300 relative z-10">
          <div className="flex items-baseline justify-between mb-1">
            <h4 className="font-bold text-lg text-[#2c2c2c] bg-[#f5f1eb] pr-4 relative z-10">{item.name}</h4>
            <div className="hidden sm:block flex-1 border-b-2 border-dotted border-gray-300 mx-4 relative top-[-6px]"></div>
            <span className="font-serif font-bold text-[#c8a97e] text-lg bg-[#f5f1eb] pl-4 pr-4 relative z-10">Rp {item.price.toLocaleString('id-ID')}</span>
          </div>
          <p className="text-gray-500 text-sm mb-4 sm:mb-0">{item.desc}</p>
        </div>
        <div className="flex items-center min-w-[70px] shrink-0 z-20 justify-end">
          {qty > 0 ? (
            <div className="flex items-center bg-[#f5f1eb] rounded-full p-0.5 border border-gray-200">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); decreaseQuantity(item.name); }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 font-bold hover:bg-white transition-all text-sm"
              >-</button>
              <span className="font-bold text-[#c8a97e] w-6 text-center text-sm">{qty}</span>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(item); }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 font-bold hover:bg-white transition-all text-sm"
              >+</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#c8a97e] text-lg font-serif">0</span>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(item); }}
                className="flex items-center justify-center p-2 rounded-full bg-white shadow-sm border border-gray-200 text-[#c8a97e] hover:bg-[#c8a97e] hover:text-white transition-all cursor-pointer group-hover:scale-110 active:scale-95"
                title="Add to order"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleAddToCart = (item: { name: string; price: number; image?: string }) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { name: item.name, price: item.price, image: item.image || '', quantity: 1 }];
    });
    setToastMessage(`${item.name} berhasil ditambahkan!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const decreaseQuantity = (name: string) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.name === name);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.name === name ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.name !== name);
    });
  };

  const removeFromCart = (name: string) => {
    setCartItems(prev => prev.filter(i => i.name !== name));
  };

  const cartTotalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={`min-h-screen bg-[#f5f1eb] ${playfair.variable} ${inter.variable} font-sans text-[#2c2c2c] selection:bg-[#c8a97e] selection:text-white`}>
      
      {/* Toast Notification */}
      <div 
        className={`fixed top-24 left-1/2 -translate-x-1/2 bg-[#2c2c2c] text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 transition-all duration-300 transform ${toastMessage ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'}`}
      >
        <svg className="w-5 h-5 text-[#c8a97e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        <span className="font-medium text-sm">{toastMessage}</span>
      </div>

      {/* Navbar Container */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <nav className="w-full py-6 flex items-center justify-between z-50 relative">
          <Link href="/" className="text-2xl font-bold font-serif tracking-widest text-[#2c2c2c]">
            CAFE
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-wider font-semibold text-[#2c2c2c]">
            <Link href="/" className="hover:text-[#c8a97e] transition-colors duration-300">Home</Link>
            <Link href="/menu" className="text-[#c8a97e] transition-colors duration-300">Menu</Link>
            <Link href="#" className="hover:text-[#c8a97e] transition-colors duration-300">About</Link>
          </div>

          <div className="flex items-center gap-4 relative">
            <button 
              type="button" 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative flex items-center gap-2 px-5 py-2.5 bg-white/40 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-white hover:shadow-sm transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#2c2c2c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="font-semibold text-[#2c2c2c] text-sm hidden sm:inline-block">Rp {formatPrice(cartTotalPrice)}</span>
              {cartTotalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c8a97e] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {cartTotalQty}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute top-14 right-0 w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-fade-in origin-top-right">
                <div className="flex items-center justify-between mb-4 border-b pb-4 border-gray-100">
                  <h3 className="font-serif text-xl font-bold text-[#2c2c2c]">Your Order</h3>
                  <span className="bg-[#f5f1eb] text-[#c8a97e] text-xs font-bold px-2 py-1 rounded-md">{cartTotalQty} items</span>
                </div>
                
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#f5f1eb] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#c8a97e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-1">Looks like you haven't added any treats yet.</p>
                  </div>
                ) : (
                  <div className="space-y-5 max-h-[320px] overflow-y-auto mb-4 pr-2 custom-scrollbar">
                    {cartItems.map((item, i) => (
                      <div key={i} className="flex gap-4 items-center">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&q=80'} 
                          alt={item.name} 
                          className="w-16 h-16 rounded-xl object-cover bg-gray-100 shadow-sm shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#2c2c2c] truncate">{item.name}</p>
                          <p className="text-[#c8a97e] font-serif font-bold text-sm mb-2">Rp {formatPrice(item.price)}</p>
                          <div className="flex items-center inline-flex bg-[#f5f1eb] rounded-full p-1 border border-gray-100">
                            <button onClick={() => decreaseQuantity(item.name)} className="w-6 h-6 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all">-</button>
                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => handleAddToCart(item)} className="w-6 h-6 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all">+</button>
                          </div>
                        </div>
                        <div className="flex flex-col flex-1 items-end justify-between h-full gap-3 shrink-0">
                          <button onClick={() => removeFromCart(item.name)} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Remove">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                          <span className="font-bold text-[#2c2c2c]">Rp {formatPrice(item.quantity * item.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {cartItems.length > 0 && (
                  <>
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-end mb-6 mt-2">
                      <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Total</span>
                      <span className="font-serif font-bold text-3xl text-[#2c2c2c]">Rp {formatPrice(cartTotalPrice)}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';
                        localStorage.setItem('checkoutCart', JSON.stringify(cartItems));
                        localStorage.setItem('checkoutTotal', cartTotalPrice.toString());
                        
                        if (isLoggedIn) {
                          router.push('/checkout');
                        } else {
                          // redirect to login and then back to checkout
                          router.push('/login?redirect=/checkout');
                        }
                      }}
                      className="w-full bg-[#2c2c2c] text-white py-3.5 rounded-full font-bold hover:bg-black hover:shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2"
                    >
                      Proceed to Checkout
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Menu Section */}
      <section className="py-12 lg:py-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-[800px] mx-auto relative z-10">
          
          <div className="text-center mb-20 space-y-4">
            <span className="uppercase text-xs font-bold tracking-[0.2em] text-[#c8a97e]">
              A Taste of Excellence
            </span>
            <h1 className="font-serif text-5xl font-bold text-[#2c2c2c]">
              Our Menu
            </h1>
            <div className="w-16 h-[2px] bg-[#c8a97e] mx-auto mt-6"></div>
          </div>

          <div className="space-y-16">
            
            {/* Category: Coffee */}
            <div>
              <h3 className="font-serif text-3xl text-[#2c2c2c] mb-8 font-semibold tracking-wide border-b border-[#2c2c2c]/10 pb-4">Coffee</h3>
              <div className="space-y-8 relative">
                
                {coffeeMenu.map((item, i) => renderMenuItem(item, i))}
                
              </div>
            </div>

            {/* Category: Pastries */}
            <div>
              <h3 className="font-serif text-3xl text-[#2c2c2c] mb-8 font-semibold tracking-wide border-b border-[#2c2c2c]/10 pb-4">Pastries</h3>
              <div className="space-y-8 relative">
                
                {pastryMenu.map((item, i) => renderMenuItem(item, i))}
                
              </div>
            </div>

            {/* Category: Light Bites */}
            <div>
              <h3 className="font-serif text-3xl text-[#2c2c2c] mb-8 font-semibold tracking-wide border-b border-[#2c2c2c]/10 pb-4">Light Bites</h3>
              <div className="space-y-8 relative">
                
                {lightBitesMenu.map((item, i) => renderMenuItem(item, i))}
                
              </div>
            </div>


            {/* Category: Makanan Utama */}
            <div>
              <h3 className="font-serif text-3xl text-[#2c2c2c] mb-8 font-semibold tracking-wide border-b border-[#2c2c2c]/10 pb-4">Makanan Utama</h3>
              <div className="space-y-8 relative">
                {menuMakanan.map((item, i) => renderMenuItem(item, i))}
              </div>
            </div>

            {/* Category: Minuman Segar */}
            <div>
              <h3 className="font-serif text-3xl text-[#2c2c2c] mb-8 font-semibold tracking-wide border-b border-[#2c2c2c]/10 pb-4">Minuman Segar</h3>
              <div className="space-y-8 relative">
                {menuMinuman.map((item, i) => renderMenuItem(item, i))}
              </div>
            </div>

          </div>
          
        </div>
      </section>

    </div>
  );
}

import re

with open('src/app/menu/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Menu arrays adding Makanan and Minuman
menu_insertion_point = "const lightBitesMenu = ["
makanan_minuman_str = """const menuMakanan = [
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

  """

text = text.replace(menu_insertion_point, makanan_minuman_str + menu_insertion_point)

# 2. Remove the Makanan & Minuman old link from navigation
text = text.replace('<Link href="/makanan-minuman" className="hover:text-[#c8a97e] transition-colors duration-300">Maknan & Minuman</Link>\n            ', '')

# 3. Create the renderMenuItem function right above const handleAddToCart
render_menu_fn = """const renderMenuItem = (item: { name: string; price: number; desc: string; image?: string }, i: number) => {
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
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(item); }}
                className="shrink-0 flex items-center justify-center p-2 rounded-full bg-white shadow-sm border border-gray-200 text-[#c8a97e] hover:bg-[#c8a97e] hover:text-white transition-all cursor-pointer group-hover:scale-110 active:scale-95"
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

  const handleAddToCart"""

text = text.replace('const handleAddToCart', render_menu_fn)

# 4. Use the new render method instead of the maps
text = re.sub(r'\{coffeeMenu\.map\(\(item, i\) => \([\s\S]*?\}\)\)', r'{coffeeMenu.map((item, i) => renderMenuItem(item, i))}', text)
text = re.sub(r'\{pastryMenu\.map\(\(item, i\) => \([\s\S]*?\}\)\)', r'{pastryMenu.map((item, i) => renderMenuItem(item, i))}', text)
text = re.sub(r'\{lightBitesMenu\.map\(\(item, i\) => \([\s\S]*?\}\)\)', r'{lightBitesMenu.map((item, i) => renderMenuItem(item, i))}', text)

# 5. Add the newly added Categories to render
append_html = """
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

          </div>"""

text = text.replace('          </div>\n          \n        </div>\n      </section>', append_html + '\n          \n        </div>\n      </section>')

with open('src/app/menu/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)


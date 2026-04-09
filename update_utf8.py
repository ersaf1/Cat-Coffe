import re

with open('src/app/menu/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

source_block = '''          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(item); }}
                className="shrink-0 flex items-center justify-center p-2 rounded-full bg-white shadow-sm border border-gray-200 text-[#c8a97e] hover:bg-[#c8a97e] hover:text-white transition-all cursor-pointer group-hover:scale-110 active:scale-95"
                title="Add to order"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </button>
            </div>
          )}'''

target_block = '''          ) : (
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
          )}'''

text = text.replace(source_block, target_block)

with open('src/app/menu/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

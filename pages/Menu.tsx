import React, { useState, useEffect } from 'react';
import { Search, Sparkles, PlusCircle, Download, Maximize2, X, Image as ImageIcon, Utensils } from 'lucide-react';
import { getSmartFoodRecommendation } from '../services/geminiService';
import { fetchAppData } from '../services/sheetService';

const Menu: React.FC<{ onAddToCart?: (item: any) => void }> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  useEffect(() => {
    const loadMenu = async () => {
      const data = await fetchAppData();
      if (data && data.menu) {
        setMenuItems(data.menu);
      }
    };
    loadMenu();
  }, []);

  const categories = ['All', ...Array.from(new Set(menuItems.map(i => i.category)))];

  const filteredItems = menuItems.filter(item => 
    (activeCategory === 'All' || item.category === activeCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAiRecommend = async () => {
    if (!userInput) return;
    setIsAiLoading(true);
    const rec = await getSmartFoodRecommendation(userInput);
    setRecommendation(rec);
    setIsAiLoading(false);
  };

  // 解析圖示文字
  const renderItemName = (name: string) => {
    let result: React.ReactNode[] = [];
    let text = name;
    
    // 轉換 (辣) 為 🌶️
    const chiliCount = (text.match(/\(辣\)/g) || []).length;
    text = text.replace(/\(辣\)/g, '');
    
    // 轉換 (圖) 為 🖼️
    const hasIcon = text.includes('(圖)');
    text = text.replace(/\(圖\)/g, '');

    result.push(<span key="name">{text.trim()}</span>);
    if (chiliCount > 0) {
      result.push(<span key="chili" className="ml-1">{'🌶️'.repeat(chiliCount)}</span>);
    }
    if (hasIcon) {
      result.push(<span key="image" className="ml-1">🖼️</span>);
    }
    
    return result;
  };

  return (
    <div className="pb-10">
      {/* 實體菜單圖片區塊 */}
      <section className="p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <ImageIcon size={14} /> 實體菜單預覽
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'front', url: 'https://i.ibb.co/QFTKgJ1B/2023-03-25.webp', label: '正面' },
            { id: 'back', url: 'https://i.ibb.co/hJ6cfgjM/2025-12-28.webp', label: '背面' }
          ].map(img => (
            <div key={img.id} className="group relative rounded-2xl overflow-hidden shadow-lg border">
              <img src={img.url} alt={img.label} className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => setZoomImg(img.url)} className="p-2 bg-white rounded-full text-gray-900"><Maximize2 size={16}/></button>
                <a href={img.url} download={`SANOVA_Menu_${img.label}`} className="p-2 bg-emerald-600 rounded-full text-white"><Download size={16}/></a>
              </div>
              <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold">{img.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="p-4 bg-white sticky top-16 z-40 border-b">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜尋薩諾瓦經典美食..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto flex gap-3 no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 border ${
                activeCategory === cat ? 'bg-emerald-800 text-white border-emerald-800 shadow-lg shadow-emerald-800/20' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {cat === 'All' ? '全部項目' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group active:scale-[0.98] transition-all">
            <div className="w-20 h-20 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                /* Fix: Imported and used Utensils from lucide-react */
                <Utensils className="text-emerald-200" size={32} />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900 leading-tight">
                    {renderItemName(item.name)}
                  </h4>
                  {item.isPopular === "TRUE" && <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold ml-2">人氣</span>}
                </div>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{item.description}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-emerald-700 font-black tracking-tight">${item.price}</span>
                <button 
                  onClick={() => onAddToCart && onAddToCart(item)}
                  className="bg-emerald-800 text-white p-2 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <PlusCircle size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 圖片放大 Modal */}
      {zoomImg && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in" onClick={() => setZoomImg(null)}>
          <button className="absolute top-10 right-6 text-white"><X size={32}/></button>
          <img src={zoomImg} className="max-w-full max-h-full object-contain rounded-lg" alt="Zoomed" />
        </div>
      )}
    </div>
  );
};

export default Menu;
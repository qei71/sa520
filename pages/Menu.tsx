
import React, { useState, useEffect } from 'react';
import { MENU_ITEMS } from '../constants';
import { MenuItem } from '../types';
import { Search, Sparkles, PlusCircle, MinusCircle, ShoppingCart } from 'lucide-react';
import { getSmartFoodRecommendation } from '../services/geminiService';

const Menu: React.FC<{ onAddToCart?: (item: MenuItem) => void }> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [userInput, setUserInput] = useState('');

  const categories = ['All', 'Appetizer', 'Main', 'Pasta', 'Pizza', 'Dessert', 'Drink'];

  const filteredItems = MENU_ITEMS.filter(item => 
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

  return (
    <div className="pb-10">
      <div className="p-4 bg-white sticky top-16 z-40 border-b">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜尋美味料理..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto flex gap-3 no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0 border ${
                activeCategory === cat ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* AI Recommendation Section */}
      <div className="m-4 p-4 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-2xl border border-emerald-100">
        <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold">
          <Sparkles size={18} />
          <span>AI 美食推薦助手</span>
        </div>
        <p className="text-xs text-gray-600 mb-3">告訴我你想吃的口味，我來幫你選！</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border outline-none"
            placeholder="例如：我想吃有海鮮且稍微辣的..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button 
            onClick={handleAiRecommend}
            disabled={isAiLoading}
            className="bg-emerald-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
          >
            {isAiLoading ? '思考中...' : '推薦'}
          </button>
        </div>
        {recommendation && (
          <div className="mt-3 p-3 bg-white/60 rounded-lg text-sm text-gray-700 italic border border-white">
            {recommendation}
          </div>
        )}
      </div>

      <div className="px-4 space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border group">
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  {item.isPopular && <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded font-bold">熱門</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-emerald-700 font-bold">${item.price}</span>
                <button 
                  onClick={() => onAddToCart && onAddToCart(item)}
                  className="bg-emerald-800 text-white p-1.5 rounded-full hover:bg-emerald-700 transition-colors"
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;

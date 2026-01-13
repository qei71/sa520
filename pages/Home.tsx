
import React from 'react';
import { PROMOTIONS } from '../constants';
import { ChevronRight, Star, MapPin, User, Utensils, Calendar, HelpCircle, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-6 pb-6">
      {/* Hero Banner - 薩諾瓦專屬圖 */}
      <div className="relative h-72 m-4 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <img 
          src="https://i.ibb.co/qLFg7gSk/Gemini-Generated-Image-cmj4yzcmj4yzcmj4.png" 
          alt="SANOVA Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-1 font-serif">薩諾瓦義式廚房</h2>
            <p className="text-xs opacity-90 tracking-widest font-medium">SANOVA ITALIAN KITCHEN · Ver 1.00</p>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-4 gap-2 px-4">
        {[
          { icon: Utensils, label: '看菜單', path: '/menu', color: 'bg-orange-50 text-orange-600' },
          { icon: Calendar, label: '定預約', path: '/booking', color: 'bg-emerald-50 text-emerald-600' },
          { icon: MapPin, label: '找門市', path: '/info', color: 'bg-blue-50 text-blue-600' },
          { icon: HelpCircle, label: '問問題', path: '/info', color: 'bg-purple-50 text-purple-600' },
        ].map((item, i) => (
          <Link key={i} to={item.path} className="flex flex-col items-center gap-2">
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-sm`}>
              <item.icon size={24} />
            </div>
            <span className="text-xs font-bold text-gray-700">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Social Links */}
      <div className="px-4">
        <a 
          href="https://www.facebook.com/sa520/?locale=zh_TW" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-[#1877F2] text-white rounded-2xl shadow-lg group"
        >
          <div className="flex items-center gap-3">
            <Facebook size={24} />
            <div>
              <p className="text-sm font-bold">追蹤官方粉絲團</p>
              <p className="text-[10px] opacity-80">掌握第一手優惠與新品資訊</p>
            </div>
          </div>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Info Bar */}
      <div className="bg-white py-4 px-6 flex justify-between items-center mx-4 rounded-2xl border shadow-sm">
        <div className="flex flex-col items-center border-r pr-4">
          <span className="text-[10px] text-gray-400 font-bold uppercase">星級</span>
          <div className="flex items-center gap-1 text-emerald-700 font-bold">
            <Star size={14} fill="currentColor" />
            <span>5.0</span>
          </div>
        </div>
        <div className="flex flex-col items-center border-r px-4">
          <span className="text-[10px] text-gray-400 font-bold uppercase">營業</span>
          <span className="text-xs font-bold">Tue-Sun</span>
        </div>
        <div className="flex flex-col items-center pl-4">
          <span className="text-[10px] text-gray-400 font-bold uppercase">位置</span>
          <span className="text-xs font-bold">金湖鎮</span>
        </div>
      </div>

      <section className="px-4">
        <h3 className="text-lg font-bold font-serif mb-3 px-1">熱門推薦</h3>
        <div className="overflow-x-auto flex gap-4 no-scrollbar pb-2">
          {PROMOTIONS.map((promo) => (
            <div key={promo.id} className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-sm border overflow-hidden">
              <img src={promo.image} alt={promo.title} className="w-full h-36 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-gray-900">{promo.title}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{promo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

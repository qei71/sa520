
import React from 'react';
import { PROMOTIONS } from '../constants';
import { ChevronRight, Star, Clock, MapPin, User, Utensils, Calendar, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-6 pb-6">
      {/* Hero Banner */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" 
          alt="Restaurant Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-1 font-serif">Bella Vita</h2>
            <p className="text-sm opacity-90">正統義式料理 · 炭烤披薩 · 職人手作麵</p>
          </div>
        </div>
      </div>

      {/* Quick Action Grid - 六大功能核心入口 */}
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

      {/* Quick Info Bar */}
      <div className="bg-white border-y py-4 px-6 flex justify-between items-center mx-4 rounded-2xl border shadow-sm">
        <div className="flex flex-col items-center border-r pr-4">
          <span className="text-[10px] text-gray-400 font-bold uppercase">星級評價</span>
          <div className="flex items-center gap-1 text-emerald-700 font-bold">
            <Star size={14} fill="currentColor" />
            <span>4.9</span>
          </div>
        </div>
        <div className="flex flex-col items-center border-r px-4">
          <span className="text-[10px] text-gray-400 font-bold uppercase">營業時間</span>
          <span className="text-xs font-bold">11:30-22:00</span>
        </div>
        <div className="flex flex-col items-center pl-4">
          <span className="text-[10px] text-gray-400 font-bold uppercase">門市位置</span>
          <span className="text-xs font-bold">信義區</span>
        </div>
      </div>

      {/* Promotions Section (最新優惠) */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-lg font-bold font-serif">最新活動訊息</h3>
          <Link to="/promotions" className="text-emerald-700 text-xs font-bold flex items-center gap-1">
            查看更多 <ChevronRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto flex gap-4 no-scrollbar pb-2">
          {PROMOTIONS.map((promo) => (
            <div key={promo.id} className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-sm border overflow-hidden">
              <img src={promo.image} alt={promo.title} className="w-full h-36 object-cover" />
              <div className="p-4">
                <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold mb-1 inline-block">HOT EVENT</span>
                <h4 className="font-bold text-gray-900">{promo.title}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{promo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Member Section (會員中心/集點卡預覽) */}
      <section className="mx-4 bg-gray-900 text-white p-6 rounded-3xl flex items-center justify-between shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-800/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Digital Member Card</p>
          <p className="text-2xl font-bold mt-1">1,250 <span className="text-xs font-normal text-gray-400">PTS</span></p>
          <div className="mt-4 flex gap-1">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center ${i <= 3 ? 'bg-emerald-600 border-emerald-500' : 'bg-white/5'}`}>
                {i <= 3 && <Star size={12} fill="white" />}
              </div>
            ))}
            <span className="text-[10px] text-gray-400 ml-2 self-center">再集 2 點換提拉米蘇</span>
          </div>
        </div>
        <Link to="/member" className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors">
          <User size={28} />
        </Link>
      </section>
    </div>
  );
};

export default Home;

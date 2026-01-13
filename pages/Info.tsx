
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Bus, Train, Facebook, HelpCircle, ChevronDown, ExternalLink, MessageCircle } from 'lucide-react';
import { fetchAppData } from '../services/sheetService';

const Info: React.FC = () => {
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    const loadFaqs = async () => {
      const data = await fetchAppData();
      if (data && data.faqs) setFaqs(data.faqs);
    };
    loadFaqs();
  }, []);

  return (
    <div className="pb-20 space-y-8 bg-[#fdfbf7]">
      {/* Map Mockup */}
      <div className="h-72 m-4 rounded-[2.5rem] relative overflow-hidden shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=800&fit=crop" 
          alt="Map" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-emerald-900/10 flex items-center justify-center">
          <a 
            href="https://www.google.com/maps/search/?api=1&query=金門縣金湖鎮太湖路二段3巷6號"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-3xl shadow-2xl animate-bounce flex items-center gap-2"
          >
            <MapPin className="text-red-500" size={24} />
            <span className="font-bold text-gray-900">點我導航</span>
          </a>
        </div>
      </div>

      <div className="px-4 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-serif flex items-center gap-3">
              <span className="p-2 bg-emerald-800 text-white rounded-xl shadow-lg"><MapPin size={20} /></span>
              薩諾瓦義式廚房
            </h3>
          </div>
          <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <MapPin className="text-emerald-600 mt-1" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">門市地址</p>
                <p className="text-sm font-bold text-gray-700">金門縣金湖鎮太湖路二段3巷6號</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-emerald-600" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">訂位電話</p>
                <a href="tel:082332530" className="text-sm font-bold text-emerald-800">082-332530</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="text-emerald-600 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">營業時間</p>
                <div className="flex justify-between text-sm font-bold text-gray-700">
                  <span>週二至週日</span>
                  <span className="text-emerald-700">11:00-14:00, 17:00-20:30</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-red-600 mt-1 italic">
                  <span>每週一</span>
                  <span>固定公休</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold font-serif flex items-center gap-3">
            <span className="p-2 bg-blue-600 text-white rounded-xl shadow-lg"><Facebook size={20} /></span>
            官方社群
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="https://www.facebook.com/sa520/" className="bg-white p-5 rounded-[2rem] border flex flex-col items-center gap-3 shadow-sm hover:bg-blue-50 transition-colors">
              <Facebook className="text-[#1877F2]" size={32} />
              <span className="text-xs font-bold text-gray-700">臉書專頁</span>
            </a>
            <button className="bg-white p-5 rounded-[2rem] border flex flex-col items-center gap-3 shadow-sm hover:bg-emerald-50 transition-colors">
              <MessageCircle className="text-[#06C755]" size={32} />
              <span className="text-xs font-bold text-gray-700">LINE 客服</span>
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold font-serif flex items-center gap-3">
            <span className="p-2 bg-purple-600 text-white rounded-xl shadow-lg"><HelpCircle size={20} /></span>
            常見問題 FAQ
          </h3>
          <div className="space-y-3">
            {faqs.length > 0 ? faqs.map((faq, idx) => (
              <details key={idx} className="bg-white border border-gray-100 rounded-2xl overflow-hidden group">
                <summary className="flex justify-between items-center p-5 cursor-pointer font-bold text-sm text-gray-700 list-none">
                  {faq.問題}
                  <ChevronDown size={18} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-4 bg-gray-50/50">
                  {faq.回答}
                </div>
              </details>
            )) : (
              <div className="text-center py-6 text-gray-400 text-xs italic">載入常見問題中...</div>
            )}
          </div>
        </section>

        <footer className="py-10 text-center opacity-40">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]">SANOVA Italian Kitchen</p>
          <p className="text-[8px] mt-2 italic font-serif">A taste of Italy in Kinmen.</p>
        </footer>
      </div>
    </div>
  );
};

export default Info;

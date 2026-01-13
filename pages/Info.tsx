
import React from 'react';
import { MapPin, Phone, Clock, Bus, Train, Mail, HelpCircle, ChevronDown } from 'lucide-react';
import { FAQS } from '../constants';

const Info: React.FC = () => {
  return (
    <div className="pb-10 space-y-8">
      {/* Map Mockup */}
      <div className="h-64 bg-gray-200 w-full relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=800&fit=crop" 
          alt="Map" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-emerald-900/20 flex items-center justify-center">
          <div className="bg-white p-2 rounded-lg shadow-xl animate-bounce">
            <MapPin className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="text-emerald-800" />
            餐廳資訊
          </h3>
          <div className="space-y-3 bg-white p-4 rounded-2xl border shadow-sm">
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-1" size={18} />
              <p className="text-sm text-gray-600">台北市信義區忠孝東路五段 123 號 2 樓</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-gray-400" size={18} />
              <p className="text-sm text-gray-600">02-2345-6789</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="text-gray-400 mt-1" size={18} />
              <div className="text-sm text-gray-600">
                <p>每日 11:30 - 14:30</p>
                <p>每日 17:30 - 22:00</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Bus className="text-emerald-800" />
            交通方式
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <Train className="text-emerald-700" size={24} />
              <div>
                <p className="font-bold text-sm">捷運台北捷運</p>
                <p className="text-xs text-gray-600 mt-1">捷運市政府站 3 號出口，步行約 5 分鐘即可抵達。</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Bus className="text-blue-700" size={24} />
              <div>
                <p className="font-bold text-sm">公車</p>
                <p className="text-xs text-gray-600 mt-1">搭乘 212、232、299 至「市政府站」下車，步行約 2 分鐘。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="text-emerald-800" />
            常見問題 FAQ
          </h3>
          <div className="space-y-2">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="bg-white border rounded-xl overflow-hidden group">
                <summary className="flex justify-between items-center p-4 cursor-pointer font-medium text-sm text-gray-700 list-none">
                  {faq.question}
                  <ChevronDown size={18} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 text-xs text-gray-500 leading-relaxed border-t border-gray-50">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="pt-6 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">聯絡我們</p>
          <div className="flex justify-center gap-4">
            <button className="p-3 bg-white border rounded-full text-emerald-800 shadow-sm"><Mail size={20} /></button>
            <button className="p-3 bg-white border rounded-full text-emerald-800 shadow-sm"><Phone size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;

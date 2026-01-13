
import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, Users, ShoppingCart, CheckCircle2, Loader2 } from 'lucide-react';
import Menu from './Menu';
import CustomModal from '../components/CustomModal';
import { submitReservationToSheet } from '../services/sheetService';

// 假設 LINE LIFF 已在 index.html 載入
declare const liff: any;

const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any });
  const [bookingInfo, setBookingInfo] = useState({
    date: '', time: '', guests: 2, name: '', phone: ''
  });
  const [cart, setCart] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  const isMonday = useMemo(() => {
    if (!bookingInfo.date) return false;
    return new Date(bookingInfo.date).getDay() === 1;
  }, [bookingInfo.date]);

  const handleAddToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleSubmit = async () => {
    if (isMonday) {
      setModal({ isOpen: true, title: '日期無效', message: '薩諾瓦週一公休，請選擇其他日期！', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const resData = { ...bookingInfo, preOrders: cart, totalAmount };
      const result = await submitReservationToSheet(resData);
      
      if (result.success) {
        // LIFF 傳送訊息功能
        if (liff.isInClient()) {
          const preOrderText = cart.map(i => `${i.name} x${i.quantity}`).join('\n');
          const message = `🔔 薩諾瓦訂位通知\n----------------\n姓名：${bookingInfo.name}\n日期：${bookingInfo.date}\n時間：${bookingInfo.time}\n人數：${bookingInfo.guests} 位\n桌號：${result.table}\n預點項目：\n${preOrderText || '無'}\n----------------\n期待您的光臨！`;
          
          liff.sendMessages([{ type: 'text', text: message }])
            .then(() => console.log('Message sent'))
            .catch((err: any) => console.error('Error sending message', err));
        }
        setStep(4);
      }
    } catch (err: any) {
      setModal({ isOpen: true, title: '提交失敗', message: err.message || '發生未知錯誤，請稍後再試。', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showMenu) {
    return (
      <div className="animate-slide-up bg-white min-h-screen pb-32">
        <header className="bg-white/80 backdrop-blur-md p-4 sticky top-0 z-50 flex justify-between items-center border-b shadow-sm">
          <button onClick={() => setShowMenu(false)} className="text-emerald-800 font-bold px-3 py-1 bg-emerald-50 rounded-lg text-sm">確定返回</button>
          <h2 className="font-bold text-gray-900">加選預點餐點</h2>
          <div className="relative">
            <ShoppingCart size={24} className="text-emerald-800" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </div>
        </header>
        <Menu onAddToCart={handleAddToCart} />
        {cart.length > 0 && (
          <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto bg-gray-900 text-white p-4 rounded-3xl flex justify-between items-center shadow-2xl border border-white/10 z-[60]">
            <div>
              <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest">已選 {cart.length} 項</p>
              <p className="font-black text-xl text-emerald-400">${totalAmount}</p>
            </div>
            <button onClick={() => setShowMenu(false)} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
              確認清單
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <CustomModal {...modal} onClose={() => setModal({ ...modal, isOpen: false })} />

      {/* Progress Header */}
      <div className="bg-emerald-800 p-6 rounded-[2rem] text-white shadow-xl flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold font-serif">立即預約</h3>
          <p className="text-xs text-emerald-200 opacity-80 mt-1">SANOVA 訂位系統 Ver 1.00</p>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl">
          <CalendarIcon size={24} />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-fade-in bg-white p-6 rounded-[2rem] border shadow-sm">
          <div className="space-y-5">
            <div className="group">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">預約日期</label>
              <div className="relative">
                <input 
                  type="date" 
                  className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:ring-4 transition-all ${isMonday ? 'border-red-200 bg-red-50 focus:ring-red-100' : 'border-gray-100 focus:ring-emerald-100'}`} 
                  value={bookingInfo.date}
                  onChange={(e) => setBookingInfo({...bookingInfo, date: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">時間</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100"
                  value={bookingInfo.time}
                  onChange={(e) => setBookingInfo({...bookingInfo, time: e.target.value})}
                >
                  <option value="">選擇時段</option>
                  <optgroup label="午餐">
                    <option value="11:30">11:30</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                  </optgroup>
                  <optgroup label="晚餐">
                    <option value="17:30">17:30</option>
                    <option value="18:30">18:30</option>
                    <option value="19:30">19:30</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">人數</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100"
                  value={bookingInfo.guests}
                  onChange={(e) => setBookingInfo({...bookingInfo, guests: parseInt(e.target.value)})}
                >
                  {[1,2,3,4,5,6,7,8,10].map(n => <option key={n} value={n}>{n} 位</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">聯絡資料</label>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="姓名"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100"
                  value={bookingInfo.name}
                  onChange={(e) => setBookingInfo({...bookingInfo, name: e.target.value})}
                />
                <input 
                  type="tel" 
                  placeholder="手機號碼"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100"
                  value={bookingInfo.phone}
                  onChange={(e) => setBookingInfo({...bookingInfo, phone: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            disabled={!bookingInfo.date || !bookingInfo.time || !bookingInfo.name || !bookingInfo.phone || isMonday}
            onClick={() => setStep(2)}
            className="w-full bg-emerald-800 text-white py-5 rounded-2xl font-bold shadow-xl shadow-emerald-800/20 disabled:opacity-50 active:scale-95 transition-all mt-4"
          >
            下一步：預點美味餐點
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in bg-white p-6 rounded-[2rem] border shadow-sm">
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">點餐清單</h4>
              <p className="text-xs text-gray-400">預先點餐入座即享，無需等待</p>
            </div>
          </div>

          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm italic">
                尚未加入任何餐點
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-dashed">
                  <div>
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">${item.price} x {item.quantity}</p>
                  </div>
                  <div className="font-black text-emerald-800">${item.price * item.quantity}</div>
                </div>
              ))
            )}
            
            <button 
              onClick={() => setShowMenu(true)}
              className="w-full py-4 border-2 border-dashed border-emerald-100 rounded-2xl text-emerald-700 text-xs font-bold hover:bg-emerald-50 transition-colors"
            >
              + 前往選購菜單
            </button>
          </div>

          <div className="pt-6 border-t space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm font-bold">預約總計額</span>
              <span className="text-2xl font-black text-emerald-800">${totalAmount}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setStep(1)} className="py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold">上一步</button>
              <button onClick={() => setStep(3)} className="py-4 bg-emerald-800 text-white rounded-2xl font-bold shadow-lg shadow-emerald-800/20">確認預約</button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border rounded-[2.5rem] shadow-xl overflow-hidden">
            <div className="bg-emerald-800 p-8 text-white">
              <h4 className="text-2xl font-bold font-serif">SANOVA 確認資訊</h4>
              <p className="text-xs opacity-60 mt-2 tracking-widest uppercase">Reservation Confirmation</p>
            </div>
            <div className="p-8 grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">日期</p>
                <p className="font-black text-gray-800">{bookingInfo.date}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">時段</p>
                <p className="font-black text-gray-800">{bookingInfo.time}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">人數</p>
                <p className="font-black text-gray-800">{bookingInfo.guests} 人</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">預約姓名</p>
                <p className="font-black text-gray-800">{bookingInfo.name}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full bg-emerald-800 text-white py-5 rounded-2xl font-bold shadow-2xl flex justify-center items-center gap-3 active:scale-95 transition-all ${isSubmitting ? 'opacity-70' : ''}`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={24} />
            ) : "確認預約並回傳至 LINE"}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-12 px-6 space-y-6 animate-fade-in bg-white rounded-[2.5rem] border shadow-sm mx-2">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center shadow-inner">
              <CheckCircle2 className="text-emerald-600" size={48} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-emerald-900 font-serif">預約成功！</h3>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">您的訂位資訊已傳送至試算表與 LINE 對話。<br/>薩諾瓦全體員工期待您的光臨！</p>
          </div>
          <button 
            onClick={() => window.location.hash = '/'}
            className="w-full py-5 bg-emerald-800 text-white rounded-2xl font-bold shadow-xl shadow-emerald-800/20 active:scale-95 transition-all"
          >
            返回系統首頁
          </button>
        </div>
      )}
    </div>
  );
};

export default Booking;


import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, Users, ChevronRight, CheckCircle2, ShoppingCart, AlertTriangle } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import Menu from './Menu';
import { submitReservationToSheet } from '../services/sheetService';

const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingInfo, setBookingInfo] = useState({
    date: '',
    time: '',
    guests: 2,
    name: '',
    phone: ''
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  // 檢查是否為週一
  const isMonday = useMemo(() => {
    if (!bookingInfo.date) return false;
    const day = new Date(bookingInfo.date).getDay();
    return day === 1; // 1 = Monday
  }, [bookingInfo.date]);

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async () => {
    if (isMonday) {
      setError("每週一為餐廳公休日，請重新選擇日期。");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitReservationToSheet({
        ...bookingInfo,
        preOrders: cart,
        totalAmount
      });
      if (result.success) {
        setStep(4);
      }
    } catch (err: any) {
      setError(err.message || "提交失敗，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showMenu) {
    return (
      <div className="animate-slide-up">
        <header className="bg-white p-4 sticky top-0 z-50 flex justify-between items-center border-b shadow-sm">
          <button onClick={() => setShowMenu(false)} className="text-gray-500">返回訂位</button>
          <h2 className="font-bold">預約點餐</h2>
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
          <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-emerald-800 text-white p-4 rounded-xl flex justify-between items-center shadow-lg">
            <div>
              <p className="text-xs opacity-80">已選 {cart.length} 項商品</p>
              <p className="font-bold text-lg">${totalAmount}</p>
            </div>
            <button onClick={() => setShowMenu(false)} className="bg-white text-emerald-800 px-6 py-2 rounded-lg font-bold">
              確認菜單
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Progress */}
      <div className="flex justify-between px-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
              step >= s ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-gray-300 text-gray-300'
            }`}>
              {s}
            </div>
            <span className={`text-[10px] ${step >= s ? 'text-emerald-800 font-bold' : 'text-gray-400'}`}>
              {s === 1 ? '基本資訊' : s === 2 ? '預先點餐' : '確認完成'}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-xl font-bold border-l-4 border-emerald-800 pl-3">預約基本資訊</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">預約日期</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="date" 
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-emerald-500 ${isMonday ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                  value={bookingInfo.date}
                  onChange={(e) => setBookingInfo({...bookingInfo, date: e.target.value})}
                />
              </div>
              {isMonday && (
                <div className="mt-2 flex items-center gap-1 text-red-600 text-[10px] font-bold">
                  <AlertTriangle size={12} />
                  <span>抱歉，每週一為公休日，不提供訂位。</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">預約時間</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none"
                    value={bookingInfo.time}
                    onChange={(e) => setBookingInfo({...bookingInfo, time: e.target.value})}
                    disabled={isMonday}
                  >
                    <option value="">選擇時間</option>
                    <option value="11:30">11:30</option>
                    <option value="12:00">12:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">人數</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none"
                    value={bookingInfo.guests}
                    onChange={(e) => setBookingInfo({...bookingInfo, guests: parseInt(e.target.value)})}
                    disabled={isMonday}
                  >
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} 位</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">聯絡姓名</label>
              <input 
                type="text" 
                placeholder="請輸入大名"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                value={bookingInfo.name}
                onChange={(e) => setBookingInfo({...bookingInfo, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">聯絡電話</label>
              <input 
                type="tel" 
                placeholder="請輸入手機號碼"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                value={bookingInfo.phone}
                onChange={(e) => setBookingInfo({...bookingInfo, phone: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={!bookingInfo.date || !bookingInfo.time || !bookingInfo.name || !bookingInfo.phone || isMonday}
            onClick={() => setStep(2)}
            className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50"
          >
            下一步：選擇預點餐點
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-4 items-center">
            <div className="bg-amber-100 p-2 rounded-full">
              <ShoppingCart className="text-amber-600" size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-900">預點餐點 (可選)</h4>
              <p className="text-xs text-amber-700">提前點餐可縮短現場等餐時間，入座即享用。</p>
            </div>
          </div>

          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">${item.price} x {item.quantity}</p>
                </div>
                <div className="font-bold text-emerald-700">${item.price * item.quantity}</div>
              </div>
            ))}
            
            <button 
              onClick={() => setShowMenu(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-sm font-medium hover:bg-gray-50"
            >
              + 前往點餐頁面
            </button>
          </div>

          <div className="pt-4 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>預點總計</span>
              <span className="text-emerald-800">${totalAmount}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setStep(1)}
                className="py-3 bg-gray-100 text-gray-600 rounded-xl font-bold"
              >
                上一步
              </button>
              <button 
                onClick={() => setStep(3)}
                className="py-3 bg-emerald-800 text-white rounded-xl font-bold shadow-md"
              >
                確認預約
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-xl font-bold border-l-4 border-emerald-800 pl-3">最後確認</h3>
          
          <div className="bg-white border rounded-2xl overflow-hidden">
            <div className="bg-emerald-800 p-4 text-white">
              <p className="text-xs opacity-70">系統確認中...</p>
              <p className="text-lg font-bold">Bella Vita 義式廚房</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-gray-400">日期</p>
                  <p className="font-bold">{bookingInfo.date}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400">時間</p>
                  <p className="font-bold">{bookingInfo.time}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400">人數</p>
                  <p className="font-bold">{bookingInfo.guests} 人</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400">訂位人</p>
                  <p className="font-bold">{bookingInfo.name}</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200">
              {error}
            </div>
          )}

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full bg-emerald-800 text-white py-4 rounded-xl font-bold shadow-lg flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-70' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                寫入試算表中...
              </>
            ) : "確認訂位並通知 LINE 官方帳號"}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-12 space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-emerald-600" size={48} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-900">預約已完成！</h3>
            <p className="text-gray-500 mt-2">您的訂位資訊已成功同步至系統。</p>
          </div>
          <div className="px-10">
            <button 
              onClick={() => window.location.hash = '/'}
              className="w-full py-3 bg-emerald-800 text-white rounded-xl font-bold"
            >
              回到首頁
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;

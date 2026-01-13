
import React, { useState, useContext } from 'react';
import { Award, CreditCard, Gift, History, Settings, ChevronRight, LogIn, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Member: React.FC = () => {
  const { isAdmin, setIsAdmin, userPhone, setUserPhone } = useContext(AuthContext);
  const [inputPhone, setInputPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!userPhone);
  const navigate = useNavigate();

  const ADMIN_PHONES = ['0937942582', '0978375273', '0978375592'];

  const handleLogin = () => {
    if (inputPhone.length < 10) return;
    
    setUserPhone(inputPhone);
    setIsLoggedIn(true);
    
    if (ADMIN_PHONES.includes(inputPhone)) {
      setIsAdmin(true);
      alert('管理員身份驗證成功！已開啟 POS 管理權限。');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <LogIn className="text-emerald-800" size={32} />
          </div>
          <h2 className="text-2xl font-bold">會員登入</h2>
          <p className="text-xs text-gray-500">輸入手機號碼以同步您的訂位資訊與點數</p>
        </div>

        <div className="space-y-4">
          <input 
            type="tel" 
            placeholder="請輸入手機號碼"
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
            value={inputPhone}
            onChange={(e) => setInputPhone(e.target.value)}
          />
          <button 
            onClick={handleLogin}
            disabled={inputPhone.length < 10}
            className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50"
          >
            登入 / 註冊
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="bg-emerald-800 px-6 pt-10 pb-20 relative text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden bg-white/10">
            <img src="https://picsum.photos/200" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{isAdmin ? '管理員' : '林小華'}</h2>
            <p className="text-xs text-emerald-200">{userPhone}</p>
            <div className="mt-1 flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-[10px] w-fit">
              <Award size={12} />
              <span>{isAdmin ? '系統管理員' : '白銀會員'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 -mt-12 bg-white rounded-2xl shadow-xl p-6 relative z-10 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Pasta Points</p>
            <p className="text-3xl font-black text-emerald-800">1,250</p>
          </div>
          <button className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-xs font-bold border border-emerald-100">
            兌換獎勵
          </button>
        </div>

        {isAdmin && (
          <button 
            onClick={() => navigate('/pos')}
            className="w-full bg-orange-100 text-orange-800 p-4 rounded-xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} />
              <span className="font-bold">進入 POS 管理後台</span>
            </div>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      <div className="p-6 space-y-4">
        <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest">常用功能</h3>
        <div className="space-y-2">
          {[
            { icon: CreditCard, label: '錢包餘額', value: '$0', color: 'text-blue-500' },
            { icon: Gift, label: '我的優惠券', value: '3 張', color: 'text-pink-500' },
            { icon: History, label: '用餐紀錄', value: '12 次', color: 'text-orange-500' },
            { icon: Settings, label: '帳號設定', value: '', color: 'text-gray-500' },
          ].map((item, idx) => (
            <button key={idx} className="w-full flex items-center justify-between p-4 bg-white border rounded-xl group active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`${item.color} bg-white rounded-lg p-2 border shadow-sm`}>
                  <item.icon size={18} />
                </div>
                <span className="font-medium text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Member;

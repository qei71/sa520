
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ListChecks, AlertCircle, TrendingUp, DollarSign, Calendar, Users, Filter, CheckCircle, XCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { fetchAppData, updateStatusOnSheet } from '../services/sheetService';

const POSDashboard: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'today' | 'upcoming' | 'all'>('today');

  const loadData = async () => {
    const data = await fetchAppData();
    if (data) {
      setReservations(data.reservations || []);
      setStats(data.pos || [
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 2000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 },
        { name: 'Sat', sales: 6390 },
        { name: 'Sun', sales: 8490 },
      ]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const confirmMsg = newStatus === '已取消' ? '確定要取消這筆訂位嗎？' : `確定要將狀態改為「${newStatus}」嗎？`;
    if (!window.confirm(confirmMsg)) return;

    setIsUpdating(id);
    try {
      await updateStatusOnSheet(id, newStatus);
      // 即時更新本地狀態
      setReservations(prev => prev.map(res => res.id === id ? { ...res, status: newStatus } : res));
    } catch (error) {
      alert('更新失敗，請檢查網路連線或稍後再試。');
    } finally {
      setIsUpdating(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const filteredReservations = reservations.filter(res => {
    if (filterType === 'today') return res.date === today;
    if (filterType === 'upcoming') return res.date > today;
    return true;
  }).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-800 animate-spin mb-2" />
        <p className="text-sm text-gray-500">載入管理數據中...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-10">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif">POS 管理中心</h2>
          <p className="text-xs text-gray-500">數據即時同步自 Google Sheet</p>
        </div>
        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-800">
          <ShieldCheck size={24} />
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Calendar size={16} />
            <span className="text-[10px] font-bold uppercase">今日訂位</span>
          </div>
          <p className="text-2xl font-bold">{reservations.filter(r => r.date === today && r.status !== '已取消').length} 組</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Users size={16} />
            <span className="text-[10px] font-bold uppercase">今日人數</span>
          </div>
          <p className="text-2xl font-bold">
            {reservations.filter(r => r.date === today && r.status !== '已取消').reduce((acc, curr) => acc + (parseInt(curr.guests) || 0), 0)} 人
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl">
        {(['today', 'upcoming', 'all'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              filterType === type ? 'bg-white shadow-sm text-emerald-800' : 'text-gray-400'
            }`}
          >
            {type === 'today' ? '今日訂位' : type === 'upcoming' ? '即將到來' : '所有訂位'}
          </button>
        ))}
      </div>

      {/* Reservation List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <ListChecks className="text-emerald-800" size={18} />
            訂位列表 ({filteredReservations.length})
          </h3>
          <button onClick={loadData} className="text-emerald-600 text-[10px] font-bold border border-emerald-200 px-2 py-1 rounded">
            重新整理
          </button>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed">
            <p className="text-sm text-gray-400">目前沒有符合條件的訂位</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReservations.map((res) => (
              <div key={res.id} className={`bg-white p-4 rounded-2xl border shadow-sm space-y-3 transition-opacity ${res.status === '已取消' ? 'opacity-50 grayscale' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{res.name}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-100">
                        桌號: {res.桌號 || res.assignedTable || '未配'}
                      </span>
                      {res.status === '已取消' && (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">已取消</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{res.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-800">{res.time}</p>
                    <p className="text-[10px] text-gray-400">{res.date}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Users size={14} />
                      <span>{res.guests} 人</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <DollarSign size={14} />
                      <span>${res.totalAmount}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {res.status !== '已取消' && (
                      <>
                        <button 
                          disabled={isUpdating === res.id}
                          onClick={() => handleStatusUpdate(res.id, '已取消')}
                          className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50"
                          title="取消訂位"
                        >
                          {isUpdating === res.id ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                        </button>
                        <button 
                          disabled={isUpdating === res.id}
                          onClick={() => handleStatusUpdate(res.id, '已確認')}
                          className="p-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 disabled:opacity-50"
                          title="確認訂位"
                        >
                          <CheckCircle size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Chart Section */}
      <section className="bg-white p-4 rounded-2xl border shadow-sm space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-800" />
          營收趨勢圖 (一週)
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                {stats.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={index === stats.length - 1 ? '#065f46' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default POSDashboard;

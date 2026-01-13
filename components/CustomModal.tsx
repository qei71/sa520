
import React from 'react';
import { X, CheckCircle, AlertCircle, Info as InfoIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

const CustomModal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const config = {
    success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    info: { icon: InfoIcon, color: 'text-blue-500', bg: 'bg-blue-50' }
  };

  const Icon = config[type].icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
        <div className={`p-6 flex flex-col items-center text-center space-y-4 ${config[type].bg}`}>
          <div className={`${config[type].color} p-3 rounded-full bg-white shadow-sm`}>
            <Icon size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{message}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors"
        >
          確定
        </button>
      </div>
    </div>
  );
};

export default CustomModal;

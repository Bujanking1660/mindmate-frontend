import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const AlertModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', 
  onConfirm,      // Fungsi yang jalan pas klik tombol Utama
  showCancel = false, // FALSE = Alert (1 tombol), TRUE = Confirm (2 tombol)
  confirmText = 'Mengerti',
  cancelText = 'Batal'
}) => {
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const styles = {
    success: { icon: <CheckCircle size={32} />, color: "text-emerald-600", bgIcon: "bg-emerald-100", btn: "bg-emerald-600 hover:bg-emerald-700", border: "border-emerald-100" },
    error:   { icon: <AlertCircle size={32} />, color: "text-rose-600", bgIcon: "bg-rose-100", btn: "bg-rose-600 hover:bg-rose-700", border: "border-rose-100" },
    warning: { icon: <AlertTriangle size={32} />, color: "text-orange-600", bgIcon: "bg-orange-100", btn: "bg-orange-500 hover:bg-orange-600", border: "border-orange-100" },
    info:    { icon: <Info size={32} />, color: "text-blue-600", bgIcon: "bg-blue-100", btn: "bg-blue-600 hover:bg-blue-700", border: "border-blue-100" }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300">
      <div className={`bg-white rounded-4xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200 border ${currentStyle.border} p-6 relative`}>

        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${currentStyle.bgIcon} ${currentStyle.color}`}>
            {currentStyle.icon}
          </div>
          
          <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-6">{message}</p>

          <div className="flex gap-3 w-full">
            {/* TOMBOL BATAL (Hanya muncul jika showCancel = true) */}
            {showCancel && (
                <button 
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 transition-all"
                >
                {cancelText}
                </button>
            )}
            
            {/* TOMBOL UTAMA (Confirm) */}
            <button
                onClick={() => {
                    if (onConfirm) onConfirm(); // Jalankan aksi (navigate/logout dll)
                    onClose(); // Baru tutup modal
                }}
                className={`flex-1 py-3.5 rounded-xl text-white font-bold shadow-lg shadow-slate-200 active:scale-95 transition-all ${currentStyle.btn}`}
            >
                {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
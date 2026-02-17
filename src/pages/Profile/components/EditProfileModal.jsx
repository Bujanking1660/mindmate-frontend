import React, { useState, useEffect } from "react";
import { X, User, Camera, Lock, AtSign } from "lucide-react";

const EditProfileModal = ({ isOpen, onClose, initialData, onUpdate }) => {
  // Mengganti 'gender' dengan 'password' agar sesuai dengan input field
  const [formData, setFormData] = useState({
    username: "",
    password: "", 
    photoUrl: ""
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        username: initialData.username || "",
        password: "", // Password biasanya dikosongkan untuk keamanan
        photoUrl: initialData.photoUrl || ""
      });
      setPreviewImage(initialData.photoUrl || null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  // Simulasi handle gambar (Frontend Only Preview)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      // Di sini nanti logika upload ke backend
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-900/20 relative animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800">Edit Profile</h2>
            <button 
                onClick={onClose}
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
                <X size={20} strokeWidth={2.5} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* --- Avatar Upload Section --- */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-full border-4 border-slate-50 shadow-inner overflow-hidden relative bg-slate-100">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={48} />
                  </div>
                )}
                
                {/* Overlay Hover Effect */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="text-white drop-shadow-md" size={32} />
                </div>
              </div>

              {/* Input File Tersembunyi */}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-4 border-white shadow-sm text-white pointer-events-none">
                 <Camera size={16} />
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-wider">Tap to change photo</p>
          </div>

          {/* --- Input Fields --- */}
          <div className="space-y-5 mt-2">
            
            {/* Username Input */}
            <div className="group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-blue-600 transition-colors">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <AtSign size={18} />
                </div>
                <input 
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-slate-800 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    placeholder="Username kamu"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-blue-600 transition-colors">
                New Password
              </label>
              <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                </div>
                <input 
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-slate-800 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 ml-1">
                Biarkan kosong jika tidak ingin mengubah password.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
             <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
             >
                Batal
             </button>
             <button 
                type="submit"
                className="flex-2 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all"
             >
                Simpan Perubahan
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
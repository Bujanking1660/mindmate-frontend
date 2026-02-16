import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";

const EditProfileModal = ({ isOpen, onClose, initialData, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    photoUrl: ""
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Set data awal saat modal dibuka
  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || "",
        gender: initialData.gender || "",
        photoUrl: initialData.photoUrl || ""
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Container Modal (Warna Biru sesuai gambar) */}
      <div className="bg-[#D9EFFF] w-full max-w-sm rounded-[45px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X size={24} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          
          {/* Avatar Section */}
          <div className="relative mb-2">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
              {previewImage || formData.photoUrl ? (
                <img 
                  src={previewImage || formData.photoUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={60} className="text-blue-300 " />
              )}
            </div>
          </div>

          {/* Change Picture Button */}
          <button 
            type="button"
            className="text-slate-800 font-bold text-lg mb-8 hover:opacity-70 transition-opacity"
          >
            Change Picture
          </button>

          {/* Input Fields */}
          <div className="w-full space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xl font-bold text-slate-900 ml-1">Name</label>
              <input 
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-white rounded-2xl py-4 px-6 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                placeholder="Enter your name"
              />
            </div>

            {/* Gender Input */}
            <div className="space-y-2">
              <label className="text-xl font-bold text-slate-900 ml-1">Password</label>
              <input 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white rounded-2xl py-4 px-6 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                placeholder="Enter new password"
              />
            </div>
          </div>

          {/* Update Button (Hitam Gelap) */}
          <button 
            type="submit"
            className="w-full mt-10 bg-[#333333] text-white font-bold py-5 rounded-[20px] text-xl shadow-lg hover:bg-black transition-all active:scale-[0.98]"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
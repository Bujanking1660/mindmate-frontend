import { Check, X } from "lucide-react";

const MoodInputModal = ({
  isOpen, onClose, isEditing, moodTypes, selectedMood, onMoodChange, getMoodStyle, availableTags, selectedTagIds, onToggleTag, moodNote, onNoteChange, onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      
      <div className="bg-white w-full max-w-lg rounded-4xl shadow-2xl scale-100 animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
        
        {/* Header Gradient */}
        <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-blue-50 to-transparent pointer-events-none"></div>
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all shadow-sm">
          <X size={18} />
        </button>

        <div className="relative z-10 px-5 py-6 md:p-8 flex flex-col h-full overflow-y-auto no-scrollbar">
          
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-1">
                {isEditing ? "Edit Mood" : "Apa Mood Kamu?"}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
                {isEditing ? "Perbarui mood harianmu." : "Pilih yang mewakili perasaanmu."}
            </p>
          </div>

          {/* --- MOOD SELECTOR (GRID SYSTEM) --- */}
          {/* Menggunakan Grid 5 Kolom: Pasti 1 Baris Rapi */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-6 w-full">
            {moodTypes.map((m) => {
              const style = getMoodStyle(m.id);
              const isSelected = selectedMood && String(selectedMood?.id) === String(m.id);
              
              return (
                <button 
                    key={m.id} 
                    onClick={() => onMoodChange(m)} 
                    className={`
                      group flex flex-col items-center justify-center gap-1.5 transition-all duration-300 
                      rounded-2xl border border-transparent w-full aspect-3/4 sm:aspect-square
                      
                      ${isSelected 
                          ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/30 scale-105 -translate-y-1' 
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:scale-105'
                      }
                    `}
                >
                  {/* Image: Ukuran dinamis (kecil di HP, sedang di Tablet) */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                    <img 
                        src={style.image} 
                        alt={m.moodName} 
                        className={`w-full h-full object-contain drop-shadow-sm transition-transform duration-300 
                        ${isSelected ? 'scale-110' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`} 
                    />
                  </div>

                  {/* Text: Ukuran font sangat kecil di HP agar tidak pecah */}
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center leading-tight ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {m.moodName}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Tags Selector */}
          {selectedMood && availableTags.length > 0 && (
            <div className="mb-6 animate-in slide-in-from-bottom-2 fade-in duration-500">
              <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-center">
                Kenapa?
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto pr-1">
                {availableTags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button 
                        key={tag.id} 
                        onClick={() => onToggleTag(tag.id)}
                        className={`
                            px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-200 border
                            ${isSelected
                                ? `bg-blue-50 text-blue-600 border-blue-200 shadow-sm`
                                : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                            }
                        `}
                    >
                      #{tag.tagName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Note Area */}
          <div className="mb-6 flex-1 min-h-20">
             <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">
                Catatan
             </label>
             <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all resize-none h-24 sm:h-28 placeholder:text-slate-400" 
                placeholder="Cerita dikit dong..." 
                value={moodNote} 
                onChange={(e) => onNoteChange(e.target.value)}
             />
          </div>

          <button 
            onClick={onSave} 
            disabled={!selectedMood} 
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 sm:py-4 rounded-xl shadow-lg shadow-slate-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] text-sm sm:text-base mt-auto"
          >
            <Check size={18} strokeWidth={3} /> 
            {isEditing ? "Simpan" : "Simpan Mood"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodInputModal;
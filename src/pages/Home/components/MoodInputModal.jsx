import { Check, X } from "lucide-react";

const MoodInputModal = ({
  isOpen, onClose, isEditing, moodTypes, selectedMood, onMoodChange, getMoodStyle, availableTags, selectedTagIds, onToggleTag, moodNote, onNoteChange, onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl scale-100 animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
        
        {/* Header Gradient */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none"></div>
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-white rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all shadow-sm">
          <X size={20} />
        </button>

        <div className="relative z-10 p-8 md:p-10 flex flex-col h-full overflow-y-auto no-scrollbar">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-800 mb-2">
                {isEditing ? "Edit Mood" : "Apa Mood Kamu?"}
            </h2>
            <p className="text-slate-500 font-medium">
                {isEditing ? "Perbarui catatan mood kamu." : "Pilih emotikon yang mewakili perasaanmu."}
            </p>
          </div>

          {/* Mood Selector (Horizontal Scroll) */}
          <div className="flex justify-center gap-2 mb-8 overflow-x-auto py-2 px-1 pb-4">
            {moodTypes.map((m) => {
              const style = getMoodStyle(m.id);
              const isSelected = selectedMood && String(selectedMood?.id) === String(m.id);
              
              return (
                <button 
                    key={m.id} 
                    onClick={() => onMoodChange(m)} 
                    className={`
                        group flex flex-col items-center gap-3 transition-all duration-300 p-4 rounded-[1.5rem] min-w-[5rem]
                        ${isSelected 
                            ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/30 scale-110 -translate-y-2' 
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:scale-105'
                        }
                    `}
                >
                  <img 
                    src={style.image} 
                    alt={m.moodName} 
                    className={`w-12 h-12 object-contain drop-shadow-sm transition-transform duration-300 ${isSelected ? 'scale-110' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`} 
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{m.moodName}</span>
                </button>
              )
            })}
          </div>

          {/* Tags Selector */}
          {selectedMood && availableTags.length > 0 && (
            <div className="mb-8 animate-in slide-in-from-bottom-2 fade-in duration-500">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 text-center">
                Apa yang membuatmu merasa begini?
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {availableTags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button 
                        key={tag.id} 
                        onClick={() => onToggleTag(tag.id)}
                        className={`
                            px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border-2
                            ${isSelected
                                ? `bg-blue-50 text-blue-600 border-blue-200 shadow-sm transform scale-105`
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
          <div className="mb-8">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">
                Catatan Jurnal (Opsional)
             </label>
             <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all resize-none min-h-[120px] placeholder:text-slate-400" 
                placeholder="Ceritakan sedikit tentang harimu..." 
                value={moodNote} 
                onChange={(e) => onNoteChange(e.target.value)}
             />
          </div>

          <button 
            onClick={onSave} 
            disabled={!selectedMood} 
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl shadow-xl shadow-slate-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Check size={20} strokeWidth={3} /> 
            {isEditing ? "Simpan Perubahan" : "Simpan Mood"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodInputModal;
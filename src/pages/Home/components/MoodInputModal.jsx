// src/pages/Home/components/MoodInputModal.jsx
import { Check } from "lucide-react";

const MoodInputModal = ({
  isOpen,
  onClose,
  isEditing,
  moodTypes,
  selectedMood,
  onMoodChange,
  getMoodStyle,
  availableTags,
  selectedTagIds,
  onToggleTag,
  moodNote,
  onNoteChange,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-blue-50 to-white pointer-events-none"></div>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-white/50 rounded-full hover:bg-slate-100 transition-colors">
          <span className="sr-only">Close</span>
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="relative z-10 text-center flex flex-col h-full overflow-y-auto no-scrollbar">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{isEditing ? "Edit Entry" : "How's your day?"}</h2>
          <p className="text-slate-500 text-sm mb-6">{isEditing ? "Update your mood details." : "Track your mood to build your streak."}</p>

          {/* Mood Selector */}
          <div className="flex justify-between gap-1 mb-6 overflow-x-auto py-2 px-1 scrollbar-hide shrink-0">
            {moodTypes.map((m) => {
              const style = getMoodStyle(m.id);
              const isSelected = selectedMood && String(selectedMood?.id) === String(m.id);
              return (
                <button key={m.id} onClick={() => onMoodChange(m)} className={`group flex flex-col items-center gap-2 transition-all duration-200 p-2 rounded-2xl ${isSelected ? 'bg-slate-50 scale-110 -translate-y-1 ring-2 ring-slate-100' : 'opacity-60 hover:opacity-100 hover:bg-gray-50'}`}>
                  <img src={style.image} alt={m.moodName} width="48" height="48" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-110" />
                  <span className={`text-[10px] font-bold uppercase ${isSelected ? style.textColor : 'text-slate-400'}`}>{m.moodName}</span>
                </button>
              )
            })}
          </div>

          {/* Tags Selector */}
          {selectedMood && availableTags.length > 0 && (
            <div className="mb-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <p className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">What are you feeling?</p>
              <div className="flex flex-wrap gap-2 justify-start">
                {availableTags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button key={tag.id} onClick={() => onToggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 
                            ${isSelected
                          ? `bg-slate-800 text-white border-slate-800 shadow-md transform scale-105`
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}>
                      {tag.tagName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <textarea 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none mb-6 placeholder:text-slate-400 min-h-20" 
            rows="3" 
            placeholder="Why do you feel this way? (Optional)" 
            value={moodNote} 
            onChange={(e) => onNoteChange(e.target.value)}>    
          </textarea>

          <button onClick={onSave} disabled={!selectedMood} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 shrink-0">
            <Check size={18} strokeWidth={3} /> {isEditing ? "Update Entry" : "Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodInputModal;
import React from 'react';
import { X, Heart, Shield, Lock, Eye, Sun } from 'lucide-react';
import { NPCState } from '../gameTypes';

interface NPCDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  npcs: Record<string, NPCState>;
}

export const NPCDrawer: React.FC<NPCDrawerProps> = ({
  isOpen,
  onClose,
  npcs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-amber-950/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200 font-sans">
      <div 
        className="w-full max-w-md bg-[#fefce8] border-2 border-amber-300 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-amber-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-black tracking-wider text-amber-950 uppercase">
              战队人物心智与密约档案 (NPC MEMORIES)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* NPC Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.values(npcs).map((npc) => {
            return (
              <div
                key={npc.id}
                className="p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-sm space-y-3"
              >
                {/* NPC Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center font-black text-sm text-amber-900 shadow-inner">
                      {npc.avatarText}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                        {npc.name}
                        {npc.id === 'lin_yuan' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 font-bold">
                            密约对象
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-amber-800 font-medium">{npc.role}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Meters */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-amber-200">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold mb-1">
                      <span>好感</span>
                      <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                    </div>
                    <div className="font-mono text-sm font-black text-amber-950">
                      {npc.favor}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold mb-1">
                      <span>屈服/支配</span>
                      <Shield className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <div className="font-mono text-sm font-black text-orange-700">
                      {npc.submission}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold mb-1">
                      <span>警惕</span>
                      <Eye className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                    <div className="font-mono text-sm font-black text-amber-950">
                      {npc.suspicion}%
                    </div>
                  </div>
                </div>

                {/* Dynamic Micro-expression */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950">
                  <div className="text-[10px] font-bold text-amber-800 mb-0.5">当下心境与微表情</div>
                  <p className="italic font-serif text-amber-900">“{npc.mood}”</p>
                </div>

                {/* Secret & Blackmail Info */}
                {npc.secrets && npc.secrets.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-rose-800 font-black mb-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>掌握的致命把柄与密约约束</span>
                    </div>
                    <ul className="list-disc list-inside text-rose-900 space-y-0.5 text-[11px] font-medium">
                      {npc.secrets.map((sec, i) => (
                        <li key={i}>{sec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

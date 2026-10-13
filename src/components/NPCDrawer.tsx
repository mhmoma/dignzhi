import React from 'react';
import { X, Heart, Shield, Lock, Eye, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <h3 className="text-sm font-bold tracking-wider text-zinc-100 uppercase">
              战队人物心智与把柄档案 (NPC MEMORIES)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-850 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NPC Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.values(npcs).map((npc) => {
            return (
              <div
                key={npc.id}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3"
              >
                {/* NPC Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-200 shadow-inner">
                      {npc.avatarText}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                        {npc.name}
                        {npc.id === 'lin_yuan' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 border border-red-800 text-red-400">
                            玄关密约对象
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-zinc-400">{npc.role}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Meters */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-850/80">
                  <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-850">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                      <span>好感</span>
                      <Heart className="w-3 h-3 text-pink-400" />
                    </div>
                    <div className="font-mono text-sm font-bold text-zinc-200">
                      {npc.favor}%
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-850">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                      <span>屈服/支配</span>
                      <Shield className="w-3 h-3 text-red-400" />
                    </div>
                    <div className="font-mono text-sm font-bold text-red-400">
                      {npc.submission}%
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-850">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                      <span>警惕</span>
                      <Eye className="w-3 h-3 text-amber-400" />
                    </div>
                    <div className="font-mono text-sm font-bold text-zinc-300">
                      {npc.suspicion}%
                    </div>
                  </div>
                </div>

                {/* Dynamic Micro-expression */}
                <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-850 text-xs text-zinc-300">
                  <div className="text-[10px] font-mono text-zinc-500 mb-0.5">当下心境与微表情</div>
                  <p className="italic text-zinc-400 font-serif">“{npc.mood}”</p>
                </div>

                {/* Secret & Blackmail Info */}
                {npc.secrets && npc.secrets.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-xs">
                    <div className="flex items-center gap-1 text-[10px] text-red-400 font-bold mb-1">
                      <Lock className="w-3 h-3" />
                      <span>掌握的致命把柄与协议约束</span>
                    </div>
                    <ul className="list-disc list-inside text-zinc-400 space-y-0.5 text-[11px]">
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

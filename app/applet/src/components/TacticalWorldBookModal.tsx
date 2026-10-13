import React, { useState } from 'react';
import { X, BookOpen, Shield, Zap, Target, Eye, Sun } from 'lucide-react';
import { TACTICAL_WORLD_BOOK } from '../game/constants';
import { TacticalWorldBookEntry } from '../gameTypes';

interface TacticalWorldBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TacticalWorldBookModal: React.FC<TacticalWorldBookModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string>(TACTICAL_WORLD_BOOK[0]?.id || 'wave_management');

  if (!isOpen) return null;

  const currentEntry = TACTICAL_WORLD_BOOK.find((e: TacticalWorldBookEntry) => e.id === selectedEntryId) || TACTICAL_WORLD_BOOK[0];

  const getCategoryBadge = (cat: TacticalWorldBookEntry['category']) => {
    switch (cat) {
      case 'minion': return { label: '兵线运营', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'objective': return { label: '控龙斩杀', color: 'bg-orange-100 text-orange-900 border-orange-300' };
      case 'jungle': return { label: '野辅联动', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'vision': return { label: '视野博弈', color: 'bg-sky-100 text-sky-900 border-sky-300' };
      default: return { label: '战术博弈', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-amber-950/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200 font-sans">
      <div 
        className="w-full max-w-lg bg-[#fefce8] border-2 border-amber-300 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-amber-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-black tracking-wider text-amber-950 uppercase">
              王者荣耀核心战术知识库 (WORLD BOOK)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
          {/* Left: Entry List */}
          <div className="w-full sm:w-2/5 space-y-2">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">
              战术知识词条列表
            </div>
            {TACTICAL_WORLD_BOOK.map((entry: TacticalWorldBookEntry) => {
              const isSelected = entry.id === selectedEntryId;
              const badge = getCategoryBadge(entry.category);
              return (
                <button
                  key={entry.id}
                  onClick={() => setSelectedEntryId(entry.id)}
                  className={`w-full text-left p-3 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                      : 'bg-white hover:bg-amber-100 text-amber-950 border-amber-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full border ${isSelected ? 'bg-white/20 text-white border-white/40' : badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="text-xs font-black truncate">{entry.title}</div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed View */}
          <div className="w-full sm:w-3/5 p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <h4 className="text-sm font-black text-amber-950">{currentEntry?.title}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                  职业级解析
                </span>
              </div>

              <div>
                <div className="text-[10px] font-bold text-amber-700 uppercase mb-1">核心摘要</div>
                <p className="text-xs text-amber-900 font-medium leading-relaxed">{currentEntry?.summary}</p>
              </div>

              <div>
                <div className="text-[10px] font-bold text-amber-700 uppercase mb-1">机制与细节深度解构</div>
                <p className="text-xs text-amber-950 font-serif leading-relaxed">{currentEntry?.detail}</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-[10px] font-bold text-orange-700 uppercase mb-1">赛事博弈实战影响</div>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">{currentEntry?.tacticalImpact}</p>
              </div>
            </div>

            <div className="text-[10px] text-amber-700 text-center font-mono pt-2 border-t border-amber-200">
              AI叙事引擎已自动挂载此知识库词条进行深度博弈推演
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

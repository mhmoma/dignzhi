import React from 'react';
import { Shield, BookOpen, KeyRound, Save, RotateCcw, Sun } from 'lucide-react';
import { PlayerStats, NPCState, ObjectMemory } from '@/src/gameTypes';

interface TopNavProps {
  characterName: string;
  stats: PlayerStats;
  npcs: Record<string, NPCState>;
  objects: ObjectMemory[];
  onOpenNPCs: () => void;
  onOpenObjects: () => void;
  onOpenSaves: () => void;
  onReturnTitle: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  characterName,
  stats,
  npcs,
  objects,
  onOpenNPCs,
  onOpenObjects,
  onOpenSaves,
  onReturnTitle,
}) => {
  const linYuan = npcs.lin_yuan;
  const highRiskObjects = objects.filter(o => o.riskLevel === 'HIGH').length;

  return (
    <header className="sticky top-0 z-40 bg-amber-100/90 backdrop-blur-md border-b border-amber-300/80 px-4 py-2.5 flex items-center justify-between text-amber-950 shadow-sm">
      {/* Brand & Identity */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400 flex items-center justify-center font-black text-xs text-white tracking-widest shadow-sm">
          青
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-wider text-amber-900">
              {characterName || '林冬夏'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200/80 border border-amber-300 text-amber-800 font-mono">
              青训生
            </span>
          </div>
          <p className="text-[10px] text-amber-700/80">阳光校园电竞社 · 野区中枢</p>
        </div>
      </div>

      {/* Quick Action Badges */}
      <div className="flex items-center gap-1.5">
        {/* Lin Yuan status indicator */}
        {linYuan && (
          <button
            onClick={onOpenNPCs}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-[11px] text-amber-900 transition-colors shadow-xs"
            title="查看NPC心智与把柄"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>林鸢</span>
            <span className="text-[10px] font-mono text-orange-700 font-bold">
              {linYuan.submission}%屈
            </span>
          </button>
        )}

        {/* Object memory trigger */}
        <button
          onClick={onOpenObjects}
          className="relative flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-[11px] text-amber-900 transition-colors shadow-xs"
          title="客体印记与把柄库"
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">客体</span>
          <span className="text-[10px] font-mono text-amber-800 font-bold">
            {objects.length}
          </span>
          {highRiskObjects > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-amber-100" />
          )}
        </button>

        {/* Save/Load Trigger */}
        <button
          onClick={onOpenSaves}
          className="p-1.5 rounded-md bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-amber-800 hover:text-amber-950 transition-colors shadow-xs"
          title="本地存档与回档"
        >
          <Save className="w-3.5 h-3.5 text-amber-600" />
        </button>

        {/* Title Return */}
        <button
          onClick={onReturnTitle}
          className="p-1.5 rounded-md bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-amber-700 hover:text-amber-950 transition-colors shadow-xs"
          title="返回主界面"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

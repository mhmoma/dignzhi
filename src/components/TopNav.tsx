import React from 'react';
import { Shield, BookOpen, KeyRound, Save, RotateCcw } from 'lucide-react';
import { PlayerStats, NPCState, ObjectMemory } from '../gameTypes';

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
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between text-zinc-100">
      {/* Brand & Identity */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-zinc-900 border border-red-500/40 flex items-center justify-center font-black text-xs text-white tracking-widest shadow-inner">
          赤
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-wider text-zinc-200">
              {characterName || '林冬夏'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-red-400 font-mono">
              ID: 川
            </span>
          </div>
          <p className="text-[10px] text-zinc-500">赤霄战队 · 野区中枢</p>
        </div>
      </div>

      {/* Quick Action Badges */}
      <div className="flex items-center gap-1.5">
        {/* Lin Yuan status indicator */}
        {linYuan && (
          <button
            onClick={onOpenNPCs}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 transition-colors"
            title="查看NPC心智与把柄"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span>林鸢</span>
            <span className="text-[10px] font-mono text-red-400 font-bold">
              {linYuan.submission}%屈
            </span>
          </button>
        )}

        {/* Object memory trigger */}
        <button
          onClick={onOpenObjects}
          className="relative flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 transition-colors"
          title="客体印记与把柄库"
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">客体</span>
          <span className="text-[10px] font-mono text-zinc-400 font-bold">
            {objects.length}
          </span>
          {highRiskObjects > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-zinc-950" />
          )}
        </button>

        {/* Save/Load Trigger */}
        <button
          onClick={onOpenSaves}
          className="p-1.5 rounded-md bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          title="本地存档与回档"
        >
          <Save className="w-3.5 h-3.5 text-blue-400" />
        </button>

        {/* Title Return */}
        <button
          onClick={onReturnTitle}
          className="p-1.5 rounded-md bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          title="返回主界面"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

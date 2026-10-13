import React from 'react';
import { Play, FolderOpen, Info, Shield, Flame, Terminal } from 'lucide-react';
import { GameSaveSlot } from '../gameTypes';

interface TitleScreenProps {
  onStartNew: () => void;
  onOpenSaves: () => void;
  autoSaveSlot: GameSaveSlot | null;
  onContinueAutoSave: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartNew,
  onOpenSaves,
  autoSaveSlot,
  onContinueAutoSave,
}) => {
  return (
    <div className="relative flex flex-col min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Background Ambience Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(220,38,38,0.18),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,58,138,0.12),transparent_50%)]" />

      {/* Grid line overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-between max-w-md mx-auto w-full px-6 py-10">
        {/* Top Header Label */}
        <div className="flex items-center justify-between text-xs tracking-widest uppercase text-zinc-500 font-mono">
          <span className="flex items-center gap-1.5 text-red-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            CHIXIAO ESPORTS // DIVISION I
          </span>
          <span>BUILD 1.0.4 // LOCAL ENGINE</span>
        </div>

        {/* Central Title Display */}
        <div className="my-auto py-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-4 tracking-wider">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>成人现实向 · 电竞青训暗流与权力博弈</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2 font-sans">
            野区支配法则
          </h1>
          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-zinc-400 tracking-wider mb-6">
            CHIXIAO: DOMINION
          </p>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto mb-8 font-serif">
            “在电竞舞台的千万聚光灯下，残血的人头被你精确喂入首发中单的口中。而更衣室套间的秘密协议，才是你真正掌权的开始。”
          </p>

          {/* Action Button Matrix */}
          <div className="space-y-3 max-w-xs mx-auto w-full">
            {autoSaveSlot && (
              <button
                onClick={onContinueAutoSave}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-950/40 border border-red-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>继续最近推演</span>
                <span className="text-[10px] opacity-75 font-normal">
                  ({autoSaveSlot.title.slice(0, 8)}...)
                </span>
              </button>
            )}

            <button
              onClick={onStartNew}
              className={`w-full py-3.5 px-4 rounded-xl ${
                autoSaveSlot 
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/80' 
                  : 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-lg shadow-red-950/40 border border-red-500/30 font-bold'
              } text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.99]`}
            >
              <Terminal className="w-4 h-4" />
              <span>开启新青训生涯</span>
            </button>

            <button
              onClick={onOpenSaves}
              className="w-full py-3 px-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border border-zinc-800 text-sm tracking-wide flex items-center justify-center gap-2 transition-all"
            >
              <FolderOpen className="w-4 h-4 text-blue-400" />
              <span>本地存档管理</span>
            </button>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="pt-6 border-t border-zinc-900 grid grid-cols-3 gap-2 text-center text-[10px] text-zinc-500">
          <div className="p-2 rounded-lg bg-zinc-900/40 border border-zinc-900">
            <span className="block text-zinc-300 font-bold mb-0.5">无平台绑架</span>
            纯浏览器本地持久化
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/40 border border-zinc-900">
            <span className="block text-red-400 font-bold mb-0.5">客体记忆</span>
            协议·把柄·实体印记
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/40 border border-zinc-900">
            <span className="block text-amber-400 font-bold mb-0.5">深层心计</span>
            拒绝廉价AI对话框
          </div>
        </div>
      </div>
    </div>
  );
};

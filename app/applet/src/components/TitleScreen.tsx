import React from 'react';
import { Play, FolderOpen, Flame, Terminal, Sun, Sparkles, Trophy } from 'lucide-react';
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
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-[#fefce8] via-[#fffbeb] to-[#fef3c7] text-amber-950 overflow-hidden font-sans">
      {/* Background Sunshine Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(245,158,11,0.2),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />

      {/* Grid line overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#b45309 1px, transparent 1px), linear-gradient(90deg, #b45309 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-between max-w-md mx-auto w-full px-6 py-10">
        {/* Top Header Label */}
        <div className="flex items-center justify-between text-xs tracking-widest uppercase text-amber-800 font-mono">
          <span className="flex items-center gap-1.5 text-amber-900 font-black">
            <Sun className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '12s' }} />
            CHIXIAO CAMPUS // DIVISION I
          </span>
          <span className="bg-amber-200 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-300">
            SUNSHINE EDITION
          </span>
        </div>

        {/* Central Title Display */}
        <div className="my-auto py-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-xs text-amber-900 mb-5 tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold">阳光校园风 · 电竞青训与权力博弈</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-amber-950 mb-3 font-sans">
            野区支配法则
          </h1>

          <p className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-amber-900 tracking-wider mb-6">
            CHIXIAO: SUNSHINE CAMPUS DOMINION
          </p>

          <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed max-w-xs mx-auto mb-8 font-serif bg-white/70 p-4 rounded-2xl border border-amber-200 shadow-sm">
            “在阳光灿烂的电竞大学城里，残血的野区资源与首发中单的信任被你完美掌控。签下青春契约，开启无畏的荣耀逐梦之旅。”
          </p>

          {/* Action Button Matrix */}
          <div className="space-y-3.5 max-w-xs mx-auto w-full">
            {autoSaveSlot && (
              <button
                onClick={onContinueAutoSave}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-sm tracking-wide shadow-lg shadow-amber-950/20 border border-amber-400 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>继续最近青训推演</span>
                <span className="text-[10px] opacity-75 font-normal">
                  ({autoSaveSlot.title.slice(0, 8)}...)
                </span>
              </button>
            )}

            <button
              onClick={onStartNew}
              className={`w-full py-4 px-4 rounded-2xl ${
                autoSaveSlot 
                  ? 'bg-white hover:bg-amber-50 text-amber-950 border-2 border-amber-300 shadow-md font-black' 
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-950/20 border border-amber-400 font-black'
              } text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.99]`}
            >
              <Terminal className="w-4 h-4" />
              <span>签署合同 · 开启新青训生涯</span>
            </button>

            <button
              onClick={onOpenSaves}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <FolderOpen className="w-4 h-4 text-amber-700" />
              <span>本地存档与读档管理</span>
            </button>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="pt-6 border-t border-amber-300 grid grid-cols-3 gap-2 text-center text-[10px] text-amber-900">
          <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200 shadow-xs">
            <span className="block text-amber-950 font-black mb-0.5">纯净本地</span>
            浏览器持久化存储
          </div>
          <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200 shadow-xs">
            <span className="block text-orange-700 font-black mb-0.5">纸质合同</span>
            真实沉浸角色档案
          </div>
          <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200 shadow-xs">
            <span className="block text-amber-700 font-black mb-0.5">王者博弈</span>
            专业战术知识库
          </div>
        </div>
      </div>
    </div>
  );
};

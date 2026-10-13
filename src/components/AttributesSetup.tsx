import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Zap, Brain, Trophy, RotateCcw } from 'lucide-react';
import { PlayerStats } from '../gameTypes';
import { INITIAL_STATS_PRESETS } from '../game/constants';

interface AttributesSetupProps {
  onBack: () => void;
  onConfirm: (characterName: string, stats: PlayerStats) => void;
}

export const AttributesSetup: React.FC<AttributesSetupProps> = ({
  onBack,
  onConfirm,
}) => {
  const [characterName, setCharacterName] = useState<string>('林冬夏');
  const [activePreset, setActivePreset] = useState<string>('tyrant');
  const [stats, setStats] = useState<PlayerStats>({ ...INITIAL_STATS_PRESETS.tyrant.stats });
  const [availableBonus, setAvailableBonus] = useState<number>(10);

  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    setStats({ ...INITIAL_STATS_PRESETS[presetKey].stats });
    setAvailableBonus(10);
  };

  const handleAdjustStat = (key: keyof PlayerStats, delta: number) => {
    if (delta > 0 && availableBonus <= 0) return;
    if (delta < 0 && stats[key] <= 50) return;

    setStats(prev => ({
      ...prev,
      [key]: prev[key] + delta,
    }));
    setAvailableBonus(prev => prev - delta);
  };

  const statMeta = [
    {
      key: 'jungleControl' as keyof PlayerStats,
      label: '野区支配 / 算力',
      icon: Zap,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400',
      desc: '决定控图嗅觉、击杀让头精准度与造神效率。'
    },
    {
      key: 'coldMind' as keyof PlayerStats,
      label: '冷彻 / 心理博弈',
      icon: Brain,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400',
      desc: '决定更衣室威慑、把柄拿捏与高压下的冷血决断。'
    },
    {
      key: 'mechanics' as keyof PlayerStats,
      label: '极限微操 / 反应',
      icon: ShieldCheck,
      color: 'text-red-400',
      bgColor: 'bg-red-400',
      desc: '决定个人单挑实力、极限越塔与绝境反杀概率。'
    },
    {
      key: 'prestige' as keyof PlayerStats,
      label: '战队声望 / 权柄',
      icon: Trophy,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400',
      desc: '决定在韩教练面前的BP话语权与粉丝舆论公关。'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 max-w-md mx-auto w-full px-5 py-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>重选起点</span>
        </button>
        <span className="text-[11px] font-mono text-zinc-500 uppercase">
          STAGE 02 // CHARACTER SETUP
        </span>
      </div>

      <div className="mb-5">
        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          角色身份与核心算力
        </h2>
        <p className="text-xs text-zinc-400">
          设定你的真名、比赛代号以及在青训体系中所展现的隐秘天赋。
        </p>
      </div>

      {/* Name Input Card */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 mb-5 space-y-3">
        <div>
          <label className="block text-[11px] font-mono text-zinc-400 mb-1">
            选手本名 (默认: 林冬夏)
          </label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value.trim() || '林冬夏')}
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            placeholder="输入姓名..."
          />
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-zinc-800/80">
          <span>比赛官方注册ID</span>
          <span className="font-mono text-red-400 font-bold tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
            CHIXIAO · 川
          </span>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-5">
        <label className="block text-[11px] font-mono text-zinc-400 mb-2">
          初始执念天赋路线
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(INITIAL_STATS_PRESETS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`p-2.5 rounded-lg text-left border transition-all text-xs ${
                activePreset === key
                  ? 'bg-zinc-900 border-red-500 text-white font-bold'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="truncate mb-0.5">{item.label.split(' ')[0]}</div>
              <div className="text-[10px] text-zinc-500 truncate">{item.label.split(' ')[1] || ''}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Allocation Matrix */}
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/90 mb-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
          <span className="font-bold text-zinc-300">核心算力微调</span>
          <span className="text-[11px] text-zinc-400">
            可自由分配点数: <strong className="text-red-400 font-mono text-sm">{availableBonus}</strong>
          </span>
        </div>

        <div className="space-y-3.5">
          {statMeta.map(({ key, label, icon: Icon, color, desc }) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="font-medium">{label}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-zinc-100 w-8 text-right">
                    {stats[key]}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleAdjustStat(key, -5)}
                      disabled={stats[key] <= 50}
                      className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleAdjustStat(key, 5)}
                      disabled={availableBonus < 5}
                      className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation */}
      <div className="mt-auto pt-2">
        <button
          onClick={() => onConfirm(characterName, stats)}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-950/40 border border-red-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <span>进入青训赛场 · 开启叙事推演</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

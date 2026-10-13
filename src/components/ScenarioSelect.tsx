import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldAlert, Sparkles, MapPin, Zap } from 'lucide-react';
import { SCENARIO_LIST, ScenarioDefinition } from '../game/constants';

interface ScenarioSelectProps {
  onBack: () => void;
  onSelectScenario: (scenario: ScenarioDefinition) => void;
}

export const ScenarioSelect: React.FC<ScenarioSelectProps> = ({
  onBack,
  onSelectScenario,
}) => {
  const [selectedId, setSelectedId] = useState<string>(SCENARIO_LIST[0].id);
  const currentScenario = SCENARIO_LIST.find(s => s.id === selectedId) || SCENARIO_LIST[0];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 max-w-md mx-auto w-full px-5 py-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回主页</span>
        </button>
        <span className="text-[11px] font-mono text-zinc-500 uppercase">
          STAGE 01 // SCENARIO ORIGIN
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          选择开局起点
        </h2>
        <p className="text-xs text-zinc-400">
          不同的初始节点将决定你在赤霄战队的最初话语权与更衣室暗流关系。
        </p>
      </div>

      {/* Scenario Selection Cards */}
      <div className="space-y-3 mb-6">
        {SCENARIO_LIST.map((sc) => {
          const isSelected = sc.id === selectedId;
          return (
            <div
              key={sc.id}
              onClick={() => setSelectedId(sc.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-zinc-900 border-red-500/80 shadow-lg shadow-red-950/30 ring-1 ring-red-500/30'
                  : 'bg-zinc-900/40 hover:bg-zinc-900/80 border-zinc-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-900/60 font-mono">
                  {sc.badge}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {sc.id === 'opening_triumph' ? '现场赛后' : '前夜秘密'}
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-100 mb-1.5">
                {sc.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {sc.summary}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Scenario Preview */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2 mb-6">
        <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          <span>舞台与局势感知</span>
        </div>
        <p className="text-zinc-400 italic font-serif leading-relaxed">
          {currentScenario.startingAtmosphere}
        </p>
      </div>

      {/* Next Step Button */}
      <div className="mt-auto pt-4">
        <button
          onClick={() => onSelectScenario(currentScenario)}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-950/40 border border-red-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <span>确认起点 · 初始化角色属性</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

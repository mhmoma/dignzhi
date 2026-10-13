import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Sun, Sparkles } from 'lucide-react';
import { SCENARIO_LIST, ScenarioDefinition } from '@/src/game/constants';

interface ScenarioSelectProps {
  onBack: () => void;
  onSelectScenario: (scenario: ScenarioDefinition) => void;
}

export const ScenarioSelect: React.FC<ScenarioSelectProps> = ({
  onBack,
  onSelectScenario,
}) => {
  const [selectedId, setSelectedId] = useState<string>(SCENARIO_LIST[0].id);
  const currentScenario = SCENARIO_LIST.find((s: ScenarioDefinition) => s.id === selectedId) || SCENARIO_LIST[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#fefce8] text-amber-950 max-w-md mx-auto w-full px-5 py-6 font-sans">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-300 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回主页</span>
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-200/80 rounded-full border border-amber-300 text-[11px] font-bold text-amber-900 font-mono">
          <Sun className="w-3.5 h-3.5 text-amber-700" />
          <span>STAGE 01 // 校园与战队起点</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-amber-950 tracking-tight mb-1">
          选择开局切入点
        </h2>
        <p className="text-xs text-amber-800 font-medium">
          在充满阳光与竞争的大学城青训基地中，选择你的初次登场舞台与初始人际局势。
        </p>
      </div>

      {/* Scenario Selection Cards */}
      <div className="space-y-3.5 mb-6">
        {SCENARIO_LIST.map((sc: ScenarioDefinition) => {
          const isSelected = sc.id === selectedId;
          return (
            <div
              key={sc.id}
              onClick={() => setSelectedId(sc.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'bg-white border-amber-500 shadow-lg shadow-amber-950/10 ring-2 ring-amber-400/30'
                  : 'bg-white/70 hover:bg-white border-amber-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                  {sc.badge}
                </span>
                <span className="text-xs text-amber-700 font-mono font-bold">
                  {sc.id === 'opening_triumph' ? '大学城·赛后复盘' : '青训营·备战前夜'}
                </span>
              </div>
              <h3 className="text-base font-black text-amber-950 mb-1.5">
                {sc.title}
              </h3>
              <p className="text-xs text-amber-800/90 leading-relaxed line-clamp-2">
                {sc.summary}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Scenario Preview */}
      <div className="p-4 rounded-2xl bg-white border-2 border-amber-300 text-xs space-y-2 mb-6 shadow-md">
        <div className="flex items-center gap-1.5 text-amber-950 font-black">
          <MapPin className="w-4 h-4 text-orange-600" />
          <span>阳光校园舞台与局势感知</span>
        </div>
        <p className="text-amber-800 italic font-serif leading-relaxed">
          {currentScenario.startingAtmosphere}
        </p>
      </div>

      {/* Next Step Button */}
      <div className="mt-auto pt-4">
        <button
          onClick={() => onSelectScenario(currentScenario)}
          className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-black text-base tracking-wide shadow-xl shadow-amber-900/20 border-2 border-amber-400 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <span>确认起点 · 填写纸质青训签约合同</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

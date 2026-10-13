import React, { useState, useRef, useEffect } from 'react';
import { 
  PlayerStats, 
  NPCState, 
  ObjectMemory, 
  StoryChoice, 
  StoryGenerationResponse 
} from '../gameTypes';
import { 
  Zap, 
  Brain, 
  Trophy, 
  Users, 
  Compass, 
  Send, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  Flame, 
  Target, 
  ShieldAlert,
  Map,
  Compass as CompassIcon,
  Sun
} from 'lucide-react';

interface GameScreenProps {
  characterName: string;
  stats: PlayerStats;
  npcs: Record<string, NPCState>;
  objects: ObjectMemory[];
  currentScene: {
    title: string;
    atmosphere: string;
    narrative: string;
    choices: StoryChoice[];
    matchStats?: {
      stage: string;
      kda: string;
      controlRate: string;
      mvpCandidate: string;
    };
  };
  isLoading: boolean;
  recentStatChanges: string[];
  onSelectChoice: (choice: StoryChoice) => void;
  onCustomAction: (actionText: string) => void;
  onOpenNPCs: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  characterName,
  stats,
  npcs,
  objects,
  currentScene,
  isLoading,
  recentStatChanges,
  onSelectChoice,
  onCustomAction,
  onOpenNPCs,
}) => {
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [currentRegion, setCurrentRegion] = useState<string>('赤霄大学城主训练基地');
  const narrativeEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    narrativeEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentScene]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || isLoading) return;
    onCustomAction(customInput.trim());
    setCustomInput('');
    setShowCustomInput(false);
  };

  const getIntentBadge = (intent: StoryChoice['intent']) => {
    switch (intent) {
      case 'control':
        return { label: '野区掌控', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'tempt':
        return { label: '私密交涉', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'feed':
        return { label: '战术喂饼', color: 'bg-orange-100 text-orange-900 border-orange-300' };
      case 'cold':
        return { label: '冷彻博弈', color: 'bg-sky-100 text-sky-900 border-sky-300' };
      case 'gamble':
        return { label: '极限越塔', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      default:
        return { label: '常规推进', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
  };

  const regions = [
    { name: '赤霄大学城主训练基地', desc: '首发队员日常高强度训练与战术复盘的核心舞台。' },
    { name: '更衣室高级套间', desc: '林鸢与战队成员私下密谈、交涉把柄与秘密契约的隐秘空间。' },
    { name: '红蓝野区作战实训室', desc: '打野算力推演、惩击血线计算与野辅联动的专属沙盘区。' },
    { name: '大学城阳光林荫大道', desc: '课间散步、偶遇各大高校校花及粉丝粉丝合影的校园长廊。' },
  ];

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 py-4 font-sans">
      {/* Top Status & Dashboard Header */}
      <div className="mb-4 space-y-3">
        {/* Stats Bar */}
        <div className="bg-white/90 p-3 rounded-2xl border-2 border-amber-300 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5" title="野区支配与算力">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-amber-800 font-bold">野区算力</span>
            <span className="font-mono font-black text-amber-950">{stats.jungleControl}</span>
          </div>

          <div className="flex items-center gap-1.5" title="冷彻与心计">
            <Brain className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-amber-800 font-bold">冷彻</span>
            <span className="font-mono font-black text-amber-950">{stats.coldMind}</span>
          </div>

          <div className="flex items-center gap-1.5" title="更衣室声望与权柄">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-amber-800 font-bold">话语权</span>
            <span className="font-mono font-black text-amber-950">{stats.prestige}</span>
          </div>

          <button
            onClick={onOpenNPCs}
            className="flex items-center gap-1 text-[11px] text-amber-900 hover:text-amber-950 font-bold underline underline-offset-2 bg-amber-100 px-2 py-1 rounded-lg border border-amber-300"
          >
            <Users className="w-3 h-3 text-amber-700" />
            <span>人物志</span>
          </button>
        </div>

        {/* 战况仪表盘 (Battle Dashboard with Progress Bars) */}
        <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-300 shadow-md space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-amber-950 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              <span>当前战况实时仪表盘</span>
            </span>
            <button
              onClick={() => setShowMapModal(true)}
              className="text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg border border-amber-300 flex items-center gap-1 shadow-xs"
            >
              <Map className="w-3 h-3 text-amber-700" />
              <span>可视化地图 ({currentRegion.slice(0, 4)}...)</span>
            </button>
          </div>

          {/* Progress Bars */}
          <div className="space-y-2 pt-1">
            {/* KDA贡献度 */}
            <div>
              <div className="flex justify-between text-[11px] font-bold text-amber-900 mb-0.5">
                <span>KDA团队贡献度</span>
                <span className="font-mono text-orange-700">92.4% (MVP级)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden border border-amber-200">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full" style={{ width: '92.4%' }} />
              </div>
            </div>

            {/* 野区侵略度 */}
            <div>
              <div className="flex justify-between text-[11px] font-bold text-amber-900 mb-0.5">
                <span>野区侵略度 / 资源控制</span>
                <span className="font-mono text-amber-700">88.0% (压制对面打野)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden border border-amber-200">
                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            {/* 兵线控制率 */}
            <div>
              <div className="flex justify-between text-[11px] font-bold text-amber-900 mb-0.5">
                <span>兵线运营与控线率</span>
                <span className="font-mono text-sky-700">85.5% (完美牵制)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden border border-amber-200">
                <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full" style={{ width: '85.5%' }} />
              </div>
            </div>
          </div>

          {currentScene.matchStats && (
            <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-[11px] font-mono text-amber-900">
              <span className="font-bold text-orange-700">{currentScene.matchStats.stage}</span>
              <span>KDA: <strong>{currentScene.matchStats.kda}</strong></span>
              <span className="text-amber-800">{currentScene.matchStats.mvpCandidate}</span>
            </div>
          )}
        </div>

        {/* Recent Stat Changes Toast */}
        {recentStatChanges && recentStatChanges.length > 0 && (
          <div className="py-2 px-3 rounded-xl bg-amber-100 border border-amber-300 text-xs text-amber-950 font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-300">
            <TrendingUp className="w-4 h-4 shrink-0 text-amber-700" />
            <span className="truncate">{recentStatChanges.join(' · ')}</span>
          </div>
        )}
      </div>

      {/* Main Narrative Display Card */}
      <div className="flex-1 flex flex-col justify-between mb-4 p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-xl overflow-hidden">
        <div>
          {/* Scene Title & Atmosphere Tag */}
          <div className="pb-3 border-b-2 border-amber-200 mb-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-base sm:text-lg font-black text-amber-950 tracking-tight flex items-center gap-2">
                <span className="w-2 h-4 rounded-full bg-orange-600" />
                {currentScene.title}
              </h2>
              <span className="text-[10px] text-amber-700 font-mono font-bold shrink-0 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                REGION // {currentRegion.slice(0, 4)}
              </span>
            </div>
            {currentScene.atmosphere && (
              <p className="text-xs text-amber-800 italic font-serif leading-relaxed mt-1">
                {currentScene.atmosphere}
              </p>
            )}
          </div>

          {/* Narrative Body */}
          <div className="space-y-3.5 text-amber-950 text-xs sm:text-sm leading-relaxed font-serif tracking-normal text-justify">
            {currentScene.narrative.split('\n\n').map((paragraph, idx) => {
              const isDialogue = paragraph.includes('“') || paragraph.includes('”');
              const isLinYuanSpeaking = paragraph.includes('林鸢') && isDialogue;
              const isSuDaSpeaking = paragraph.includes('苏妲') && isDialogue;
              return (
                <p 
                  key={idx}
                  className={`${
                    isLinYuanSpeaking
                      ? 'border-l-4 border-rose-500 pl-3.5 py-1 text-amber-950 bg-rose-50/70 rounded-r-xl font-medium'
                      : isSuDaSpeaking
                      ? 'border-l-4 border-amber-500 pl-3.5 py-1 text-amber-950 bg-amber-50/70 rounded-r-xl font-medium'
                      : 'text-amber-900/90'
                  }`}
                >
                  {paragraph}
                </p>
              );
            })}
            <div ref={narrativeEndRef} />
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-amber-800 font-mono animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin text-orange-600" />
            <span>AI 阳光校园剧情引擎深度演算中...</span>
          </div>
        )}
      </div>

      {/* Interaction Decision Matrix */}
      <div className="space-y-2.5 pb-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-black text-amber-950 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-orange-600" />
            <span>局势决策分支</span>
          </span>
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-xs text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300"
          >
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>{showCustomInput ? '收起自由言论' : '心理博弈自由言论/动作'}</span>
          </button>
        </div>

        {/* Free Custom Action Input Box */}
        {showCustomInput && (
          <form onSubmit={handleCustomSubmit} className="p-3 rounded-2xl bg-white border-2 border-amber-300 shadow-md space-y-2 animate-in fade-in duration-200">
            <div className="text-[11px] text-amber-800 font-bold">
              输入你在阳光校园或训练基地所采取的言论与行动：
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="例如：微笑着拍拍林鸢的肩膀，把刚签下的备忘录协议展示给他..."
                className="flex-1 px-3.5 py-2.5 bg-amber-50/70 border border-amber-300 rounded-xl text-xs text-amber-950 font-bold placeholder-amber-400 focus:outline-none focus:border-amber-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!customInput.trim() || isLoading}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>推演</span>
              </button>
            </div>
          </form>
        )}

        {/* Pre-generated Strategy Choices */}
        <div className="space-y-2">
          {currentScene.choices.map((choice) => {
            const badge = getIntentBadge(choice.intent);
            return (
              <button
                key={choice.id}
                onClick={() => onSelectChoice(choice)}
                disabled={isLoading}
                className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-amber-50 active:bg-amber-100 disabled:opacity-50 border-2 border-amber-300 hover:border-amber-400 transition-all shadow-sm group flex items-start gap-3"
              >
                <div className="shrink-0 mt-0.5">
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-[13px] font-bold text-amber-950 group-hover:text-amber-900 leading-snug">
                    {choice.text}
                  </div>
                  {choice.hint && (
                    <div className="text-[10px] text-amber-800/80 mt-1 font-medium line-clamp-1">
                      {choice.hint}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 shrink-0 self-center transition-transform" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-amber-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-amber-400 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-black text-amber-950">大学城与赤霄基地可视化地图</h3>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-amber-800">
              点击下方区域可直接切换前往校园内不同场景进行深度推演：
            </p>

            <div className="space-y-2.5">
              {regions.map((reg) => {
                const isCurrent = currentRegion === reg.name;
                return (
                  <div
                    key={reg.name}
                    onClick={() => {
                      setCurrentRegion(reg.name);
                      setShowMapModal(false);
                    }}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                        : 'bg-amber-50/70 hover:bg-amber-100 text-amber-950 border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black flex items-center gap-1.5">
                        <Map className="w-3.5 h-3.5" />
                        {reg.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
                          当前所在
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] ${isCurrent ? 'text-amber-100' : 'text-amber-800'}`}>
                      {reg.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowMapModal(false)}
              className="w-full py-3 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs tracking-wide shadow-md"
            >
              关闭地图
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  MessageSquare, 
  Flame, 
  Zap, 
  Brain, 
  Trophy, 
  KeyRound, 
  Users, 
  Compass, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { PlayerStats, NPCState, ObjectMemory, StoryChoice, StoryGenerationResponse } from '../gameTypes';

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
  recentStatChanges?: string[];
  onSelectChoice: (choice: StoryChoice) => void;
  onSubmitCustomAction: (input: string) => void;
  onOpenNPCs: () => void;
  onOpenObjects: () => void;
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
  onSubmitCustomAction,
  onOpenNPCs,
  onOpenObjects,
}) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const narrativeEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    narrativeEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentScene.narrative]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || isLoading) return;
    onSubmitCustomAction(customInput.trim());
    setCustomInput('');
    setShowCustomInput(false);
  };

  const getIntentBadge = (intent: StoryChoice['intent']) => {
    switch (intent) {
      case 'control':
        return { label: '心理支配', color: 'bg-red-950/80 text-red-400 border-red-800' };
      case 'tempt':
        return { label: '引诱入局', color: 'bg-pink-950/80 text-pink-400 border-pink-800' };
      case 'feed':
        return { label: '赛场喂养', color: 'bg-amber-950/80 text-amber-400 border-amber-800' };
      case 'gamble':
        return { label: '博弈逼宫', color: 'bg-purple-950/80 text-purple-400 border-purple-800' };
      default:
        return { label: '冷彻定夺', color: 'bg-blue-950/80 text-blue-400 border-blue-800' };
    }
  };

  const linYuan = npcs.lin_yuan;

  return (
    <div className="flex flex-col flex-1 max-w-md mx-auto w-full px-4 py-3 min-h-[calc(100vh-50px)]">
      {/* Top Tactical Status Bar */}
      <div className="mb-3.5 space-y-2">
        {/* Core Attributes Pills */}
        <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center gap-1.5" title="野区支配与算力">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">算力</span>
            <span className="font-mono font-bold text-zinc-100">{stats.jungleControl}</span>
          </div>

          <div className="flex items-center gap-1.5" title="冷彻与心理博弈">
            <Brain className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-zinc-400">冷彻</span>
            <span className="font-mono font-bold text-zinc-100">{stats.coldMind}</span>
          </div>

          <div className="flex items-center gap-1.5" title="更衣室话语权与声望">
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-zinc-400">话语权</span>
            <span className="font-mono font-bold text-zinc-100">{stats.prestige}</span>
          </div>

          {/* Quick link to NPC drawer */}
          <button
            onClick={onOpenNPCs}
            className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white underline underline-offset-2"
          >
            <Users className="w-3 h-3 text-red-400" />
            <span>人物志</span>
          </button>
        </div>

        {/* Match Statistics Card (If active) */}
        {currentScene.matchStats && (
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900/60 to-zinc-900/40 border border-red-900/40 text-[11px]">
            <div className="flex items-center justify-between font-mono mb-1 text-red-400 font-bold text-[10px]">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {currentScene.matchStats.stage}
              </span>
              <span>{currentScene.matchStats.controlRate}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span>造神战绩: <strong>{currentScene.matchStats.kda}</strong></span>
              <span className="text-amber-400">{currentScene.matchStats.mvpCandidate}</span>
            </div>
          </div>
        )}

        {/* Dynamic Changes Toast */}
        {recentStatChanges && recentStatChanges.length > 0 && (
          <div className="py-1 px-2.5 rounded-lg bg-zinc-900/90 border border-zinc-700/60 text-[10px] text-amber-300 flex items-center gap-1.5 animate-in fade-in duration-300">
            <TrendingUp className="w-3 h-3 shrink-0 text-amber-400" />
            <span className="truncate">{recentStatChanges.join(' · ')}</span>
          </div>
        )}
      </div>

      {/* Main Narrative Display Card */}
      <div className="flex-1 flex flex-col justify-between mb-4 p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 shadow-xl overflow-hidden backdrop-blur-xs">
        <div>
          {/* Scene Title & Atmosphere Tag */}
          <div className="pb-3 border-b border-zinc-800/80 mb-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-red-600" />
                {currentScene.title}
              </h2>
              <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                SCENE // 0{objects.length + 1}
              </span>
            </div>
            {currentScene.atmosphere && (
              <p className="text-[11px] text-zinc-400 italic font-serif leading-relaxed">
                {currentScene.atmosphere}
              </p>
            )}
          </div>

          {/* Narrative Body */}
          <div className="space-y-3.5 text-zinc-200 text-xs sm:text-sm leading-relaxed font-serif tracking-normal text-justify">
            {currentScene.narrative.split('\n\n').map((paragraph, idx) => {
              const isDialogue = paragraph.includes('“') || paragraph.includes('”');
              const isLinYuanSpeaking = paragraph.includes('林鸢') && isDialogue;
              const isSuDaSpeaking = paragraph.includes('苏妲') && isDialogue;

              return (
                <p 
                  key={idx}
                  className={`${
                    isLinYuanSpeaking
                      ? 'border-l-2 border-red-500/80 pl-3 py-0.5 text-zinc-100 bg-red-950/10 rounded-r'
                      : isSuDaSpeaking
                      ? 'border-l-2 border-pink-500/80 pl-3 py-0.5 text-zinc-100 bg-pink-950/10 rounded-r'
                      : 'text-zinc-300'
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
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-red-400 font-mono animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>AI 剧情引擎深层演算中 (推演人际反应 & 局势博弈)...</span>
          </div>
        )}
      </div>

      {/* Interaction Decision Matrix */}
      <div className="space-y-2.5 pb-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-zinc-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-red-400" />
            <span>局势决策分支</span>
          </span>
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <MessageSquare className="w-3 h-3 text-blue-400" />
            <span>{showCustomInput ? '收起自由言论' : '心理博弈自由言论/动作'}</span>
          </button>
        </div>

        {/* Free Custom Action Input Box */}
        {showCustomInput && (
          <form onSubmit={handleCustomSubmit} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span>输入你对林鸢、苏妲或战队所采取的言论或手段：</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="例如：冷眼看着林鸢，把玄关签下的备忘录协议在她眼前晃了晃..."
                className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!customInput.trim() || isLoading}
                className="px-3.5 py-2 bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
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
                className="w-full text-left p-3 sm:p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-850/90 active:bg-zinc-800 disabled:opacity-50 border border-zinc-800 hover:border-zinc-700 transition-all group flex items-start gap-2.5"
              >
                <div className="shrink-0 mt-0.5">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-[13px] font-medium text-zinc-200 group-hover:text-white leading-snug">
                    {choice.text}
                  </div>
                  {choice.hint && (
                    <div className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                      {choice.hint}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 shrink-0 self-center transition-colors" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

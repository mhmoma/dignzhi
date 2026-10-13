import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Zap, Brain, Trophy, FileText, CheckCircle2, User, Ruler, Heart } from 'lucide-react';
import { PlayerStats, PlayerProfile } from '../gameTypes';
import { INITIAL_STATS_PRESETS } from '../game/constants';

interface AttributesSetupProps {
  onBack: () => void;
  onConfirm: (characterName: string, stats: PlayerStats, profile: PlayerProfile) => void;
}

export const AttributesSetup: React.FC<AttributesSetupProps> = ({
  onBack,
  onConfirm,
}) => {
  const [profile, setProfile] = useState<PlayerProfile>({
    name: '林冬夏',
    height: '183cm',
    appearance: '阳光大男孩 / 剑眉星目 / 干净利落短发',
    position: '打野 (JG / 野王)',
    club: '赤霄俱乐部 (CHIXIAO ESPORTS)',
    penisLength: '18cm (天赋异禀)',
    stamina: '超长耐力 (铁人三项/连续高强度高潮)',
  });

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
      color: 'text-amber-600',
      desc: '决定控图嗅觉、击杀让头精准度与造神效率。'
    },
    {
      key: 'coldMind' as keyof PlayerStats,
      label: '冷彻 / 心理博弈',
      icon: Brain,
      color: 'text-sky-600',
      desc: '决定更衣室威慑、把柄拿捏与高压下的冷血决断。'
    },
    {
      key: 'mechanics' as keyof PlayerStats,
      label: '极限微操 / 反应',
      icon: ShieldCheck,
      color: 'text-orange-600',
      desc: '决定个人单挑实力、极限越塔与绝境反杀概率。'
    },
    {
      key: 'prestige' as keyof PlayerStats,
      label: '战队声望 / 权柄',
      icon: Trophy,
      color: 'text-amber-700',
      desc: '决定在教练与队员面前的BP话语权与俱乐部掌控力。'
    }
  ];

  const handleSubmit = () => {
    onConfirm(profile.name.trim() || '林冬夏', stats, profile);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fefce8] text-amber-950 max-w-xl mx-auto w-full px-4 sm:px-6 py-6 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-300 mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回上一页</span>
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-200/80 rounded-full border border-amber-300 text-[11px] font-bold text-amber-900 font-mono">
          <FileText className="w-3.5 h-3.5 text-amber-700" />
          <span>官方青训生签约暨体检档案合同</span>
        </div>
      </div>

      {/* Contract Header Banner */}
      <div className="relative mb-6 p-6 rounded-2xl bg-white border-2 border-amber-300 shadow-xl overflow-hidden">
        {/* Stamp */}
        <div className="absolute right-4 top-4 w-20 h-20 rounded-full border-4 border-red-600/70 flex items-center justify-center rotate-[-12deg] pointer-events-none opacity-85">
          <div className="text-center">
            <div className="text-[9px] font-bold text-red-600 font-mono">赤霄战队专用</div>
            <div className="text-[11px] font-black text-red-600">合同审核章</div>
            <div className="text-[8px] text-red-500 font-mono">2026.VER</div>
          </div>
        </div>

        <h2 className="text-2xl font-black text-amber-950 tracking-tight mb-1">
          职业选手契约与生理体检档案
        </h2>
        <p className="text-xs text-amber-800 font-medium">
          欢迎来到阳光灿烂的电竞大学城与赤霄青训基地。请在下方纸质档案上核对并完善您的个人资料、身体天赋与核心数值。
        </p>
      </div>

      {/* Paper Contract Form Inputs */}
      <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-md mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-700" />
              <span>选手姓名 (本名)</span>
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-amber-50/70 border border-amber-300 rounded-xl px-3.5 py-2.5 text-sm text-amber-950 font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              placeholder="例如：林冬夏"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5 text-amber-700" />
              <span>身高身长</span>
            </label>
            <input
              type="text"
              value={profile.height}
              onChange={(e) => setProfile({ ...profile, height: e.target.value })}
              className="w-full bg-amber-50/70 border border-amber-300 rounded-xl px-3.5 py-2.5 text-sm text-amber-950 font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
              placeholder="例如：183cm / 阳光挺拔"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-amber-900 mb-1">
              样貌/外形特征选择
            </label>
            <select
              value={profile.appearance}
              onChange={(e) => setProfile({ ...profile, appearance: e.target.value })}
              className="w-full bg-amber-50/70 border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              <option value="阳光大男孩 / 剑眉星目 / 干净利落短发">阳光大男孩 / 剑眉星目 / 干净短发</option>
              <option value="清秀学长风 / 眼神清澈 / 阳光运动系">清秀学长风 / 眼神清澈 / 阳光运动系</option>
              <option value="狼犬型野性少年 / 腹肌线条 / 极具侵略性">狼犬型野性少年 / 腹肌线条 / 极具侵略性</option>
              <option value="电竞天才少年 / 慵懒贵气 / 皮肤白皙">电竞天才少年 / 慵懒贵气 / 皮肤白皙</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-900 mb-1">
              擅长位置 / 游戏分路
            </label>
            <select
              value={profile.position}
              onChange={(e) => setProfile({ ...profile, position: e.target.value })}
              className="w-full bg-amber-50/70 border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              <option value="打野 (JG / 野区主宰)">打野 (JG / 野区主宰)</option>
              <option value="中单 (MID / 法刺大核)">中单 (MID / 法刺大核)</option>
              <option value="发育路 (ADC / 团队大C)">发育路 (ADC / 团队大C)</option>
              <option value="对抗路 (CLASH / 战边天花板)">对抗路 (CLASH / 战边天花板)</option>
              <option value="游走 (SUP / 团队大脑与节奏发动机)">游走 (SUP / 团队大脑与节奏发动机)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-amber-900 mb-1">
            签约目标俱乐部
          </label>
          <input
            type="text"
            value={profile.club}
            onChange={(e) => setProfile({ ...profile, club: e.target.value })}
            className="w-full bg-amber-50/70 border border-amber-300 rounded-xl px-3.5 py-2.5 text-sm text-amber-950 font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
            placeholder="例如：赤霄电子竞技俱乐部 (CHIXIAO ESPORTS)"
          />
        </div>

        {/* Adult Physical Stats Section */}
        <div className="pt-3 border-t border-amber-200">
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 mb-2">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>成人私密生理与耐力体检数值 (俱乐部特设备案)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-amber-900 mb-1">
                阴茎长度 / 硬件天赋
              </label>
              <input
                type="text"
                value={profile.penisLength}
                onChange={(e) => setProfile({ ...profile, penisLength: e.target.value })}
                className="w-full bg-rose-50/60 border border-rose-300 rounded-xl px-3.5 py-2 text-xs text-amber-950 font-bold focus:outline-none focus:border-rose-500 focus:bg-white"
                placeholder="例如：18cm (顶配硬汉天赋)"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-900 mb-1">
                耐力持久 / 爆发频率
              </label>
              <input
                type="text"
                value={profile.stamina}
                onChange={(e) => setProfile({ ...profile, stamina: e.target.value })}
                className="w-full bg-rose-50/60 border border-rose-300 rounded-xl px-3.5 py-2 text-xs text-amber-950 font-bold focus:outline-none focus:border-rose-500 focus:bg-white"
                placeholder="例如：超长耐力 / 铁人三项"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-amber-900 mb-2">
          初始执念天赋路线
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(INITIAL_STATS_PRESETS).map(([key, item]: [string, any]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`p-3 rounded-xl text-left border-2 transition-all text-xs font-bold ${
                activePreset === key
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                  : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <div className="truncate mb-0.5">{item.label.split(' ')[0]}</div>
              <div className="text-[10px] opacity-80 truncate">{item.label.split(' ')[1] || ''}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Allocation Matrix */}
      <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-md mb-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-amber-200 text-xs">
          <span className="font-black text-amber-950">核心算力与电竞天赋点数</span>
          <span className="text-xs text-amber-800">
            可自由分配点数: <strong className="text-red-600 font-mono text-sm">{availableBonus}</strong>
          </span>
        </div>

        <div className="space-y-4">
          {statMeta.map(({ key, label, icon: Icon, color, desc }) => (
            <div key={key} className="space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-amber-950 font-bold">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span>{label}</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-base text-amber-900 w-8 text-right">
                    {stats[key]}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleAdjustStat(key, -5)}
                      disabled={stats[key] <= 50}
                      className="w-7 h-7 rounded-lg bg-amber-200 hover:bg-amber-300 disabled:opacity-30 text-amber-950 font-bold flex items-center justify-center text-xs shadow-sm"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleAdjustStat(key, 5)}
                      disabled={availableBonus < 5}
                      className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-30 text-white font-bold flex items-center justify-center text-xs shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-amber-800 leading-tight">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Button */}
      <div className="mt-auto pt-2 pb-6">
        <button
          onClick={handleSubmit}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-black text-base tracking-wide shadow-xl shadow-amber-900/20 border-2 border-amber-400 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>正式签署合同 · 开启阳光校园青训推演</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

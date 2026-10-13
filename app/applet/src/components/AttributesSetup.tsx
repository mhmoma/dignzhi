import React, { useState } from 'react';
import { ArrowLeft, Shield, Award, Flame, FileText, Stamp } from 'lucide-react';
import { PlayerStats } from '@/src/gameTypes';
import { INITIAL_STATS_PRESETS } from '@/src/game/constants';

interface AttributesSetupProps {
  onBack: () => void;
  onConfirm: (characterName: string, stats: PlayerStats) => void;
}

const CLUBS = [
  { id: 'huazijing', name: '华紫荆电子竞技俱乐部 (LPL豪门)', desc: '传统豪强，资金雄厚，更衣室等级森严。' },
  { id: 'hangdian', name: '杭电春晓战队 (阳光校园精英)', desc: '新锐高校联盟代表，氛围青春热血。' },
  { id: 'edg', name: '骑士殿堂 EDG (银色战舰)', desc: '战术底蕴深厚，粉丝基数庞大。' },
  { id: 'jdg', name: '京东数科 JDG (重坦平推)', desc: '资本与极致运营的象征。' }
];

const ROLES = [
  { id: 'MID', name: '中单 (Mid Laner)', desc: '团队绝对核心，掌控线权与支援节奏。' },
  { id: 'JUNGLE', name: '打野 (Jungler)', desc: '野区节奏发动机，暗中操盘与抓人造神。' },
  { id: 'TOP', name: '上单 (Top Laner)', desc: '孤岛单挑之王，抗压与团战锋刃。' },
  { id: 'ADC', name: '下路 (ADC)', desc: '后期输出大核，团队最后的终结者。' },
  { id: 'SUPPORT', name: '辅助 (Support)', desc: '视野与战术大脑，掌控全局博弈。' }
];

const APPEARANCES = [
  '阳光清爽短发·校草级侧颜',
  '慵懒天才网瘾少年·银灰色碎发',
  '锐利电眼禁欲系·高冷学霸',
  '阳光运动型男·健康小麦肤色'
];

const PENIS_LENGTHS = [
  { id: 'standard', label: '15cm · 标准实用标准 (均衡抗压)', desc: '联赛平均水平，耐操可靠。' },
  { id: 'talented', label: '17.5cm · 天赋异禀精锐 (压迫感十足)', desc: '具备极强的荷尔蒙威慑与自信。' },
  { id: 'giant', label: '20cm+ · 巨物级恐怖统治力 (绝对支配)', desc: '令所有对手与NPC感到窒息的绝对天赋。' }
];

const ENDURANCES = [
  { id: 'stable', label: '持续作战 · 鏖战三局不泄', desc: '体能分配均匀，中后期保持稳定输出。' },
  { id: 'burst', label: '瞬息爆发 · 极速光速切入', desc: '前15分钟对线压制力拉满。' },
  { id: 'endless', label: '五局拉满 · 究极持久永动机', desc: '决胜局绝不手软，抗压与膀胱局克星。' }
];

export const AttributesSetup: React.FC<AttributesSetupProps> = ({
  onBack,
  onConfirm,
}) => {
  const [characterName, setCharacterName] = useState<string>('林冬夏');
  const [gameId, setGameId] = useState<string>('CHIXIAO');
  const [height, setHeight] = useState<string>('182cm');
  const [appearance, setAppearance] = useState<string>(APPEARANCES[0]);
  const [selectedClub, setSelectedClub] = useState<string>(CLUBS[0].name);
  const [selectedRole, setSelectedRole] = useState<string>(ROLES[0].name);
  const [penisLength, setPenisLength] = useState<string>(PENIS_LENGTHS[1].label);
  const [endurance, setEndurance] = useState<string>(ENDURANCES[1].label);

  const [activePreset, setActivePreset] = useState<string>('tyrant');
  const [stats, setStats] = useState<PlayerStats>({ ...INITIAL_STATS_PRESETS.tyrant.stats });
  const [availableBonus, setAvailableBonus] = useState<number>(10);
  const [isStamped, setIsStamped] = useState<boolean>(false);

  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    setStats({ ...INITIAL_STATS_PRESETS[presetKey].stats });
    setAvailableBonus(10);
  };

  const handleAdjustStat = (key: keyof PlayerStats, delta: number) => {
    if (delta > 0 && availableBonus <= 0) return;
    if (delta < 0 && stats[key] <= 50) return;
    setStats((prev: PlayerStats) => ({
      ...prev,
      [key]: prev[key] + delta,
    }));
    setAvailableBonus((prev: number) => prev - delta);
  };

  const handleSignContract = () => {
    setIsStamped(true);
    setTimeout(() => {
      onConfirm(characterName, stats);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-amber-950 px-4 py-8 flex flex-col items-center selection:bg-amber-200">
      {/* Top Bar */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-6 pb-4 border-b border-amber-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-none border border-amber-300 text-xs font-bold transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回上一页</span>
        </button>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-700 bg-amber-50 px-3 py-1 border border-amber-200">
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>中华人民共和国职业电竞联赛 · 官方三方录用合同</span>
        </div>
      </div>

      {/* Paper Contract Document Container */}
      <div className="w-full max-w-3xl bg-[#fffef9] border-2 border-amber-300 shadow-2xl p-6 md:p-10 relative overflow-hidden">
        {/* Watermark Stamp */}
        <div className="absolute right-8 top-12 pointer-events-none opacity-15 transform rotate-12 border-4 border-red-600 p-4 rounded-full flex flex-col items-center justify-center w-36 h-36">
          <span className="text-red-600 font-black text-xs tracking-widest">官方认证</span>
          <span className="text-red-600 font-bold text-sm my-1">LPL 青训备案</span>
          <span className="text-red-600 text-[9px] font-mono">VERIFIED 2026</span>
        </div>

        {/* Header */}
        <div className="text-center pb-6 border-b-2 border-amber-200 mb-8 relative">
          <div className="inline-block bg-amber-600 text-amber-50 text-[10px] font-mono px-3 py-0.5 uppercase tracking-widest mb-2 font-bold shadow-sm">
            Sunny Campus & Professional Contract
          </div>
          <h1 className="text-3xl font-black tracking-wider text-amber-950 mb-1 font-serif">
            职业电竞选手三方录用契约书
          </h1>
          <p className="text-xs text-amber-800 tracking-wide">
            请认真审阅并填报以下个人身份档案、俱乐部归属、生理天赋及竞技算力核心参数
          </p>
        </div>

        {/* Section 1: 俱乐部与基本身份档案 */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
            <Shield className="w-4 h-4 text-amber-700" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900">
              一、 俱乐部归属与个人基本档案
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Club Selection */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-amber-900">
                1. 意向加盟俱乐部 (甲方)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CLUBS.map((club) => (
                  <button
                    key={club.id}
                    type="button"
                    onClick={() => setSelectedClub(club.name)}
                    className={`p-3 text-left border transition-all ${
                      selectedClub === club.name
                        ? 'bg-amber-100 border-amber-600 shadow-sm ring-1 ring-amber-600'
                        : 'bg-amber-50/50 border-amber-200 hover:bg-amber-100/50'
                    }`}
                  >
                    <div className="font-bold text-xs text-amber-950">{club.name}</div>
                    <div className="text-[10px] text-amber-700 mt-0.5">{club.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">
                2. 选手本名 (Real Name)
              </label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="w-full bg-amber-50/80 border border-amber-300 px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-amber-600"
                placeholder="例如: 林冬夏"
              />
            </div>

            {/* Game ID */}
            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">
                3. 官方注册游戏ID (Summoner ID)
              </label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full bg-amber-50/80 border border-amber-300 px-3 py-2 text-xs text-amber-950 font-mono font-bold focus:outline-none focus:border-amber-600"
                placeholder="例如: CHIXIAO"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">
                4. 身体身高 (Height)
              </label>
              <select
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-amber-50/80 border border-amber-300 px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-amber-600"
              >
                <option value="175cm">175cm (标准敏捷体型)</option>
                <option value="178cm">178cm (黄金视觉比例)</option>
                <option value="182cm">182cm (阳光校园校草高度)</option>
                <option value="186cm">186cm (模特级高大压迫感)</option>
                <option value="190cm+">190cm+ (巨人级震撼身姿)</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">
                5. 擅长主战位置 (Preferred Lane)
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-amber-50/80 border border-amber-300 px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-amber-600"
              >
                {ROLES.map(r => (
                  <option key={r.id} value={r.name}>{r.name} - {r.desc}</option>
                ))}
              </select>
            </div>

            {/* Appearance */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-amber-900 mb-1">
                6. 样貌特征及校园气质选择 (Appearance & Vibe)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {APPEARANCES.map(app => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setAppearance(app)}
                    className={`p-2 text-xs text-center border transition-all ${
                      appearance === app
                        ? 'bg-amber-100 border-amber-600 font-bold text-amber-950'
                        : 'bg-amber-50/50 border-amber-200 text-amber-800 hover:bg-amber-100/50'
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: 成人隐私与生理天赋声明 */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
            <Flame className="w-4 h-4 text-red-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900">
              二、 成人隐私与生理天赋专属声明 (Physiological & Stamina Declaration)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Penis Length */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-amber-900">
                1. 阴茎长度与荷尔蒙天赋 (Anatomical Rating)
              </label>
              <div className="space-y-2">
                {PENIS_LENGTHS.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPenisLength(item.label)}
                    className={`w-full p-2.5 text-left border transition-all ${
                      penisLength === item.label
                        ? 'bg-amber-100 border-red-600 ring-1 ring-red-500'
                        : 'bg-amber-50/50 border-amber-200 hover:bg-amber-100/50'
                    }`}
                  >
                    <div className="font-bold text-xs text-amber-950">{item.label}</div>
                    <div className="text-[10px] text-amber-700">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Endurance */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-amber-900">
                2. 耐力持久度与鏖战爆发力 (Stamina & Recovery)
              </label>
              <div className="space-y-2">
                {ENDURANCES.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEndurance(item.label)}
                    className={`w-full p-2.5 text-left border transition-all ${
                      endurance === item.label
                        ? 'bg-amber-100 border-red-600 ring-1 ring-red-500'
                        : 'bg-amber-50/50 border-amber-200 hover:bg-amber-100/50'
                    }`}
                  >
                    <div className="font-bold text-xs text-amber-950">{item.label}</div>
                    <div className="text-[10px] text-amber-700">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: 核心算力与执念天赋初始化 */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900">
                三、 核心算力与执念天赋初始化 (Core Attributes)
              </h2>
            </div>
            <div className="text-xs text-amber-800">
              剩余可分配点数: <strong className="text-red-600 font-mono text-sm">{availableBonus}</strong>
            </div>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.entries(INITIAL_STATS_PRESETS).map(([key, item]: [string, any]) => (
              <button
                key={String(key)}
                type="button"
                onClick={() => applyPreset(key)}
                className={`p-2 text-center border text-xs transition-all ${
                  activePreset === key
                    ? 'bg-amber-200 border-amber-700 font-bold text-amber-950 shadow-sm'
                    : 'bg-amber-50/50 border-amber-200 text-amber-800 hover:bg-amber-100/50'
                }`}
              >
                <div>{item.label.split(' ')[0]}</div>
                <div className="text-[10px] text-amber-700">{item.label.split(' ')[1] || ''}</div>
              </button>
            ))}
          </div>

          {/* Stats Adjuster Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'jungleControl' as keyof PlayerStats, label: '野区支配 / 算力', desc: '决定控图嗅觉与击杀精准度' },
              { key: 'coldMind' as keyof PlayerStats, label: '冷彻 / 心理博弈', desc: '决定更衣室威慑与高压决断' },
              { key: 'mechanics' as keyof PlayerStats, label: '极限微操 / 反应', desc: '决定单挑实力与绝境反杀' },
              { key: 'prestige' as keyof PlayerStats, label: '战队声望 / 权柄', desc: '决定BP话语权与舆论公关' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="p-3 bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-amber-950">{label}</div>
                  <div className="text-[10px] text-amber-700">{desc}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-amber-950 w-8 text-right">
                    {stats[key]}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleAdjustStat(key, -5)}
                      disabled={stats[key] <= 50}
                      className="w-6 h-6 bg-amber-200 hover:bg-amber-300 disabled:opacity-30 text-amber-950 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustStat(key, 5)}
                      disabled={availableBonus < 5}
                      className="w-6 h-6 bg-amber-200 hover:bg-amber-300 disabled:opacity-30 text-amber-950 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Signature & Stamp Action */}
        <div className="pt-6 border-t-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-amber-800 space-y-1">
            <p><strong>签约声明：</strong> 本合同自双方签字画押及红印章生效起正式生效，选手必须接受后续所有剧情演变。</p>
            <p className="font-mono text-[10px]">已选俱乐部: {selectedClub} | 注册ID: {gameId} | 身高: {height} | 档案: {penisLength}</p>
          </div>

          <button
            type="button"
            onClick={handleSignContract}
            disabled={isStamped}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-black text-sm tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-80"
          >
            <Stamp className={`w-5 h-5 ${isStamped ? 'animate-bounce text-yellow-300' : ''}`} />
            <span>{isStamped ? '正在加盖红印章并生成合同...' : '签字画押 · 开启职业生涯'}</span>
          </button>
        </div>

        {/* Stamp Animation Overlay */}
        {isStamped && (
          <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex items-center justify-center z-50 animate-pulse">
            <div className="border-8 border-red-600 bg-red-500/10 text-red-600 p-8 transform -rotate-12 font-black text-3xl tracking-widest shadow-2xl flex flex-col items-center">
              <span className="text-xs uppercase tracking-widest mb-1">OFFICIAL SEAL</span>
              <span>合同生效 · 签约成功</span>
              <span className="text-xs font-mono mt-2">LPL REG. 2026-OK</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

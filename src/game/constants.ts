import { NPCState, ObjectMemory, PlayerStats, StoryChoice } from '../gameTypes';

export const INITIAL_NPCS: Record<string, NPCState> = {
  lin_yuan: {
    id: 'lin_yuan',
    name: '林鸢',
    role: '赤霄战队首发中单 · 财阀豪门千金',
    avatarText: '鸢',
    favor: 35,
    submission: 45,
    suspicion: 20,
    mood: '呼吸紊乱，战意与羞耻在眼底交织',
    secrets: [
      '在公寓玄关承诺：只要帮她稳住常规赛MVP与首发，私下无论提出什么战术协议都不反悔。'
    ]
  },
  su_da: {
    id: 'su_da',
    name: '苏妲',
    role: '战队核心主力辅助 · 敏锐的元老',
    avatarText: '妲',
    favor: 50,
    submission: 15,
    suspicion: 65,
    mood: '狭长的狐狸眼里闪烁着毫不掩饰的占有欲与探究',
    secrets: [
      '察觉到了你和林鸢在赛前玄关的不对劲，试图从你嘴里套出把柄。'
    ]
  },
  coach_han: {
    id: 'coach_han',
    name: '韩教练',
    role: '赤霄赛训总监 · 铁血功利派',
    avatarText: '韩',
    favor: 40,
    submission: 0,
    suspicion: 30,
    mood: '冷眼审视，只认最终胜率与战队赞助商利益',
    secrets: [
      '若林冬夏能彻底压制林鸢并维持胜利，默许队内任何私人话语权调整。'
    ]
  }
};

export const INITIAL_OBJECTS: ObjectMemory[] = [
  {
    id: 'obj_pact_notes',
    name: '套间玄关私密协议',
    category: 'contract',
    description: '林鸢亲手签下的赛前战术授权手稿，注明“赛场听凭川指令调配，私下承诺绝不毁约”。',
    riskLevel: 'HIGH',
    obtainedAt: '揭幕战前夜 02:40',
    notes: '若被俱乐部公关部或媒体曝光，林鸢的人设将瞬间坍塌。'
  },
  {
    id: 'obj_match_disk',
    name: '10分钟屠杀第一视角硬盘',
    category: 'video',
    description: '揭幕战全盘第一视角的野区轨迹录像，证明林鸢的全部MVP击杀均由你一级级喂到嘴边。',
    riskLevel: 'MEDIUM',
    obtainedAt: '赛后更衣室',
    notes: '可用于赛后复盘会议上剥夺林鸢的话语权。'
  }
];

export const INITIAL_STATS_PRESETS: Record<string, { label: string; desc: string; stats: PlayerStats }> = {
  tyrant: {
    label: '野区掌控者 (默认设定)',
    desc: '算力超群、冷彻沉静，善于计算人心与比赛走向，视赛场为棋盘。',
    stats: {
      jungleControl: 85,
      coldMind: 80,
      mechanics: 75,
      prestige: 50,
    }
  },
  manipulator: {
    label: '幕后执棋者 (心机专精)',
    desc: '极度擅长更衣室博弈与把柄收集，任何高傲的队友终将沦为棋子。',
    stats: {
      jungleControl: 70,
      coldMind: 95,
      mechanics: 65,
      prestige: 60,
    }
  },
  mechanic_beast: {
    label: '修罗微操狂 (操作专精)',
    desc: '天生极限制霸，野区对抗刀刀见血，靠最暴力的纯粹技术逼迫所有人屈服。',
    stats: {
      jungleControl: 80,
      coldMind: 60,
      mechanics: 95,
      prestige: 55,
    }
  }
};

export interface ScenarioDefinition {
  id: string;
  badge: string;
  title: string;
  summary: string;
  startingAtmosphere: string;
  initialPlot: string;
  initialChoices: StoryChoice[];
}

export const SCENARIO_LIST: ScenarioDefinition[] = [
  {
    id: 'opening_triumph',
    badge: '推荐 · 原著经典开局',
    title: '常规赛揭幕战·十分钟MVP的暗流',
    summary: '赤霄战队在十分钟内平推三冠王穹顶战队。林鸢拿满人头荣膺MVP，而你冷酷掌控一切。面对苏妲的试探与林鸢眼底的屈辱，赛后采访即刻开启。',
    startingAtmosphere: '青岚电竞馆主舞台残片闪烁，全场雷动。空气里弥漫着发烫的散热铜管味道与高跟鞋声。',
    initialPlot: `巨大的“VICTORY”字样伴随着水晶基地轰然碎裂的特效，瞬间铺满了青岚电竞馆主舞台中央的那块数十平米的高清LED主屏幕。金色的光效在残破的废墟中闪烁，全场数万名观众在长达两秒的死寂之后，爆发出几乎要掀翻场馆屋顶的狂热喧哗。

对阵区内，你（代号“川”）面无表情地松开鼠标，手指在铝合金键盘上最后敲击了一下。呼吸平稳，额头上没有渗出半点汗水，仿佛刚才那场将三冠王打得毫无还手之力的屠杀，只是日常训练中的一局普通排位。

坐在身侧的林鸢微微向后靠在电竞椅上，白皙的脸颊上泛起一层因为肾上腺素飙升与羞耻而产生的酠红。屏幕右上角是她那行全场瞩目的华丽KDA——10分钟超神，参团率100%，以及高高亮起的金色“MVP”徽章。
整局比赛完全如你赛前在套间玄关处对她设定的那样：你精准反野、军训中路、每一次控龙与Gank都将残血的人头精确让到她的嘴边。

“我的天……林鸢这局的数据太恐怖了吧？10分钟超神，参团率100%！”主力辅助苏妲一边摘下头戴式耳机，一边将狭长的狐狸眼投向你，眼底闪烁着毫不掩饰的崇拜与占有欲，“野王大人，您这哪是打野啊，简直是把中单当成祖宗在喂。全网粉丝都要疯了。”

林鸢转过头，目光复杂地看着你。她咬了咬下唇，声音压得极低，只有你们三个人能听见：“……算你厉害。赛前玄关答应你的条件……我绝对不反悔。”

官方工作人员已经快步走来，通知林鸢进行赛后主舞台采访。林鸢站起身，整理着解开了两颗扣子的红黑队服领口，用余光瞥向你：
“走吧，官方点名让我去接受采访。你想好让我怎么在全国直播镜头前夸你了吗，林冬夏？”`,
    initialChoices: [
      {
        id: 'c_press_linyuan',
        text: '冷漠对视：“采访台上少提我，把所有功劳揽在你自己头上——这样明晚兑现协议时，你才更懂什么叫代价。”',
        intent: 'control',
        hint: '极大幅提升对林鸢的心理支配与威慑，降低其傲慢度'
      },
      {
        id: 'c_tease_suda',
        text: '转头看向苏妲，淡淡反问：“喜欢这种喂法？下局把人头全喂给你的辅助，如何？”',
        intent: 'tempt',
        hint: '激起苏妲极强的好感与独占欲，同时暗中刺痛林鸢'
      },
      {
        id: 'c_cold_discipline',
        text: '收拾键盘，起身离席：“失误了两次越塔算漏伤害。回基地复盘室，把你欠我的复盘笔记补齐再谈其他。”',
        intent: 'cold',
        hint: '立下绝对职业权威，心计与支配双向提升'
      }
    ]
  },
  {
    id: 'midnight_apartment',
    badge: '高压暗涌 · 前夜密约',
    title: '深夜基地套房·林鸢的屈尊密约',
    summary: '常规赛名单公布前四小时，林鸢秘密敲响你的单人套间。这位豪门千金即将失去首发位置，她唯一的退路就是用自己的尊严向你交换野区的绝对庇护。',
    startingAtmosphere: '基地走廊静谧无人，微黄的壁灯打在玄关处。门外风雨欲来，房内弥漫着淡淡的山茶花香水与急促呼吸声。',
    initialPlot: `凌晨两点四十分。基地单人套间外传来三声极轻却急促的叩门声。
门锁转动，映入眼帘的是穿着宽大红黑队服外衣、领口微敞的林鸢。这位在电竞圈被无数粉丝奉为冰山女神的首发中单，此刻双手紧紧攥着衣角，指节发白。

“林冬夏，让我进去，别让二楼巡查的领队看见。”她的声音带着前所未有的压抑与颤音。

反手锁上防盗链，狭窄的玄关内顿时充斥着她身上那缕清冷的山茶花香气。林鸢靠在玄关柜旁，仰起那张精致却毫无血色的脸颊，从队服内衬掏出一份折叠整齐的纸页塞进你手中。
“这是我能给你的最高权限承诺书……明天的揭幕战，教练组放话，如果我和三冠王对位被单杀哪怕一次，我的首发合同就会被管理层立刻转为冷冻替补。”
她咬着唇，睫毛微微颤抖：“我要你全场住在中路。人头全部给我，把对面三冠王按死在防御塔下。只要我保住MVP……”

说到这里，她闭上了眼睛，呼吸灼热而耻辱：“……在这间房子里，无论你想怎么支配我、定下什么规矩，我都认。”`,
    initialChoices: [
      {
        id: 'c_accept_contract',
        text: '收下协议折叠入怀，伸手轻碰她的下颌：“首发我会帮你稳住。但记住，从明天起，你每一次拿到的击杀，都是从我手心里乞讨来的。”',
        intent: 'control',
        hint: '确立绝对的主仆战术关系，获得【套间玄关私密协议】'
      },
      {
        id: 'c_cold_interrogate',
        text: '冷漠退后一步：“豪门千金的承诺一文不值。把苏妲和韩教练私下防备我的录音交出来，我才考虑救你。”',
        intent: 'gamble',
        hint: '深挖更衣室高层矛盾，大幅提升心计与信息差优势'
      },
      {
        id: 'c_feed_promise',
        text: '递给她一瓶温水，平静注视：“明天十分钟内，我会把穹顶战队的中一塔连同人头打碎送到你嘴边。现在，回你自己房间。”',
        intent: 'feed',
        hint: '以极致自信稳固林鸢的心神，提升其潜意识依赖'
      }
    ]
  }
];

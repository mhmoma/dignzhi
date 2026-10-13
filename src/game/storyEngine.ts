import { PlayerStats, NPCState, ObjectMemory, StoryChoice, StoryGenerationResponse } from '../gameTypes';

interface StoryContext {
  characterName: string;
  scenarioId: string;
  stats: PlayerStats;
  npcs: Record<string, NPCState>;
  objects: ObjectMemory[];
  history: Array<{ role: 'player' | 'narrator' | 'npc'; content: string }>;
  choiceSelected?: StoryChoice;
  customInput?: string;
}

export async function advanceStory(context: StoryContext): Promise<StoryGenerationResponse> {
  try {
    const res = await fetch('/api/story/next', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(context),
    });

    if (res.ok) {
      const data: StoryGenerationResponse = await res.json();
      if (data && data.narrative && data.choices && data.choices.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[StoryEngine] API invocation failed or offline, falling back to local simulation branch:', err);
  }

  // Graceful deterministic fallback simulation
  return generateLocalFallback(context);
}

function generateLocalFallback(context: StoryContext): StoryGenerationResponse {
  const { choiceSelected, customInput, npcs } = context;
  const choiceId = choiceSelected?.id || '';
  const intent = choiceSelected?.intent || 'control';

  // Branch 1: Control / Press Lin Yuan
  if (intent === 'control' || choiceId.includes('linyuan')) {
    return {
      title: '赛后采访区 · 镜头前的颤栗',
      atmosphere: '闪光灯在采访通道尽头疯狂闪烁，空气中散发着冷气与压抑的荷尔蒙。',
      narrative: `林鸢的指节在红黑队服的下摆处无声捏紧。你的冷言如同一根钢针，精准挑破了她刚刚因MVP而升起的最后一丝侥幸与自傲。

在全国各大直播平台汇聚的赛后采访席上，面对身着职业装的官方解说温雅的递麦提问：“林鸢选手，今天以42%的全场伤害占比闪电终结三冠王，请问队内的打野选手‘川’在这场速胜中扮演了怎样的角色？”

数百万观众的弹幕在屏幕上滚滚而过。
林鸢站在聚光灯下，胸口微微起伏。她没有如往常那样习惯性地将功劳归结为中单对线细节，而是转过头，余光穿过阴影中的选手通道，直直地落在你的身上。
她的唇角绷得很紧，良久才近乎屈辱地轻声开口：“……川是这支战队的绝对主宰。在召唤师峡谷里，他的意志就是我唯一的出刀方向。”

场馆解说瞬间哗然，而站在候场区的苏妲眯起了狐狸眼，低声冷笑：“她竟然真被你驯服得连尊严都不要了……野王大人，你到底抓了她什么把柄？”`,
      npcUpdates: [
        {
          npcId: 'lin_yuan',
          favorDelta: -5,
          submissionDelta: 15,
          suspicionDelta: 5,
          newMood: '在镜头前公开承认你的绝对主宰地位，内心充斥着羞耻与潜意识依赖',
        },
        {
          npcId: 'su_da',
          favorDelta: 10,
          submissionDelta: 0,
          suspicionDelta: 15,
          newMood: '狐狸眼里写满了狂热的窥探欲，渴望取代林鸢成为你唯一的棋子',
        }
      ],
      statChanges: {
        coldMind: 2,
        prestige: 5,
      },
      matchStats: {
        stage: '揭幕战第一局复盘',
        kda: '10/0/2 (林鸢) | 2/0/12 (川)',
        controlRate: '野区掌控率 94.2%',
        mvpCandidate: '川 (幕后造神)'
      },
      choices: [
        {
          id: 'fb_corridor_confront',
          text: '在采访退场通道截住林鸢，当着苏妲的面检查她的情绪状态与协议备忘录。',
          intent: 'control',
          hint: '将更衣室矛盾摆上台面，极限压制林鸢并震慑全队'
        },
        {
          id: 'fb_suda_whisper',
          text: '转头贴近苏妲耳畔：“想知道把柄？今晚十一点，拿着更衣室备用钥匙来找我。”',
          intent: 'tempt',
          hint: '引诱主力辅助苏妲入局，构筑更深层的派系同盟'
        },
        {
          id: 'fb_coach_meeting',
          text: '无视两名女队员的交锋，径直走向赛训总监韩教练的战术观察室，要求确立第二局的一票否决权。',
          intent: 'gamble',
          hint: '直接向俱乐部管理层逼宫，将赛场统治力变现为实权'
        }
      ]
    };
  }

  // Branch 2: Tease Su Da
  if (intent === 'tempt' || choiceId.includes('suda')) {
    return {
      title: '选手备战席 · 狐狸眼的试探',
      atmosphere: '战队战术白板在冷光灯下泛着微光，走廊里回荡着三冠王穹顶战队摔椅子的怒骂声。',
      narrative: `听到你漫不经心提出的“下局把人头全喂给辅助”，苏妲修长的眼尾微微上挑，一抹妖娆而危险的笑意在唇边荡漾开来。
她踩着红黑战队运动鞋向前跨了半步，身形几乎贴近你的手臂。

“林冬夏，你可真是个让人骨头都发酥的暴君。”苏妲压低声音，指尖轻轻在你电竞战术背包的拉链上打了个转，“林鸢那个傲慢的大小姐能给你的，我一样能给，甚至……比她懂事得多。你敢喂，我就敢在赛后复盘会上全票保你的核心指挥位。”

不远处正在整理队服领口的林鸢猛然回头，眼神在触及你们挨得极近的身影时骤然一沉，下唇几乎被自己咬出血丝。
这支豪门战队原本牢不可破的派系防线，正在你的翻云覆雨下无声碎裂。`,
      npcUpdates: [
        {
          npcId: 'su_da',
          favorDelta: 15,
          submissionDelta: 5,
          suspicionDelta: -5,
          newMood: '完全被你的野区掌控力与手段迷住，愿意充当你在队内的眼线',
        },
        {
          npcId: 'lin_yuan',
          favorDelta: -5,
          submissionDelta: 10,
          suspicionDelta: 10,
          newMood: '感受到强烈的被替代危机，对你的占有与把柄产生慌乱',
        }
      ],
      statChanges: {
        coldMind: 3,
        prestige: 3,
      },
      choices: [
        {
          id: 'fb_balance_powers',
          text: '从苏妲手中抽回背包，冷冷抽离：“我要的不是站队，是绝对服从。第二局拿硬辅，只保我的入侵视野。”',
          intent: 'control',
          hint: '拒绝被反向拉拢，巩固自身独立暴君地位'
        },
        {
          id: 'fb_use_suda_threat',
          text: '故意当着林鸢的面拍了拍苏妲的肩膀：“那第二局就看你的表现了，苏副队。”',
          intent: 'feed',
          hint: '极致精神施压林鸢，逼迫其在更衣室主动加码承诺'
        },
        {
          id: 'fb_check_pact',
          text: '取出内衬口袋中的【套间玄关私密协议】，借着阴影朝林鸢晃动一角，示意她立刻跟上。',
          intent: 'control',
          hint: '激活客体记忆道具，强制林鸢进行私人兑现'
        }
      ]
    };
  }

  // Branch 3: Cold / Discipline / Custom Input
  const userText = customInput ? `“${customInput}”` : '冷漠的收拾战术外设';
  return {
    title: '俱乐部复盘室 · 窒息的威慑',
    atmosphere: '投影仪打出惨白的光束，空调冷气呼呼作响，房间里没有任何人敢率先开口。',
    narrative: `你面对全场的喧嚣与身旁的暗流，仅仅抛出一句${userText}。
这种完全跳出常人虚荣心的极度冷静，让原本想看你笑话或是试探你底线的队友们心头皆是一颤。

二十分钟后，基地顶层VIP复盘室内。
韩教练坐在主位，厚重的文件被他一把拍在桌上。全队上下鸦雀无声，唯有你气定神闲地坐在单人电竞椅上，指尖在战术记录仪上滑动画线。
林鸢坐在你的斜对面，已经换上了常服，白衬衫扎在黑色高腰长裤里，却始终垂着眼帘不敢与你正面对视。
“川，”韩教练终于转过头，沙哑的声音在空旷的房间里回荡，“第二局穹顶战队必定五人抱团锁死野区，甚至会不惜一切代价越塔针对中路。你赛前的算力，还能撑住几成？”`,
    npcUpdates: [
      {
        npcId: 'coach_han',
        favorDelta: 10,
        submissionDelta: 5,
        suspicionDelta: -5,
        newMood: '对你的铁血军纪与心理素质极度赏识，正在考虑调整合同等级',
      },
      {
        npcId: 'lin_yuan',
        favorDelta: 5,
        submissionDelta: 10,
        suspicionDelta: 5,
        newMood: '在压抑的复盘气氛中，愈发意识到只有依靠你的算力才能保住职业生涯',
      }
    ],
    statChanges: {
      jungleControl: 3,
      coldMind: 4,
    },
    choices: [
      {
        id: 'fb_draft_takeover',
        text: '直接站起身，夺过教练手里的战术光标：“第二局BP由我全权接管，中路给林鸢选诱饵英雄，我来断穹顶全队的退路。”',
        intent: 'control',
        hint: '直接剥夺教练组的部分BP权，将林鸢当作活体诱饵'
      },
      {
        id: 'fb_demand_contract',
        text: '靠在椅背上漫不经心：“穹顶的战术我早就破译了。但在开局前，我要战队立刻确认我的首发顶薪待遇变更。”',
        intent: 'gamble',
        hint: '在最关键时刻进行资本勒索，最大化自身商业价值'
      },
      {
        id: 'fb_private_deal',
        text: '目光扫向林鸢那张白皙绷紧的侧脸：“想知道怎么破局？林鸢，今晚复盘结束后，你留下来单独特训。”',
        intent: 'tempt',
        hint: '在全队见证下对林鸢施加私人密约压力，触发深层特殊支线'
      }
    ]
  };
}

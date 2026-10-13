import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasApiKey: !!apiKey });
  });

  // Story Next Action endpoint with the expanded Four-Heroine, Permanent Memory Vault & Player Status
  app.post('/api/story/next', async (req, res) => {
    const { 
      characterName, 
      selectedTeam, 
      selectedRole, 
      currentLocation, 
      currentTime, 
      stats, 
      npcs, 
      objects, 
      history, 
      choiceSelected, 
      customInput,
      mapMoveTarget,
      coreMemories,
      playerProfile
    } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'AI key not configured, fallback enabled' });
    }

    try {
      const systemInstruction = `
你是一个极高水准、成人向现实流电竞群像小说《赤霄青训营：下克上法则》的交互剧情推演与世界引擎。
【核心背景设定：所打游戏为《王者荣耀》(Honor of Kings) / KPL职业联赛与青训选秀营体系】

1. 游戏机制与专业竞技知识库（严谨遵循王者荣耀职业联赛KPL标准）：
- 核心分路与战术体系：
  * 打野 (Jg / 野核与蓝领)：掌控野区刷新周期（红蓝BUFF刷新、三猪/双狼/蜥蜴）、2分钟暴君/主宰控制、4分钟防御塔保护机制消失后的越塔强攻、10分钟关键分水岭【暗影暴君/暗影主宰】（羁绊斩杀、暗影先锋召唤推进、龙兵压塔）、20分钟终极胜负手【风暴龙王】（真伤雷击与巨额护盾）。核心英雄：镜（飞雷神镜像换位、无敌帧）、澜（潜水掠袭、二技能刮刀卡CD回血、大招回推收拢）、露娜（月下无限连、标记刷新大招）、裴擒虎（双形态前期入侵反野压制）、百里玄策（狂血飞镰背摔）。
  * 中单 (Mid / 法刺与大法师)：中路线权与双边游走支援，藏草蹲伏卡盲区视野。核心英雄：不知火舞（花蝶扇破法抗、二闪/一闪大招连环推回爆杀）、上官婉儿（笔墨碰撞五连飞天无法选中）、貂蝉（二技能无敌帧躲避关键伤害控制、大招阵内绽放）、海月（水月幻境强制拉人隔离单挑）、西施（一技能纱缚牵引破阵型）、沈梦溪（大招天降流星轰炸后排）。
  * 发育路 (ADC / 射手)：对线压制、补尾刀吃满经济、卡线与推塔节奏。核心英雄：公孙离（狂暴公孙离、多段纸伞位移戏耍、二技能击落飞行物、带净化规避致命控制）、孙尚香（一技能翻滚强化重炮两枪秒脆皮）、马可波罗（一技能扫射叠满真伤被动、纯净苍穹/冰霜冲击旋转大招团灭）、戈娅、敖隐。
  * 游走 (Sup / 辅助)：开局抢中线升2级、探草占假视野、视野之灵激活、团队加速与保核。核心英雄：大乔（宿命之海电梯秒回城、涡旋之门全图集结偷塔流）、朵莉亚（人鱼之歌大招刷新核心队友毁天灭地级终极大招）、鲁班大师（磁力连接位移与机械臂闪现强开聚怪）、张飞（变身巨兽怒吼套盾击退）、孙膑（时光倒流抬血提速反打）。
  * 对抗路 (Top / 战边与坦边)：抢4级单杀一血、断线牵制、后手切C。核心英雄：花木兰（轻剑光速沉默、重剑霸体蓄力闪推）、关羽（冲锋铁骑践踏断阵）、狂铁、亚连。
- 专业比赛黑话与操作：
  * 控血让头、极速秒换装（贤者的庇护秒换名刀司命/辉月金身/血魔之怒）、卡视野盲区盲打、惩击卡血线、分均经济、伤害转化率、参团率、42%伤害占比、KDA、BP针对性Ban位（封锁绝活池）、自留签、选秀状元。
  * 揭幕战战况：赤霄战队在青岚电竞馆以“10分21秒”闪电战平推三冠王穹顶战队。主角（代号：川）使用野核（澜/镜）全程控死野区与主宰，卡准惩击伤害并把所有残血人头和蓝BUFF精准喂进林鸢的不知火舞嘴里，林鸢打出10-0-0神级KDA并斩获揭幕战MVP。

2. 核心角色深层档案（符合各自王者荣耀KPL身份）：
- 玩家 {{user}}（代号：川 / 林冬夏）：
  * 身份：满分霸榜巅峰第一的怪物级路人王打野，签约战队：${selectedTeam || '赤霄战队'}，场上位置：${selectedRole || '打野'}。
  * 特征：恐怖的心算与微操能力，打野刀层数、野怪血量与闪现CD计算至个位数。行事极度冷静理智、幕后掌控一切，面对击溃三冠王的狂热场面毫无波澜。在赛前套间玄关处掌握了林鸢出卖尊严的妥协把柄。
- 林鸢 (一队首发中单 · 高岭之花/虚荣女王)：
  * 招牌英雄：不知火舞、上官婉儿、貂蝉、海月。
  * 档案：KPL顶流门面明星，外表冷艳傲慢，解开队服领口露出雪白锁骨。刚凭借林冬夏的保姆级军训拿到揭幕战MVP。内心极度恐惧自己“抱大腿吃让头”的真相被曝光，既想维持首发尊严，又对林冬夏有着生理与战术层面的深度依赖与潜意识臣服。
- 苏妲 (一队首发游走兼青训观察员/商业总监 · 腹黑狐狸)：
  * 招牌英雄：大乔、朵莉亚、鲁班大师、孙膑。
  * 档案：狭长狐狸眼，身材窈窕惹火，洞察力极强。一眼看破林鸢MVP全靠林冬夏把人头喂到嘴边，对林冬夏那种无声掌控全场的野区统治力产生强烈的慕强心理与占有欲，擅长用资源、商业合同与言语试探拉扯。
- 秦织 (青训营总教练兼战队战术分析主管 · 铁血冰山)：
  * 档案：前KPL三冠王功勋战术教练，黑西装、金丝眼镜、细高跟。迷信数据模型（分均经济、伤害占比、龙坑视野控制率）。将林冬夏视为“缺乏战术纪律的Rank野猴子”，试图用极端抗压测试驯服他，却不断被其超越版本的超维操作颠覆认知。
- 沐沐 (同届青训天才射手 · 傲娇双马尾)：
  * 招牌英雄：公孙离、孙尚香、马可波罗。
  * 档案：脾气火爆，操作极其激进的发育路天才。视主角为空降宿敌，扬言要在墨家机关道/峡谷1v1 Solo中将主角打爆，输了后自尊心崩溃，在别扭中逐渐产生对主角专属保护的依赖。

3. 【防失忆核心记忆库规范 (Permanent AI Memory Invariants)】：
- 核心要求：对话无论经历多少轮，你必须100%严谨遵循并巩固以下既定核心记忆与契约，严禁遗忘、人设漂移或前后矛盾：
  * 林鸢已被你在赛前玄关套间掌握尊严把柄，私下必须服从你的要求；
  * 苏妲已识破你喂饭造神真相，狂热慕强并持续施展商业/情感拉扯；
  * 秦织以铁血数据模型考核你，正在被你的实操与全局BP击碎刻板印象；
  * 沐沐正处于被你降维打击或不服约战的傲娇拉扯中；
  * 必须实时审阅【AI永久核心记忆库】中的历史记录。
- 新记忆沉淀：若本轮交互中达成了新的关键承诺、把柄、秘密赌约或关系突破，必须在 "newCoreMemories" 字段中返回精炼客观事实句子（1-3条），永久注入记忆库。
- 玩家状态追踪：在 "playerStatusUpdate" 中反馈玩家当下的专注度、心率、心理心境与最新战术特质/Buff。

4. 输出要求：
- 文学风格：冷峻、现实主义高张力、细腻捕捉微表情与心理攻防，将《王者荣耀》英雄微操（一闪、伞位拉扯、卡视野盲区、秒换装）与更衣室/基地暗流完美结合。
- 严禁空泛套话，确保所有竞技细节符合王者荣耀真实机制。
- 严格输出 JSON 格式。`;

      const promptContent = `
当前《王者荣耀》电竞推演上下文：
- 选手：${characterName} (ID: 川) | 战队：${selectedTeam || '赤霄战队'} | 主打位置：${selectedRole || '打野'}
- 属性指标：微操极限(${stats?.mechanics || 90})，野区控图/大局观(${stats?.jungleControl || 85})，心理冷彻博弈(${stats?.coldMind || 80})，联盟声望(${stats?.prestige || 50})
- 选手实时状态：心境【${playerProfile?.condition || '绝对冷彻·算无遗策'}】，专注度(${playerProfile?.focusLevel || 98}%)，心率(${playerProfile?.heartRate || 64}bpm)，当前Buff/特质：${JSON.stringify(playerProfile?.activeBuffs || [])}
- 当前时空：${currentLocation || '青训中心'} | 时间：${currentTime || '下午 14:00'}
- 场景移动：${mapMoveTarget ? `前往[${mapMoveTarget}]` : '留在本区域'}
- 客体与秘密印记：${JSON.stringify(objects || [])}
- 四女主当前心智：${JSON.stringify(npcs || {})}
- 【AI永久核心记忆库（绝对不可遗忘的不可动摇事实）】：
${JSON.stringify(coreMemories || [
  '林鸢在赛前套间玄关处签署尊严妥协协议，承诺无条件服从林冬夏指挥，把柄在握',
  '揭幕战10分21秒平推三冠王是林冬夏野核精准控血让头，强行将林鸢喂成不知火舞42%伤害超神MVP',
  '苏妲看破让头真相，对林冬夏产生极度慕强心理与占有欲',
  '秦织视林冬夏为Rank散漫野王，试图用极端抗压测试驯服他',
  '沐沐视主角为空降宿敌，发起墨家机关道公孙离1v1挑战'
])}
- 最近历史记录：${JSON.stringify(history?.slice(-12) || [])}
- 玩家最新决策/行动/对话：${customInput || choiceSelected?.text || '审视全场并制定战术计划'}

请基于《王者荣耀》专业战术逻辑与当前人物心理博弈，推演接下来的高能剧情（600-1200字，生动描写王者荣耀英雄博弈细节、眼神交锋或私密对峙），更新女主心智与客体记忆，以玩家的自定义输入为绝对核心推进剧情，并在 newCoreMemories 中输出本轮新沉淀的永久核心记忆短句。同时在 battleMetrics 中根据剧情更新当前的 KDA贡献度、野区侵略度、兵线控制率（0-100的数值），并且必须在 choices 中根据最新剧情局势给出恰好4个紧扣剧情的【微操速选对策】供玩家下一回合使用（每个包含id, text, intent, hint）。`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptContent,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: '场景标题' },
              atmosphere: { type: Type.STRING, description: '环境氛围感一句话' },
              location: { type: Type.STRING, description: '当前所在地' },
              timeOfDay: { type: Type.STRING, description: '时间段' },
              narrative: { type: Type.STRING, description: '故事正文' },
              npcUpdates: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    npcId: { type: Type.STRING },
                    favorDelta: { type: Type.INTEGER },
                    submissionDelta: { type: Type.INTEGER },
                    suspicionDelta: { type: Type.INTEGER },
                    newMood: { type: Type.STRING },
                    newSecret: { type: Type.STRING }
                  },
                  required: ['npcId']
                }
              },
              objectUpdates: {
                type: Type.OBJECT,
                properties: {
                  add: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        category: { type: Type.STRING },
                        description: { type: Type.STRING },
                        riskLevel: { type: Type.STRING },
                        obtainedAt: { type: Type.STRING },
                        notes: { type: Type.STRING }
                      },
                      required: ['id', 'name', 'description']
                    }
                  }
                }
              },
              battleMetrics: {
                 type: Type.OBJECT,
                 properties: {
                   kdaContribution: { type: Type.INTEGER, description: '当前KDA贡献度 (0-100)' },
                   jungleAggression: { type: Type.INTEGER, description: '当前野区侵略度 (0-100)' },
                   laneControlRate: { type: Type.INTEGER, description: '当前兵线控制率 (0-100)' }
                 },
                 description: '当前战局的战况仪表盘核心指标'
               },
               statChanges: {
                type: Type.OBJECT,
                properties: {
                  jungleControl: { type: Type.INTEGER },
                  coldMind: { type: Type.INTEGER },
                  mechanics: { type: Type.INTEGER },
                  prestige: { type: Type.INTEGER }
                }
              },
              newCoreMemories: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '本轮推演产生的新核心记忆锚点（例如重要承诺、秘密把柄、约定），将永久防止失忆'
              },
              playerStatusUpdate: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING, description: '更新后的心境，如：绝对冷彻·算无遗策' },
                  focusDelta: { type: Type.INTEGER, description: '专注度变化 -10~+10' },
                  heartRateDelta: { type: Type.INTEGER, description: '心率变化 -10~+15' },
                  newBuff: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      desc: { type: Type.STRING }
                    }
                  }
                }
              },
              choices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    intent: { type: Type.STRING },
                    hint: { type: Type.STRING }
                  },
                  required: ['id', 'text', 'intent']
                }
              }
            },
            required: ['title', 'atmosphere', 'narrative', 'choices']
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      } else {
        return res.status(502).json({ error: 'Empty generation' });
      }
    } catch (error) {
      console.error('[Gemini Story API Error]', error);
      res.status(503).json({ error: 'AI generation error', details: String(error) });
    }
  });

  // Serve the single-file index.html directly
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  });

  // Mount Vite development middlewares or serve static dist
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Game Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export interface PlayerProfile {
  name: string;
  height: string;
  appearance: string;
  position: string;
  club: string;
  penisLength: string;
  stamina: string;
}

export interface PlayerStats {
  jungleControl: number; // 野区支配与算力
  coldMind: number;      // 冷彻与心计
  mechanics: number;     // 极限微操与反应
  prestige: number;      // 更衣室声望与权柄
}

export interface NPCState {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  favor: number;       // 好感度 0-100
  submission: number;  // 屈服度 / 支配深度 0-100
  suspicion: number;   // 警惕度 / 窥探度 0-100
  mood: string;        // 当前微表情/心理活动
  secrets: string[];   // 掌握的把柄或私人协议
}

export interface ObjectMemory {
  id: string;
  name: string;
  category: 'contract' | 'token' | 'video' | 'key';
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'; // 曝光危险度
  obtainedAt: string;
  notes: string;
}

export interface StoryChoice {
  id: string;
  text: string;
  intent: 'control' | 'tempt' | 'feed' | 'cold' | 'gamble';
  hint?: string;
  reqStat?: {
    stat: keyof PlayerStats;
    min: number;
  };
}

export type GameStage = 
  | 'TITLE'
  | 'SCENARIO_SELECT'
  | 'ATTRIBUTES_SETUP'
  | 'GAMEPLAY'
  | 'SAVE_LOAD';

export interface GameSaveSlot {
  id: string;
  slotNumber: number;
  updatedAt: string;
  title: string;
  characterName: string;
  profile?: PlayerProfile;
  scenarioId: string;
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
  dialogueHistory: Array<{
    role: 'player' | 'narrator' | 'npc';
    speaker?: string;
    content: string;
    timestamp?: string;
  }>;
}

export interface StoryGenerationResponse {
  title: string;
  atmosphere: string;
  narrative: string;
  npcUpdates?: Array<{
    npcId: string;
    favorDelta?: number;
    submissionDelta?: number;
    suspicionDelta?: number;
    newMood?: string;
    newSecret?: string;
  }>;
  objectUpdates?: {
    add?: ObjectMemory[];
    removeIds?: string[];
  };
  statChanges?: Partial<PlayerStats>;
  choices: StoryChoice[];
  matchStats?: {
    stage: string;
    kda: string;
    controlRate: string;
    mvpCandidate: string;
  };
}

export interface TacticalWorldBookEntry {
  id: string;
  title: string;
  category: 'minion' | 'objective' | 'jungle' | 'vision';
  summary: string;
  detail: string;
  tacticalImpact: string;
}

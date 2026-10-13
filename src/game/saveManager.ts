import { GameSaveSlot, PlayerStats, NPCState, ObjectMemory, StoryChoice } from '../gameTypes';

const SAVE_KEY_PREFIX = 'chixiao_save_slot_';
const AUTOSAVE_KEY = 'chixiao_autosave';

export interface CurrentGameState {
  title: string;
  characterName: string;
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

export class SaveManager {
  static getSaveSlots(): (GameSaveSlot | null)[] {
    const slots: (GameSaveSlot | null)[] = [];
    for (let i = 1; i <= 3; i++) {
      try {
        const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${i}`);
        if (raw) {
          slots.push(JSON.parse(raw));
        } else {
          slots.push(null);
        }
      } catch (e) {
        console.error('Error reading save slot', i, e);
        slots.push(null);
      }
    }
    return slots;
  }

  static getAutoSave(): GameSaveSlot | null {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static saveToSlot(slotNumber: number, state: CurrentGameState): boolean {
    try {
      const saveSlot: GameSaveSlot = {
        id: `slot_${slotNumber}_${Date.now()}`,
        slotNumber,
        updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
        title: state.currentScene.title || '基地走廊与赛场',
        characterName: state.characterName,
        scenarioId: state.scenarioId,
        stats: { ...state.stats },
        npcs: JSON.parse(JSON.stringify(state.npcs)),
        objects: JSON.parse(JSON.stringify(state.objects)),
        currentScene: JSON.parse(JSON.stringify(state.currentScene)),
        dialogueHistory: JSON.parse(JSON.stringify(state.dialogueHistory.slice(-20)))
      };
      localStorage.setItem(`${SAVE_KEY_PREFIX}${slotNumber}`, JSON.stringify(saveSlot));
      return true;
    } catch (e) {
      console.error('Failed to save game to slot', slotNumber, e);
      return false;
    }
  }

  static autoSave(state: CurrentGameState): void {
    try {
      const saveSlot: GameSaveSlot = {
        id: `auto_${Date.now()}`,
        slotNumber: 0,
        updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
        title: `[自动] ${state.currentScene.title || '赛场推演'}`,
        characterName: state.characterName,
        scenarioId: state.scenarioId,
        stats: { ...state.stats },
        npcs: JSON.parse(JSON.stringify(state.npcs)),
        objects: JSON.parse(JSON.stringify(state.objects)),
        currentScene: JSON.parse(JSON.stringify(state.currentScene)),
        dialogueHistory: JSON.parse(JSON.stringify(state.dialogueHistory.slice(-20)))
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(saveSlot));
    } catch (e) {
      console.warn('Autosave failed silently:', e);
    }
  }

  static deleteSlot(slotNumber: number): void {
    try {
      localStorage.removeItem(`${SAVE_KEY_PREFIX}${slotNumber}`);
    } catch (e) {
      console.error('Failed to delete slot:', e);
    }
  }

  static exportAllSaves(): string {
    const data = {
      autoSave: this.getAutoSave(),
      slots: this.getSaveSlots(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importSaves(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.autoSave) {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(parsed.autoSave));
      }
      if (Array.isArray(parsed.slots)) {
        parsed.slots.forEach((slot: GameSaveSlot | null, idx: number) => {
          if (slot) {
            localStorage.setItem(`${SAVE_KEY_PREFIX}${idx + 1}`, JSON.stringify(slot));
          }
        });
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
}

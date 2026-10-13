import React, { useState, useEffect } from 'react';
import { 
  GameStage, 
  PlayerStats, 
  NPCState, 
  ObjectMemory, 
  StoryChoice, 
  GameSaveSlot, 
  StoryGenerationResponse 
} from '@/src/gameTypes';
import { INITIAL_NPCS, INITIAL_OBJECTS, ScenarioDefinition, SCENARIO_LIST } from '@/src/game/constants';
import { SaveManager, CurrentGameState } from '@/src/game/saveManager';
import { advanceStory } from '@/src/game/storyEngine';
import { TitleScreen } from '@/src/components/TitleScreen';
import { ScenarioSelect } from '@/src/components/ScenarioSelect';
import { AttributesSetup } from '@/src/components/AttributesSetup';
import { TopNav } from '@/src/components/TopNav';
import { GameScreen } from '@/src/components/GameScreen';
import { NPCDrawer } from '@/src/components/NPCDrawer';
import { ObjectsDrawer } from '@/src/components/ObjectsDrawer';
import { SaveLoadModal } from '@/src/components/SaveLoadModal';

export default function App() {
  const [stage, setStage] = useState<GameStage>('TITLE');
  const [characterName, setCharacterName] = useState<string>('林冬夏');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDefinition>(SCENARIO_LIST[0]);
  const [stats, setStats] = useState<PlayerStats>({
    jungleControl: 85,
    coldMind: 80,
    mechanics: 75,
    prestige: 50,
  });
  const [npcs, setNpcs] = useState<Record<string, NPCState>>(INITIAL_NPCS);
  const [objects, setObjects] = useState<ObjectMemory[]>(INITIAL_OBJECTS);
  
  const [currentScene, setCurrentScene] = useState<{
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
  }>({
    title: SCENARIO_LIST[0].title,
    atmosphere: SCENARIO_LIST[0].startingAtmosphere,
    narrative: SCENARIO_LIST[0].initialPlot,
    choices: SCENARIO_LIST[0].initialChoices,
  });

  const [dialogueHistory, setDialogueHistory] = useState<Array<{
    role: 'player' | 'narrator' | 'npc';
    speaker?: string;
    content: string;
    timestamp?: string;
  }>>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recentStatChanges, setRecentStatChanges] = useState<string[]>([]);
  
  // Drawers & Modals
  const [showNPCDrawer, setShowNPCDrawer] = useState<boolean>(false);
  const [showObjectsDrawer, setShowObjectsDrawer] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [autoSaveSlot, setAutoSaveSlot] = useState<GameSaveSlot | null>(null);

  useEffect(() => {
    setAutoSaveSlot(SaveManager.getAutoSave());
  }, []);

  const getCurrentSnapshot = (): CurrentGameState => ({
    title: currentScene.title,
    characterName,
    scenarioId: selectedScenario.id,
    stats,
    npcs,
    objects,
    currentScene,
    dialogueHistory,
  });

  // State Machine Handlers
  const handleStartNewGame = () => {
    setStage('SCENARIO_SELECT');
  };

  const handleSelectScenario = (scenario: ScenarioDefinition) => {
    setSelectedScenario(scenario);
    setCurrentScene({
      title: scenario.title,
      atmosphere: scenario.startingAtmosphere,
      narrative: scenario.initialPlot,
      choices: scenario.initialChoices,
      matchStats: scenario.id === 'opening_triumph' ? {
        stage: '揭幕战第一局复盘',
        kda: '10/0/2 (林鸢) | 2/0/12 (川)',
        controlRate: '野区掌控率 94.2%',
        mvpCandidate: '川 (幕后造神)'
      } : undefined
    });
    setStage('ATTRIBUTES_SETUP');
  };

  const handleConfirmAttributes = (name: string, newStats: PlayerStats) => {
    setCharacterName(name);
    setStats(newStats);
    setNpcs(JSON.parse(JSON.stringify(INITIAL_NPCS)));
    setObjects(JSON.parse(JSON.stringify(INITIAL_OBJECTS)));
    setDialogueHistory([{
      role: 'narrator',
      content: selectedScenario.initialPlot,
      timestamp: new Date().toLocaleTimeString()
    }]);
    setStage('GAMEPLAY');

    // Auto save initial state
    const initState: CurrentGameState = {
      title: selectedScenario.title,
      characterName: name,
      scenarioId: selectedScenario.id,
      stats: newStats,
      npcs: INITIAL_NPCS,
      objects: INITIAL_OBJECTS,
      currentScene: {
        title: selectedScenario.title,
        atmosphere: selectedScenario.startingAtmosphere,
        narrative: selectedScenario.initialPlot,
        choices: selectedScenario.initialChoices,
      },
      dialogueHistory: [{
        role: 'narrator',
        content: selectedScenario.initialPlot,
      }]
    };
    SaveManager.autoSave(initState);
    setAutoSaveSlot(SaveManager.getAutoSave());
  };

  const handleLoadGame = (slot: GameSaveSlot) => {
    setCharacterName(slot.characterName || '林冬夏');
    setStats(slot.stats);
    setNpcs(slot.npcs || INITIAL_NPCS);
    setObjects(slot.objects || INITIAL_OBJECTS);
    setCurrentScene(slot.currentScene);
    setDialogueHistory(slot.dialogueHistory || []);
    setRecentStatChanges(['已载入进度']);
    setTimeout(() => setRecentStatChanges([]), 3000);
    setStage('GAMEPLAY');
  };

  const handleProcessStoryResponse = (result: StoryGenerationResponse, actionLabel: string) => {
    // 1. Update stats
    const changes: string[] = [];
    if (result.statChanges) {
      setStats(prev => {
        const next = { ...prev };
        if (result.statChanges?.jungleControl) {
          next.jungleControl = Math.min(100, Math.max(10, next.jungleControl + result.statChanges.jungleControl));
          changes.push(`野区支配 ${result.statChanges.jungleControl > 0 ? '+' : ''}${result.statChanges.jungleControl}`);
        }
        if (result.statChanges?.coldMind) {
          next.coldMind = Math.min(100, Math.max(10, next.coldMind + result.statChanges.coldMind));
          changes.push(`冷彻 ${result.statChanges.coldMind > 0 ? '+' : ''}${result.statChanges.coldMind}`);
        }
        if (result.statChanges?.mechanics) {
          next.mechanics = Math.min(100, Math.max(10, next.mechanics + result.statChanges.mechanics));
          changes.push(`微操 ${result.statChanges.mechanics > 0 ? '+' : ''}${result.statChanges.mechanics}`);
        }
        if (result.statChanges?.prestige) {
          next.prestige = Math.min(100, Math.max(10, next.prestige + result.statChanges.prestige));
          changes.push(`声望 ${result.statChanges.prestige > 0 ? '+' : ''}${result.statChanges.prestige}`);
        }
        return next;
      });
    }

    // 2. Update NPCs
    if (result.npcUpdates && result.npcUpdates.length > 0) {
      setNpcs(prev => {
        const next = { ...prev };
        result.npcUpdates?.forEach(up => {
          if (next[up.npcId]) {
            const current = next[up.npcId];
            if (up.favorDelta) {
              current.favor = Math.min(100, Math.max(0, current.favor + up.favorDelta));
              changes.push(`${current.name}好感 ${up.favorDelta > 0 ? '+' : ''}${up.favorDelta}%`);
            }
            if (up.submissionDelta) {
              current.submission = Math.min(100, Math.max(0, current.submission + up.submissionDelta));
              changes.push(`${current.name}屈服 ${up.submissionDelta > 0 ? '+' : ''}${up.submissionDelta}%`);
            }
            if (up.suspicionDelta) {
              current.suspicion = Math.min(100, Math.max(0, current.suspicion + up.suspicionDelta));
            }
            if (up.newMood) {
              current.mood = up.newMood;
            }
            if (up.newSecret && !current.secrets.includes(up.newSecret)) {
              current.secrets.push(up.newSecret);
              changes.push(`截获${current.name}把柄`);
            }
          }
        });
        return next;
      });
    }

    // 3. Update objects
    if (result.objectUpdates?.add) {
      setObjects(prev => [...prev, ...(result.objectUpdates?.add || [])]);
      result.objectUpdates.add.forEach(o => changes.push(`获得客体【${o.name}】`));
    }

    // 4. Update current scene
    setCurrentScene({
      title: result.title || currentScene.title,
      atmosphere: result.atmosphere || currentScene.atmosphere,
      narrative: result.narrative,
      choices: result.choices,
      matchStats: result.matchStats || currentScene.matchStats,
    });

    // 5. Update history
    setDialogueHistory(prev => [
      ...prev,
      { role: 'player', content: actionLabel, timestamp: new Date().toLocaleTimeString() },
      { role: 'narrator', content: result.narrative, timestamp: new Date().toLocaleTimeString() }
    ]);

    setRecentStatChanges(changes);
    setTimeout(() => setRecentStatChanges([]), 4000);

    // 6. Trigger Auto-save
    setTimeout(() => {
      SaveManager.autoSave({
        title: result.title || currentScene.title,
        characterName,
        scenarioId: selectedScenario.id,
        stats,
        npcs,
        objects,
        currentScene: {
          title: result.title || currentScene.title,
          atmosphere: result.atmosphere || currentScene.atmosphere,
          narrative: result.narrative,
          choices: result.choices,
          matchStats: result.matchStats,
        },
        dialogueHistory,
      });
      setAutoSaveSlot(SaveManager.getAutoSave());
    }, 100);
  };

  const handleSelectChoice = async (choice: StoryChoice) => {
    setIsLoading(true);
    try {
      const result = await advanceStory({
        characterName,
        scenarioId: selectedScenario.id,
        stats,
        npcs,
        objects,
        history: dialogueHistory.map(h => ({ role: h.role, content: h.content })),
        choiceSelected: choice,
      });
      handleProcessStoryResponse(result, choice.text);
    } catch (e) {
      console.error('Story progression error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCustomAction = async (input: string) => {
    setIsLoading(true);
    try {
      const result = await advanceStory({
        characterName,
        scenarioId: selectedScenario.id,
        stats,
        npcs,
        objects,
        history: dialogueHistory.map(h => ({ role: h.role, content: h.content })),
        customInput: input,
      });
      handleProcessStoryResponse(result, input);
    } catch (e) {
      console.error('Story progression error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/60 to-yellow-100 text-amber-950 font-sans antialiased selection:bg-amber-500 selection:text-white flex flex-col justify-between">
      {stage === 'TITLE' && (
        <TitleScreen 
          onStartNew={handleStartNewGame}
          onOpenSaves={() => setShowSaveModal(true)}
          autoSaveSlot={autoSaveSlot}
          onContinueAutoSave={() => autoSaveSlot && handleLoadGame(autoSaveSlot)}
        />
      )}

      {stage === 'SCENARIO_SELECT' && (
        <ScenarioSelect 
          onBack={() => setStage('TITLE')}
          onSelectScenario={handleSelectScenario}
        />
      )}

      {stage === 'ATTRIBUTES_SETUP' && (
        <AttributesSetup 
          onBack={() => setStage('SCENARIO_SELECT')}
          onConfirm={handleConfirmAttributes}
        />
      )}

      {stage === 'GAMEPLAY' && (
        <div className="flex flex-col min-h-screen">
          <TopNav 
            characterName={characterName}
            stats={stats}
            npcs={npcs}
            objects={objects}
            onOpenNPCs={() => setShowNPCDrawer(true)}
            onOpenObjects={() => setShowObjectsDrawer(true)}
            onOpenSaves={() => setShowSaveModal(true)}
            onReturnTitle={() => setStage('TITLE')}
          />
          <GameScreen 
            characterName={characterName}
            stats={stats}
            npcs={npcs}
            objects={objects}
            currentScene={currentScene}
            isLoading={isLoading}
            recentStatChanges={recentStatChanges}
            onSelectChoice={handleSelectChoice}
            onSubmitCustomAction={handleSubmitCustomAction}
            onOpenNPCs={() => setShowNPCDrawer(true)}
            onOpenObjects={() => setShowObjectsDrawer(true)}
          />
        </div>
      )}

      {/* Drawers & Modals */}
      <NPCDrawer 
        isOpen={showNPCDrawer}
        onClose={() => setShowNPCDrawer(false)}
        npcs={npcs}
      />

      <ObjectsDrawer 
        isOpen={showObjectsDrawer}
        onClose={() => setShowObjectsDrawer(false)}
        objects={objects}
      />

      <SaveLoadModal 
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        currentState={stage === 'GAMEPLAY' ? getCurrentSnapshot() : undefined}
        onLoadGame={handleLoadGame}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Save, FolderOpen, Trash2, Download, Upload, Check, AlertCircle } from 'lucide-react';
import { GameSaveSlot } from '../gameTypes';
import { SaveManager, CurrentGameState } from '../game/saveManager';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState?: CurrentGameState;
  onLoadGame: (slot: GameSaveSlot) => void;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onLoadGame,
}) => {
  const [slots, setSlots] = useState<(GameSaveSlot | null)[]>([]);
  const [autoSave, setAutoSave] = useState<GameSaveSlot | null>(null);
  const [importText, setImportText] = useState<string>('');
  const [showImport, setShowImport] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshSlots = () => {
    setSlots(SaveManager.getSaveSlots());
    setAutoSave(SaveManager.getAutoSave());
  };

  useEffect(() => {
    if (isOpen) {
      refreshSlots();
      setFeedback(null);
      setShowImport(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (slotNumber: number) => {
    if (!currentState) return;
    const ok = SaveManager.saveToSlot(slotNumber, currentState);
    if (ok) {
      setFeedback(`已成功覆盖保存至存档位 0${slotNumber}`);
      refreshSlots();
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleDelete = (slotNumber: number) => {
    SaveManager.deleteSlot(slotNumber);
    refreshSlots();
    setFeedback(`存档位 0${slotNumber} 已清除`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleExport = () => {
    const jsonStr = SaveManager.exportAllSaves();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chixiao_saves_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedback('存档数据已成功导出为本地 JSON 文件');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const ok = SaveManager.importSaves(importText.trim());
    if (ok) {
      refreshSlots();
      setShowImport(false);
      setImportText('');
      setFeedback('存档已成功导入并刷新！');
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback('导入失败：非法的 JSON 存档结构');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold tracking-wider text-zinc-100 uppercase">
              本地存档管理 (LOCAL SAVES)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-850 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div className="px-4 py-2 bg-blue-950/60 border-b border-blue-900 text-xs text-blue-300 flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-blue-400" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Slots Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {/* AutoSave Slot */}
          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-dashed border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                [自动存档位] 实时进度保护
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {autoSave ? autoSave.updatedAt : '暂无'}
              </span>
            </div>

            {autoSave ? (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">{autoSave.title}</h4>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    {autoSave.characterName} · 支配度: {autoSave.npcs?.lin_yuan?.submission || 0}%
                  </p>
                </div>
                <button
                  onClick={() => {
                    onLoadGame(autoSave);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <FolderOpen className="w-3 h-3" />
                  <span>载入</span>
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-zinc-600 italic">每次剧情推进都会在此处自动快照</p>
            )}
          </div>

          {/* Manual Slots 1, 2, 3 */}
          {[1, 2, 3].map((slotNumber) => {
            const slot = slots[slotNumber - 1];

            return (
              <div
                key={slotNumber}
                className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-400 font-bold">
                    SLOT 0{slotNumber}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {slot ? slot.updatedAt : '空白槽位'}
                  </span>
                </div>

                {slot ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">{slot.title}</h4>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {slot.characterName} · 算力({slot.stats?.jungleControl || 0}) · 客体({slot.objects?.length || 0})
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {currentState && (
                        <button
                          onClick={() => handleSave(slotNumber)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                          title="覆盖此存档"
                        >
                          覆盖
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onLoadGame(slot);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <FolderOpen className="w-3 h-3" />
                        <span>载入</span>
                      </button>
                      <button
                        onClick={() => handleDelete(slotNumber)}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
                        title="删除该槽位"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-zinc-600 italic">空存档位</span>
                    {currentState && (
                      <button
                        onClick={() => handleSave(slotNumber)}
                        className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Save className="w-3 h-3" />
                        <span>保存至此</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Import Panel */}
          {showImport && (
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 space-y-2">
              <label className="block text-xs font-bold text-zinc-300">
                粘贴导出的 JSON 存档内容：
              </label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={3}
                className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-blue-500"
                placeholder='{"autoSave": {...}, "slots": [...]}'
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowImport(false)}
                  className="px-3 py-1 rounded bg-zinc-800 text-xs text-zinc-400 hover:text-white"
                >
                  取消
                </button>
                <button
                  onClick={handleImportSubmit}
                  className="px-3 py-1 rounded bg-blue-600 text-xs font-bold text-white hover:bg-blue-500"
                >
                  确认导入
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-zinc-900 bg-zinc-950 flex items-center justify-between text-xs">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出备份 (JSON)</span>
          </button>

          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>导入备份</span>
          </button>
        </div>
      </div>
    </div>
  );
};

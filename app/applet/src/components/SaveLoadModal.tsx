import React, { useState } from 'react';
import { X, Save, FolderOpen, Trash2, Download, Upload, Check, Sun } from 'lucide-react';
import { GameSaveSlot } from '@/src/gameTypes';
import { SaveManager, CurrentGameState } from '@/src/game/saveManager';

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
  const [slots, setSlots] = useState<Array<GameSaveSlot | null>>(() => SaveManager.getSaveSlots());
  const [autoSave, setAutoSave] = useState<GameSaveSlot | null>(() => SaveManager.getAutoSave());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showImport, setShowImport] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');

  if (!isOpen) return null;

  const refreshSaves = () => {
    setSlots(SaveManager.getSaveSlots());
    setAutoSave(SaveManager.getAutoSave());
  };

  const handleSave = (slotNumber: number) => {
    if (!currentState) return;
    const success = SaveManager.saveToSlot(slotNumber, currentState);
    if (success) {
      setFeedback(`成功保存至 SLOT 0${slotNumber}`);
      refreshSaves();
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleDelete = (slotNumber: number) => {
    if (window.confirm(`确定要清空 SLOT 0${slotNumber} 存档吗？`)) {
      SaveManager.deleteSlot(slotNumber);
      refreshSaves();
      setFeedback(`已清空 SLOT 0${slotNumber}`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleExport = () => {
    const jsonStr = SaveManager.exportAllSaves();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chixiao_saves_${Date.now()}.json`;
    a.click();
    setFeedback('已成功导出本地所有存档备份');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleImportSubmit = () => {
    try {
      const success = SaveManager.importSaves(importText);
      if (success) {
        setFeedback('成功导入存档备份！');
        refreshSaves();
        setShowImport(false);
        setImportText('');
        setTimeout(() => setFeedback(null), 3000);
      } else {
        alert('导入失败，JSON格式不正确');
      }
    } catch {
      alert('导入失败，解析错误');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-amber-950/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200 font-sans">
      <div 
        className="w-full max-w-md bg-[#fefce8] border-2 border-amber-300 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-amber-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-black tracking-wider text-amber-950 uppercase">
              本地存档管理 (LOCAL SAVES)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div className="px-4 py-2.5 bg-amber-100 border-b border-amber-300 text-xs text-amber-950 font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-amber-700" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Slots Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {/* AutoSave Slot */}
          <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-amber-300 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-amber-800 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                [自动存档位] 实时剧情快照
              </span>
              <span className="text-[10px] text-amber-700 font-mono">
                {autoSave ? autoSave.updatedAt : '暂无'}
              </span>
            </div>
            {autoSave ? (
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="text-xs font-black text-amber-950">{autoSave.title}</h4>
                  <p className="text-[10px] text-amber-800 font-mono mt-0.5">
                    {autoSave.characterName} · 支配度: {autoSave.npcs?.lin_yuan?.submission || 0}%
                  </p>
                </div>
                <button
                  onClick={() => {
                    onLoadGame(autoSave);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>载入</span>
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-amber-700/80 italic">每次剧情推进都会在此处自动快照</p>
            )}
          </div>

          {/* Manual Slots 1, 2, 3 */}
          {[1, 2, 3].map((slotNumber) => {
            const slot = slots[slotNumber - 1];
            return (
              <div
                key={slotNumber}
                className="p-4 rounded-2xl bg-white border-2 border-amber-300 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-900 font-black">
                    SLOT 0{slotNumber}
                  </span>
                  <span className="text-[10px] text-amber-700 font-mono font-bold">
                    {slot ? slot.updatedAt : '空白槽位'}
                  </span>
                </div>
                {slot ? (
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <h4 className="text-xs font-black text-amber-950">{slot.title}</h4>
                      <p className="text-[10px] text-amber-800 font-mono mt-0.5 font-medium">
                        {slot.characterName} · 算力({slot.stats?.jungleControl || 0}) · 客体({slot.objects?.length || 0})
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {currentState && (
                        <button
                          onClick={() => handleSave(slotNumber)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 transition-colors"
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
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>载入</span>
                      </button>
                      <button
                        onClick={() => handleDelete(slotNumber)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                        title="删除该槽位"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-amber-700 italic font-medium">空存档位</span>
                    {currentState && (
                      <button
                        onClick={() => handleSave(slotNumber)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
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
            <div className="p-4 rounded-2xl bg-white border-2 border-amber-300 space-y-2 shadow-sm">
              <label className="block text-xs font-black text-amber-950">
                粘贴导出的 JSON 存档内容：
              </label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-mono text-amber-950 focus:outline-none focus:border-amber-500"
                placeholder='{"autoSave": {...}, "slots": [...]}'
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowImport(false)}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 text-xs font-bold text-amber-900 border border-amber-300"
                >
                  取消
                </button>
                <button
                  onClick={handleImportSubmit}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-xs font-bold text-white hover:bg-amber-700 shadow-xs"
                >
                  确认导入
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t-2 border-amber-200 bg-white flex items-center justify-between text-xs">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold border border-amber-300 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span>导出备份 (JSON)</span>
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold border border-amber-300 transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-amber-700" />
            <span>导入备份</span>
          </button>
        </div>
      </div>
    </div>
  );
};

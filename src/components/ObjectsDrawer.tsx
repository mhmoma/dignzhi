import React from 'react';
import { X, KeyRound, AlertTriangle, FileText, Film, ShieldAlert } from 'lucide-react';
import { ObjectMemory } from '../gameTypes';

interface ObjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  objects: ObjectMemory[];
}

export const ObjectsDrawer: React.FC<ObjectsDrawerProps> = ({
  isOpen,
  onClose,
  objects,
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (cat: ObjectMemory['category']) => {
    switch (cat) {
      case 'contract': return FileText;
      case 'video': return Film;
      default: return KeyRound;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wider text-zinc-100 uppercase">
              客体记忆与实体印记库 (OBJECT MEMORY)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-850 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-850">
            每一个实体道具皆记录着战队暗流中的不可逆痕迹。AI剧情引擎会根据你所持有的客体记忆，在对话与选项中解锁致命的威慑与专属分支。
          </p>

          {objects.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              暂未持有特殊客体印记
            </div>
          ) : (
            objects.map((obj) => {
              const Icon = getCategoryIcon(obj.category);
              const isHighRisk = obj.riskLevel === 'HIGH';

              return (
                <div
                  key={obj.id}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100">
                          {obj.name}
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          获得节点: {obj.obtainedAt}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isHighRisk
                        ? 'bg-red-950/80 text-red-400 border-red-800'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {isHighRisk ? '曝光极危' : '中度密级'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-serif leading-relaxed">
                    {obj.description}
                  </p>

                  {obj.notes && (
                    <div className="text-[10px] text-amber-400/90 bg-amber-950/20 p-2 rounded border border-amber-900/30 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{obj.notes}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

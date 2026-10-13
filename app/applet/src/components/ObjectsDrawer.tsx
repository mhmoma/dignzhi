import React from 'react';
import { X, KeyRound, AlertTriangle, FileText, Film, Sun } from 'lucide-react';
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
              客体记忆与实体印记库 (OBJECT MEMORY)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-xs text-amber-800 leading-relaxed bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-sm font-medium">
            每一个实体道具与合同记忆皆记录着战队暗流中的不可逆痕迹。AI剧情引擎会根据你所持有的客体记忆，在校园与赛场中解锁致命的威慑与专属分支。
          </p>

          {objects.length === 0 ? (
            <div className="py-8 text-center text-xs text-amber-700 font-bold">
              暂未持有特殊客体印记
            </div>
          ) : (
            objects.map((obj) => {
              const Icon = getCategoryIcon(obj.category);
              const isHighRisk = obj.riskLevel === 'HIGH';
              return (
                <div
                  key={obj.id}
                  className="p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-sm space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shadow-xs">
                        <Icon className="w-4 h-4 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-amber-950">
                          {obj.name}
                        </h4>
                        <span className="text-[10px] text-amber-700 font-mono font-bold">
                          获得节点: {obj.obtainedAt}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full border ${
                      isHighRisk
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      {isHighRisk ? '曝光极危' : '中度密级'}
                    </span>
                  </div>

                  <p className="text-xs text-amber-900 font-serif leading-relaxed">
                    {obj.description}
                  </p>

                  {obj.notes && (
                    <div className="text-[11px] text-orange-800 bg-orange-50 p-2.5 rounded-xl border border-orange-200 flex items-center gap-2 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-orange-600" />
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

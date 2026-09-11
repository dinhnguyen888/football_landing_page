import React from 'react';
import { CameraPresetName } from './DrawTypes';

interface DrawDebugPanelProps {
  onCameraPreset: (name: CameraPresetName) => void;
  onPlayAction: (actionName: string) => void;
  onToggleSpotlight: () => void;
  onResetScene: () => void;
}

export const DrawDebugPanel: React.FC<DrawDebugPanelProps> = ({
  onCameraPreset,
  onPlayAction,
  onToggleSpotlight,
  onResetScene,
}) => {
  return (
    <div className="fixed left-4 top-16 z-50 bg-slate-950/95 border-2 border-amber-500/60 p-4 rounded-2xl shadow-2xl text-white text-xs w-72 backdrop-blur-xl font-mono space-y-3 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-oswald text-sm font-black uppercase text-amber-400 flex items-center gap-1.5">
          <i className="fa-solid fa-bug"></i>
          KUJIKUJI 3D DEBUGGER
        </span>
        <span className="text-[10px] text-slate-500">?debugDraw=1</span>
      </div>

      {/* Camera Presets */}
      <div>
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
          Camera Presets:
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['wide', 'presenter', 'bowl', 'ball', 'card'] as CameraPresetName[]).map((cam) => (
            <button
              key={cam}
              type="button"
              onClick={() => onCameraPreset(cam)}
              className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold uppercase text-[10px] text-cyan-300"
            >
              Cam {cam}
            </button>
          ))}
        </div>
      </div>

      {/* Presenter Actions */}
      <div>
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
          Presenter Animation:
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Idle', val: 'Idle' },
            { label: 'Look Bowl', val: 'LookAtBowl' },
            { label: 'Reach Ball', val: 'ReachBall' },
            { label: 'Grab Ball', val: 'GrabBall' },
            { label: 'Open Ball', val: 'OpenBall' },
            { label: 'Show Card', val: 'ShowCard' },
          ].map((act) => (
            <button
              key={act.val}
              type="button"
              onClick={() => onPlayAction(act.val)}
              className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold uppercase text-[10px] text-amber-300"
            >
              {act.label}
            </button>
          ))}
        </div>
      </div>

      {/* Utility Actions */}
      <div className="pt-2 border-t border-slate-800 flex gap-2">
        <button
          type="button"
          onClick={onToggleSpotlight}
          className="flex-1 py-1.5 rounded bg-blue-600/60 hover:bg-blue-600 text-white font-bold text-[10px] uppercase"
        >
          Toggle Spot
        </button>
        <button
          type="button"
          onClick={onResetScene}
          className="flex-1 py-1.5 rounded bg-red-600/60 hover:bg-red-600 text-white font-bold text-[10px] uppercase"
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

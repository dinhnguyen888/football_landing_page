import React from 'react';
import { DrawTeam } from './DrawTypes';

interface BroadcastLowerThirdProps {
  team: DrawTeam | null;
  targetLabel: string | null;
  isVisible: boolean;
  presenterName?: string;
}

export const BroadcastLowerThird: React.FC<BroadcastLowerThirdProps> = ({
  team,
  targetLabel,
  isVisible,
  presenterName,
}) => {
  if (!isVisible || !team) return null;

  return (
    <div className="absolute bottom-16 inset-x-4 sm:inset-x-12 max-w-2xl mx-auto z-40 animate-in slide-in-from-bottom-8 fade-in duration-500 pointer-events-none">
      <div className="bg-gradient-to-r from-slate-950/95 via-blue-950/95 to-slate-950/95 border-y-2 border-amber-400 p-4 sm:p-5 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-xl flex items-center justify-between gap-4">
        {/* Crest & Team Details */}
        <div className="flex items-center space-x-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-oswald font-black text-2xl flex items-center justify-center shadow-lg border-2 border-amber-300 shrink-0">
            {team.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-oswald font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-400/40">
                OFFICIAL DRAW RESULT
              </span>
              <span className="text-xs font-oswald text-cyan-300 font-bold uppercase">
                SEED POT {team.pot}
              </span>
            </div>
            <h4 className="font-oswald text-xl sm:text-2xl font-black uppercase text-white tracking-wide truncate mt-0.5">
              {team.name}
            </h4>
            {team.club && (
              <p className="text-xs text-slate-300 truncate font-semibold">{team.club}</p>
            )}
            {presenterName && (
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-300/90 font-mono">
                <i className="fa-solid fa-microphone text-[10px] text-amber-400"></i>
                <span>Người bốc: <strong className="text-white font-semibold">{presenterName}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Group */}
        {targetLabel && (
          <div className="text-right shrink-0 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-cyan-500/40">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              VÀO BẢNG ĐẤU
            </span>
            <div className="font-oswald text-lg sm:text-xl font-black text-cyan-300">
              {targetLabel}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

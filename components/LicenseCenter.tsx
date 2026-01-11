
import React from 'react';
import { PlayerProfile, LicenseCategory } from '../types';
import { LICENSE_REQUIREMENTS } from '../constants';
// Import formatMoney from gameLogic service where it is defined
import { formatMoney } from '../services/gameLogic';

interface LicenseCenterProps {
  player: PlayerProfile;
  onUpgrade: (target: LicenseCategory) => void;
}

const LicenseCenter: React.FC<LicenseCenterProps> = ({ player, onUpgrade }) => {
  const categories = Object.values(LicenseCategory);
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black">License Certification Center</h2>
        <p className="text-slate-400">Upgrade your credentials to operate heavier vehicles and transport more valuable cargo.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {categories.map((cat, idx) => {
          const req = (LICENSE_REQUIREMENTS as any)[cat];
          const isOwned = player.license >= cat;
          const prevOwned = idx === 0 || player.license >= categories[idx-1];
          const canAfford = player.money >= req.cost;
          const levelMet = player.level >= req.minLevel;

          return (
            <div 
              key={cat} 
              className={`p-6 rounded-3xl border transition-all flex items-center justify-between ${
                isOwned 
                ? 'bg-blue-600/10 border-blue-500/30 shadow-lg shadow-blue-900/10' 
                : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex gap-6 items-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl border-2 ${
                  isOwned ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-600 border-slate-700'
                }`}>
                  {cat}
                </div>
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    Category {cat} Certification
                    {isOwned && (
                      <span className="text-[10px] px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full font-black uppercase tracking-tighter">Valid License</span>
                    )}
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Min Level</p>
                      <p className={`text-sm font-bold ${levelMet ? 'text-slate-200' : 'text-red-400'}`}>{req.minLevel}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Exam Cost</p>
                      <p className="text-sm font-bold text-emerald-400 mono">{req.cost === 0 ? 'FREE' : formatMoney(req.cost)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Status</p>
                      <p className="text-sm font-bold text-slate-400 italic">
                        {cat === 'B' ? 'Basic' : cat === 'C' ? 'Rigid Trucks' : cat === 'D' ? 'Heavy Articulated' : 'Specialized Hauling'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!isOwned && (
                <button
                  disabled={!prevOwned || !canAfford || !levelMet}
                  onClick={() => onUpgrade(cat)}
                  className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                    prevOwned && canAfford && levelMet
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/20 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Take Exam
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LicenseCenter;

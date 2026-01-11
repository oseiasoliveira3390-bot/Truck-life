
import React from 'react';
import { Job, LicenseCategory } from '../types';
import { getCityName, formatMoney } from '../services/gameLogic';

interface JobBoardProps {
  jobs: Job[];
  onAccept: (id: string) => void;
  activeJobId: string | null;
  license: LicenseCategory;
}

const JobBoard: React.FC<JobBoardProps> = ({ jobs, onAccept, activeJobId, license }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Freight Market</h2>
          <p className="text-slate-400">Available contracts for your current license level.</p>
        </div>
        <div className="flex gap-2">
          {Object.values(LicenseCategory).map(cat => (
            <span key={cat} className={`px-3 py-1 rounded text-xs font-bold ${license >= cat ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
              Cat {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500">
            No active jobs available. Please check back later.
          </div>
        ) : (
          jobs.map(job => {
            const isRestricted = license < job.requiredLicense;
            return (
              <div 
                key={job.id} 
                className={`group bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-blue-500/50 transition-all ${isRestricted ? 'opacity-60 grayscale' : ''}`}
              >
                <div className="flex gap-6 items-center">
                  <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none mb-1">{job.cargo}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">Cat {job.requiredLicense}</span>
                      <span>{job.weight / 1000} Tons</span>
                      <span className="text-slate-600">•</span>
                      <span>{job.distance.toFixed(0)} KM</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-center">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Route</p>
                    <p className="font-bold">{getCityName(job.from)} &rarr; {getCityName(job.to)}</p>
                  </div>
                  <div className="w-px h-10 bg-slate-800"></div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Payout</p>
                    <p className="text-emerald-400 font-black text-xl mono">{formatMoney(job.payout)}</p>
                  </div>
                </div>

                <button 
                  disabled={activeJobId !== null || isRestricted}
                  onClick={() => onAccept(job.id)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    activeJobId !== null 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : isRestricted 
                    ? 'bg-red-900/20 text-red-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {activeJobId === job.id ? 'ACTIVE' : isRestricted ? 'LOCKED' : 'ACCEPT'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobBoard;

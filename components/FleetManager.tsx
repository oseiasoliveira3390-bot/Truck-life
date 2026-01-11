
import React from 'react';
import { TruckInstance } from '../types';
import { getTruckModel } from '../services/gameLogic';

interface FleetManagerProps {
  trucks: TruckInstance[];
  currentTruckId: string | null;
  onSelect: (id: string) => void;
}

const FleetManager: React.FC<FleetManagerProps> = ({ trucks, currentTruckId, onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fleet Management</h2>
          <p className="text-slate-400">Monitor and maintain your personal logistics infrastructure.</p>
        </div>
        <p className="text-sm font-medium text-slate-500"><span className="text-blue-400 font-bold">{trucks.length}</span> Active Units</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trucks.length === 0 ? (
          <div className="col-span-full p-20 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500">
            You don't own any trucks yet.
          </div>
        ) : (
          trucks.map(truck => {
            const model = getTruckModel(truck.modelId);
            const isCurrent = currentTruckId === truck.id;
            
            return (
              <div 
                key={truck.id} 
                className={`group p-6 rounded-3xl border transition-all ${
                  isCurrent 
                  ? 'bg-blue-600/10 border-blue-500/40' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{model?.brand} {model?.model}</h3>
                      <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">{model?.year} • ID: {truck.id.toUpperCase()}</p>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest self-start">Active</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Condition</p>
                    <div className="flex items-center gap-2">
                       <span className="font-black mono text-slate-200">{truck.condition}%</span>
                       <div className="flex-1 h-1 bg-slate-700 rounded-full">
                          <div className={`h-full rounded-full ${truck.condition < 30 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${truck.condition}%` }}></div>
                       </div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Odometer</p>
                    <p className="font-black mono text-slate-200 text-lg">{truck.mileage.toLocaleString()} <span className="text-[10px] text-slate-500">KM</span></p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onSelect(truck.id)}
                    disabled={isCurrent}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      isCurrent 
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    Select Unit
                  </button>
                  <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all">
                    Maintenance
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FleetManager;

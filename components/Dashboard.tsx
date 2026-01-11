
import React from 'react';
import { GameState } from '../types';
import { getTruckModel, getCityName, formatMoney } from '../services/gameLogic';

interface DashboardProps {
  state: GameState;
  onStart: () => void;
  onFinish: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onStart, onFinish }) => {
  const { player, isDriving, drivingProgress, availableJobs, trucks } = state;
  const currentTruckInstance = trucks.find(t => t.id === player.currentTruckId);
  const truckModel = currentTruckInstance ? getTruckModel(currentTruckInstance.modelId) : null;
  const currentJob = availableJobs.find(j => j.id === player.activeJobId);

  if (!truckModel) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-slate-700">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 16v3M14 14.5a6.003 6.003 0 01-9.135-4.847L3 6m10 10.5a6.003 6.003 0 009.135-4.847L21 6M10 10.5a3.5 3.5 0 107 0 3.5 3.5 0 00-7 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold">No Truck Selected</h2>
          <p className="text-slate-400 mt-2">Visit the Truck Market to buy your first vehicle or select one from your fleet.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all transform hover:scale-105">
          Go to Market
        </button>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-rows-[1fr_auto] gap-6">
      {/* Driving Visualization / Map */}
      <div className="relative rounded-3xl bg-slate-900 overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #475569 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        {/* Sky & Environment (Simulated) */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${state.weather === 'sunny' ? 'bg-blue-900/10' : 'bg-slate-900'}`}></div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-12">
          {isDriving ? (
            <div className="w-full max-w-4xl space-y-12">
              <div className="text-center space-y-2">
                <p className="text-blue-400 font-bold tracking-widest uppercase text-sm">Now Driving</p>
                <h2 className="text-4xl font-black">{currentJob?.cargo || 'Cruising'}</h2>
                <p className="text-slate-400 text-lg">En route to <span className="text-slate-100 font-bold">{getCityName(currentJob?.to || '')}</span></p>
              </div>

              {/* Progress Bar Container */}
              <div className="relative h-24 flex items-center">
                <div className="absolute w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${drivingProgress * 100}%` }}></div>
                </div>
                {/* Truck Marker */}
                <div 
                  className="absolute transition-all duration-500 ease-linear"
                  style={{ left: `${drivingProgress * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-900/40 border-2 border-blue-400">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Telemetry Display */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Speed</p>
                  <p className="text-3xl font-bold mono">85 <span className="text-sm font-normal text-slate-500">km/h</span></p>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Distance Left</p>
                  <p className="text-3xl font-bold mono">{((currentJob?.distance || 0) * (1 - drivingProgress)).toFixed(1)} <span className="text-sm font-normal text-slate-500">km</span></p>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Fuel Consumption</p>
                  <p className="text-3xl font-bold mono">{truckModel.consumption} <span className="text-sm font-normal text-slate-500">L/100</span></p>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">ETA</p>
                  <p className="text-3xl font-bold mono">04:22</p>
                </div>
              </div>
              
              {drivingProgress >= 1 && (
                <div className="flex justify-center pt-8">
                  <button 
                    onClick={onFinish}
                    className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-emerald-900/20 transform hover:-translate-y-1 transition-all"
                  >
                    COMPLETE DELIVERY
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="inline-block p-4 rounded-3xl bg-slate-800 border-4 border-slate-700">
                 <svg className="w-20 h-20 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Truck Parked</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Ready to roll. {player.activeJobId ? "You have an active contract. Head out to the highway to begin delivery." : "Check the Job Board to find your next contract."}
              </p>
              {player.activeJobId && (
                <button 
                  onClick={onStart}
                  className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl shadow-2xl shadow-blue-900/40 transform hover:-translate-y-1 transition-all"
                >
                  START DELIVERY
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Truck Info Panel */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Condition</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-black mono">{currentTruckInstance?.condition}%</span>
              <div className="w-24 bg-slate-800 h-2 rounded-full mb-2">
                <div className={`h-full rounded-full ${currentTruckInstance!.condition < 30 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${currentTruckInstance?.condition}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Fuel Range</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-black mono">482 <span className="text-sm font-normal text-slate-500">km</span></span>
              <div className="w-24 bg-slate-800 h-2 rounded-full mb-2">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `75%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Odometer</p>
            <p className="text-2xl font-black mono">{currentTruckInstance?.mileage.toLocaleString()} <span className="text-sm font-normal text-slate-500">KM</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

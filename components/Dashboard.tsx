
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
  const activeJob = availableJobs.find(j => j.id === player.activeJobId) || 
                   // Fallback for when job is already accepted but not in availableJobs
                   (player.activeJobId ? { cargo: 'Current Cargo', to: 'Destination', payout: 0, distance: 0 } : null);

  if (!truckModel) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-slate-700 shadow-xl">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-100">No Active Truck</h2>
          <p className="text-slate-400 mt-2 max-w-xs">You need to purchase and select a vehicle from the Market or Fleet menu to begin your career.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Route Visualization */}
      <div className="relative h-48 lg:h-64 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-inner group">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {isDriving ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between items-end mb-2">
                <div className="text-left">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">En Route</p>
                  <p className="text-lg font-bold truncate">To {activeJob?.to ? getCityName(activeJob.to as string) : 'Destination'}</p>
                </div>
                <p className="text-2xl font-black italic text-slate-100 mono">{(drivingProgress * 100).toFixed(0)}%</p>
              </div>
              <div className="h-4 w-full bg-slate-800 rounded-full border border-slate-700 p-1">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  style={{ width: `${drivingProgress * 100}%` }}
                ></div>
              </div>
              {drivingProgress >= 1 ? (
                <button 
                  onClick={onFinish}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-900/40 active:scale-95 transition-all uppercase tracking-widest"
                >
                  Confirm Delivery
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-slate-500 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Engine Running • Transit Active</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {player.activeJobId ? (
              <div className="text-center space-y-4">
                <p className="text-slate-400 font-medium">Ready to depart with <span className="text-blue-400 font-bold">{activeJob?.cargo}</span></p>
                <button 
                  onClick={onStart}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/30 active:scale-95 transition-all uppercase tracking-widest"
                >
                  Start Ignition
                </button>
              </div>
            ) : (
              <div className="text-center px-6">
                <p className="text-slate-500 text-sm font-medium">No active contract. Visit the Job Board to find a payload.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Vehicle</p>
          <p className="text-sm font-black truncate">{truckModel.brand} {truckModel.model}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Fuel Economy</p>
          <p className="text-sm font-black mono text-blue-400">{truckModel.consumption} L/100km</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Net Worth</p>
          <p className="text-sm font-black mono text-emerald-400">{formatMoney(player.money)}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Reputation</p>
          <p className="text-sm font-black text-blue-400">{player.reputation}% Rank</p>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex-1">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Driver Logbook
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-black text-slate-100 mono">{player.history.deliveries}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Deliveries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-red-500 mono">{player.history.fines}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Fines</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-amber-500 mono">{player.history.accidents}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Accidents</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useState } from 'react';
import { TRUCK_MODELS } from '../constants';
import { Company } from '../types';
import { formatMoney } from '../services/gameLogic';

interface MarketProps {
  onBuy: (id: string, isUsed: boolean, financed?: boolean) => void;
  playerMoney: number;
  companies: Company[];
}

const Market: React.FC<MarketProps> = ({ onBuy, playerMoney, companies }) => {
  const [filter, setFilter] = useState<'all' | 'new' | 'used'>('all');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Commercial Dealership</h2>
          <p className="text-slate-400">Quality vehicles from top manufacturers and trusted company trade-ins.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['all', 'new', 'used'] as const).map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${filter === f ? 'bg-slate-800 text-slate-100 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {TRUCK_MODELS.map(truck => {
          const usedPrice = truck.basePrice * 0.65;
          const showNew = filter === 'all' || filter === 'new';
          const showUsed = filter === 'all' || filter === 'used';

          return (
            <div key={truck.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col">
              <div className="h-48 bg-slate-800 flex items-center justify-center relative">
                 <div className="absolute top-4 left-4 bg-slate-950/80 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20">
                   Category {truck.category}
                 </div>
                 <svg className="w-32 h-32 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" />
                </svg>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{truck.brand} {truck.model}</h3>
                    <p className="text-slate-500 text-sm">{truck.hp} HP • {truck.year} Edition</p>
                  </div>
                  <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-slate-400">CAPACITY: {(truck.capacity / 1000).toFixed(1)}T</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                  {showNew && (
                    <>
                    <button 
                      onClick={() => onBuy(truck.id, false)}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${playerMoney >= truck.basePrice ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10' : 'border-slate-800 bg-slate-950 opacity-50'}`}
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Buy New</span>
                      <span className="font-black text-emerald-400 mono">{formatMoney(truck.basePrice)}</span>
                    </button>
                    <button 
                      onClick={() => onBuy(truck.id, false, true)}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${playerMoney >= (truck.basePrice * 0.1) ? 'border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10' : 'border-slate-800 bg-slate-950 opacity-50'}`}
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Finance</span>
                      <span className="font-black text-blue-400 mono">{formatMoney(truck.basePrice * 0.1)} Down</span>
                    </button>
                    </>
                  )}
                  {showUsed && (
                    <button 
                      onClick={() => onBuy(truck.id, true)}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all col-span-full ${playerMoney >= usedPrice ? 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10' : 'border-slate-800 bg-slate-950 opacity-50'}`}
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Buy Used</span>
                      <span className="font-black text-amber-500 mono">{formatMoney(usedPrice)}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Market;

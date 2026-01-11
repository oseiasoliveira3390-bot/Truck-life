
import React from 'react';
import { Company } from '../types';
import { formatMoney } from '../services/gameLogic';

interface CompaniesInfoProps {
  companies: Company[];
}

const CompaniesInfo: React.FC<CompaniesInfoProps> = ({ companies }) => {
  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-bold">Global Competition</h2>
        <p className="text-slate-400">Track your rivals and the global logistics market leaders.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {companies.map(company => (
          <div key={company.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between hover:border-slate-700 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">{company.name}</h3>
                <div className="flex items-center gap-4 mt-1">
                   <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Strategy</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        company.strategy === 'aggressive' ? 'bg-red-500/20 text-red-400' :
                        company.strategy === 'balanced' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>{company.strategy}</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Reputation</span>
                      <span className="text-xs font-bold text-slate-300">{company.reputation}%</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex gap-12 items-center">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Est. Valuation</p>
                <p className="text-xl font-black text-slate-100 mono">{formatMoney(company.balance)}</p>
              </div>
              <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all">
                Trade Inquiry
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-blue-600/5 rounded-3xl border border-blue-500/20">
         <h4 className="text-blue-400 font-bold mb-2">Market Insight</h4>
         <p className="text-sm text-slate-400 leading-relaxed">
           Logistics market activity is up by 4.2% this quarter. AI companies are currently bidding aggressively on long-haul routes between <span className="text-slate-200">Berlin</span> and <span className="text-slate-200">Paris</span>. 
           Strategic consolidation is expected among medium-sized firms.
         </p>
      </div>
    </div>
  );
};

export default CompaniesInfo;

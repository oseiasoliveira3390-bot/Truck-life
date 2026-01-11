
import React from 'react';
import { PlayerProfile } from '../types';
import { formatMoney } from '../services/gameLogic';

interface BankProps {
  player: PlayerProfile;
  onTakeLoan: (amount: number, term: number) => void;
}

const Bank: React.FC<BankProps> = ({ player, onTakeLoan }) => {
  const totalDebt = player.loans.reduce((acc, loan) => acc + loan.remainingBalance, 0);
  const monthlyTotal = player.loans.reduce((acc, loan) => acc + loan.monthlyPayment, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Debt</p>
          <p className="text-3xl font-black text-red-400 mono">{formatMoney(totalDebt)}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Periodic Payments</p>
          <p className="text-3xl font-black text-amber-400 mono">{formatMoney(monthlyTotal)}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Credit Score</p>
          <p className="text-3xl font-black text-blue-400 mono">Excellent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Loans */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold px-2">Active Loans</h3>
          {player.loans.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
              No active liabilities.
            </div>
          ) : (
            player.loans.map(loan => (
              <div key={loan.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-200">Equipment Financing</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">ID: {loan.id.toUpperCase()}</p>
                  </div>
                  <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-blue-400">ACTIVE</span>
                </div>
                
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full" 
                    style={{ width: `${(1 - loan.remainingBalance / (loan.monthlyPayment * loan.termMonths)) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Remaining</p>
                    <p className="font-black mono text-slate-200">{formatMoney(loan.remainingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Installment</p>
                    <p className="font-black mono text-slate-200">{formatMoney(loan.monthlyPayment)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Loan Offers */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold px-2">Cash Loan Offers</h3>
          <div className="space-y-4">
            {[
              { amount: 50000, term: 12, rate: 0.08 },
              { amount: 100000, term: 24, rate: 0.10 },
              { amount: 250000, term: 48, rate: 0.12 }
            ].map((offer, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center justify-between hover:bg-slate-900 transition-all">
                <div>
                  <h4 className="text-2xl font-black text-slate-100 mono">{formatMoney(offer.amount)}</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase">{offer.term} Months @ {(offer.rate * 100).toFixed(0)}% APR</p>
                </div>
                <button 
                  onClick={() => onTakeLoan(offer.amount, offer.term)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                >
                  Accept Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bank;

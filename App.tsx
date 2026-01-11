
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, PlayerProfile, LicenseCategory, TruckInstance, Company, Loan } from './types';
import { INITIAL_PLAYER_MONEY, TRUCK_MODELS, CITIES } from './constants';
import { generateJob, calculateTripCosts, getTruckModel, formatMoney, createLoan } from './services/gameLogic';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import JobBoard from './components/JobBoard';
import Market from './components/Market';
import LicenseCenter from './components/LicenseCenter';
import FleetManager from './components/FleetManager';
import CompaniesInfo from './components/CompaniesInfo';
import Bank from './components/Bank';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      name: 'Driver 001',
      level: 1,
      xp: 0,
      reputation: 50,
      money: INITIAL_PLAYER_MONEY,
      license: LicenseCategory.B,
      history: { deliveries: 0, fines: 0, accidents: 0 },
      currentTruckId: null,
      activeJobId: null,
      inventoryTruckIds: [],
      loans: []
    },
    trucks: [],
    companies: [
      { id: 'trans-euro', name: 'TransEuro Logistics', balance: 1000000, reputation: 80, strategy: 'balanced', fleetIds: [] },
      { id: 'nordic-hauls', name: 'Nordic Hauls', balance: 2500000, reputation: 95, strategy: 'conservative', fleetIds: [] },
      { id: 'rapid-freight', name: 'Rapid Freight', balance: 500000, reputation: 40, strategy: 'aggressive', fleetIds: [] }
    ],
    availableJobs: [],
    currentTime: Date.now(),
    weather: 'sunny',
    isDriving: false,
    drivingProgress: 0,
    gameLog: ['Welcome to Truck Life Simulator!']
  });

  const [activeTab, setActiveTab] = useState<'dash' | 'jobs' | 'market' | 'licenses' | 'fleet' | 'companies' | 'bank'>('dash');

  // Haptic feedback utility
  const vibrate = (pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    const initialJobs = Array.from({ length: 10 }, () => generateJob(1));
    setGameState(prev => ({ ...prev, availableJobs: initialJobs }));
  }, []);

  const addLog = (msg: string) => {
    setGameState(prev => ({
      ...prev,
      gameLog: [msg, ...prev.gameLog].slice(0, 50)
    }));
  };

  const handleBuyTruck = (modelId: string, isUsed: boolean, financed: boolean = false) => {
    const model = TRUCK_MODELS.find(m => m.id === modelId);
    if (!model) return;
    const basePrice = isUsed ? model.basePrice * 0.6 : model.basePrice;
    
    const downPayment = financed ? basePrice * 0.1 : basePrice;
    if (gameState.player.money < downPayment) {
      vibrate([50, 50, 50]);
      addLog(`Not enough money for the ${formatMoney(downPayment)} down payment.`);
      return;
    }

    const newTruck: TruckInstance = {
      id: Math.random().toString(36).substr(2, 9),
      modelId,
      condition: isUsed ? 70 : 100,
      mileage: isUsed ? 150000 : 0,
      fuel: 100,
      ownerId: 'player',
      purchasePrice: basePrice
    };

    let newLoans = [...gameState.player.loans];
    if (financed) {
      const loanAmount = basePrice - downPayment;
      const loan = createLoan(loanAmount, 0.12, 24);
      newLoans.push(loan);
    }

    vibrate(20);
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        money: prev.player.money - downPayment,
        inventoryTruckIds: [...prev.player.inventoryTruckIds, newTruck.id],
        currentTruckId: prev.player.currentTruckId || newTruck.id,
        loans: newLoans
      },
      trucks: [...prev.trucks, newTruck]
    }));
    addLog(financed ? `Financed ${model.brand} ${model.model}!` : `Bought ${model.brand} ${model.model}!`);
  };

  const handleAcceptJob = (jobId: string) => {
    const job = gameState.availableJobs.find(j => j.id === jobId);
    if (!job || gameState.player.license < job.requiredLicense || !gameState.player.currentTruckId) {
      vibrate([30, 30]);
      return;
    }

    vibrate(15);
    setGameState(prev => ({
      ...prev,
      player: { ...prev.player, activeJobId: jobId },
      availableJobs: prev.availableJobs.filter(j => j.id !== jobId)
    }));
    addLog(`Accepted job: ${job.cargo} to ${job.to}.`);
    setActiveTab('dash');
  };

  const handleStartTrip = () => {
    if (!gameState.player.activeJobId || !gameState.player.currentTruckId) return;
    vibrate(50);
    setGameState(prev => ({ ...prev, isDriving: true, drivingProgress: 0 }));
  };

  const handleFinishTrip = () => {
    vibrate([20, 100, 20]);
    setGameState(prev => {
      const currentJob = prev.player.activeJobId ? (prev.availableJobs.find(j => j.id === prev.player.activeJobId) || 
        (gameState.availableJobs.find(j => j.id === prev.player.activeJobId))) : null;

      if (!currentJob) return { ...prev, isDriving: false, drivingProgress: 0 };

      const payout = currentJob.payout;
      const xpGain = currentJob.distance * 5;

      return {
        ...prev,
        isDriving: false,
        drivingProgress: 0,
        player: {
          ...prev.player,
          money: prev.player.money + payout,
          xp: prev.player.xp + xpGain,
          level: Math.floor((prev.player.xp + xpGain) / 1000) + 1,
          activeJobId: null,
          history: { ...prev.player.history, deliveries: prev.player.history.deliveries + 1 }
        },
        gameLog: [`Delivery complete! +${formatMoney(payout)}`, ...prev.gameLog]
      };
    });
  };

  const handleLicenseUpgrade = (target: LicenseCategory) => {
    if (gameState.player.money >= 5000) {
       vibrate([20, 50, 100]);
       setGameState(prev => ({
         ...prev,
         player: { ...prev.player, money: prev.player.money - 5000, license: target }
       }));
       addLog(`License upgraded to ${target}!`);
    } else {
      vibrate([50, 50]);
    }
  };

  useEffect(() => {
    if (!gameState.isDriving) return;
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.drivingProgress >= 1) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, drivingProgress: prev.drivingProgress + 0.05 };
      });
    }, 500);
    return () => clearInterval(interval);
  }, [gameState.isDriving]);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden select-none">
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => { vibrate(5); setActiveTab(tab); }} player={gameState.player} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 lg:gap-4">
            <h1 className="text-sm lg:text-xl font-bold tracking-tight text-blue-400">TRUCK LIFE</h1>
            <span className="hidden lg:block h-4 w-px bg-slate-700 mx-2"></span>
            <span className="text-[10px] lg:text-sm font-medium text-slate-400 uppercase tracking-widest">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="text-right">
              <p className="text-[8px] lg:text-xs text-slate-500 font-bold uppercase">Balance</p>
              <p className="text-xs lg:text-lg font-bold text-emerald-400 mono leading-none">{formatMoney(gameState.player.money)}</p>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[8px] lg:text-xs text-slate-500 font-bold uppercase">Reputation</p>
              <p className="text-xs lg:text-lg font-bold text-blue-400 mono leading-none">{gameState.player.reputation}%</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-3 lg:p-6 pb-20 lg:pb-6">
          {activeTab === 'dash' && <Dashboard state={gameState} onStart={handleStartTrip} onFinish={handleFinishTrip} />}
          {activeTab === 'jobs' && <JobBoard jobs={gameState.availableJobs} onAccept={handleAcceptJob} activeJobId={gameState.player.activeJobId} license={gameState.player.license} />}
          {activeTab === 'market' && <Market onBuy={handleBuyTruck} playerMoney={gameState.player.money} companies={gameState.companies} />}
          {activeTab === 'licenses' && <LicenseCenter player={gameState.player} onUpgrade={handleLicenseUpgrade} />}
          {activeTab === 'fleet' && <FleetManager trucks={gameState.trucks.filter(t => t.ownerId === 'player')} currentTruckId={gameState.player.currentTruckId} onSelect={(id) => { vibrate(10); setGameState(prev => ({ ...prev, player: { ...prev.player, currentTruckId: id } })); }} />}
          {activeTab === 'companies' && <CompaniesInfo companies={gameState.companies} />}
          {activeTab === 'bank' && <Bank player={gameState.player} onTakeLoan={(amt, term) => {
            vibrate(30);
            const loan = createLoan(amt, 0.08, term);
            setGameState(prev => ({ ...prev, player: { ...prev.player, money: prev.player.money + amt, loans: [...prev.player.loans, loan] }}));
            addLog(`Loan accepted: ${formatMoney(amt)}.`);
          }} />}
        </div>

        <footer className="h-10 border-t border-slate-800 bg-slate-900 flex items-center px-4 text-[10px] text-slate-400 mono shrink-0">
          <span className="mr-2 text-slate-500">[LOG]:</span> <span className="truncate">{gameState.gameLog[0]}</span>
        </footer>
      </main>
    </div>
  );
};

export default App;

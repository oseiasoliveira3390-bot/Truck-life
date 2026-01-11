
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

  // Initialization
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
    
    if (!financed && gameState.player.money < basePrice) {
      addLog(`Not enough money to buy ${model.brand} ${model.model}.`);
      return;
    }

    const downPayment = financed ? basePrice * 0.1 : basePrice;
    if (gameState.player.money < downPayment) {
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
      const loan = createLoan(loanAmount, 0.12, 24); // 12% annual, 24 months
      newLoans.push(loan);
      addLog(`Financed ${model.brand} with ${formatMoney(downPayment)} down. Loan: ${formatMoney(loanAmount)}.`);
    }

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
    
    if (!financed) {
      addLog(`Purchased ${model.brand} ${model.model} for ${formatMoney(basePrice)}.`);
    }
  };

  const handleAcceptJob = (jobId: string) => {
    const job = gameState.availableJobs.find(j => j.id === jobId);
    if (!job) return;

    if (gameState.player.license < job.requiredLicense) {
      addLog(`Your license (${gameState.player.license}) is insufficient for this job (${job.requiredLicense}).`);
      return;
    }

    if (!gameState.player.currentTruckId) {
      addLog(`You need a truck to accept a job.`);
      return;
    }

    setGameState(prev => ({
      ...prev,
      player: { ...prev.player, activeJobId: jobId },
      availableJobs: prev.availableJobs.filter(j => j.id !== jobId)
    }));
    addLog(`Accepted delivery of ${job.cargo} to ${job.to}. Distance: ${job.distance.toFixed(1)}km.`);
    setActiveTab('dash');
  };

  const handleStartTrip = () => {
    if (!gameState.player.activeJobId || !gameState.player.currentTruckId) return;
    setGameState(prev => ({ ...prev, isDriving: true, drivingProgress: 0 }));
  };

  const handleFinishTrip = () => {
    setGameState(prev => {
      const currentJob = prev.player.activeJobId ? (prev.availableJobs.find(j => j.id === prev.player.activeJobId) || 
        (gameState.availableJobs.find(j => j.id === prev.player.activeJobId))) : null;

      if (!currentJob) return { ...prev, isDriving: false, drivingProgress: 0 };

      let finalPayout = currentJob.payout;
      let finalXP = currentJob.distance * 5;
      
      const newMoney = prev.player.money + finalPayout;
      const newXp = prev.player.xp + finalXP;
      const newLevel = Math.floor(newXp / 1000) + 1;

      return {
        ...prev,
        isDriving: false,
        drivingProgress: 0,
        player: {
          ...prev.player,
          money: newMoney,
          xp: newXp,
          level: newLevel,
          activeJobId: null,
          history: { ...prev.player.history, deliveries: prev.player.history.deliveries + 1 }
        },
        gameLog: [`Successfully delivered ${currentJob.cargo}! Earned ${formatMoney(finalPayout)}`, ...prev.gameLog]
      };
    });
  };

  const handleLicenseUpgrade = (target: LicenseCategory) => {
    if (gameState.player.money >= 5000) {
       setGameState(prev => ({
         ...prev,
         player: { ...prev.player, money: prev.player.money - 5000, license: target }
       }));
       addLog(`License upgraded to ${target}!`);
    } else {
       addLog(`Not enough funds for ${target} license exam.`);
    }
  };

  // Process loan payments periodically (Simulating 1 "Month" every 5 minutes of real time or after each delivery)
  useEffect(() => {
    const loanInterval = setInterval(() => {
      setGameState(prev => {
        if (prev.player.loans.length === 0) return prev;
        
        let totalPayment = 0;
        const updatedLoans = prev.player.loans.map(loan => {
          if (loan.remainingBalance > 0) {
            totalPayment += loan.monthlyPayment;
            return {
              ...loan,
              remainingBalance: Math.max(0, loan.remainingBalance - loan.monthlyPayment),
              paidMonths: loan.paidMonths + 1
            };
          }
          return loan;
        }).filter(loan => loan.remainingBalance > 0);

        if (totalPayment > 0) {
          return {
            ...prev,
            player: {
              ...prev.player,
              money: prev.player.money - totalPayment,
              loans: updatedLoans
            },
            gameLog: [`Recurring loan payment of ${formatMoney(totalPayment)} deducted.`, ...prev.gameLog]
          };
        }
        return prev;
      });
    }, 120000); // Every 2 minutes for demo purposes

    return () => clearInterval(loanInterval);
  }, []);

  useEffect(() => {
    if (!gameState.isDriving) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.drivingProgress >= 1) {
          clearInterval(interval);
          return prev;
        }
        const speed = 0.05; 
        const nextProgress = prev.drivingProgress + speed;
        return { ...prev, drivingProgress: nextProgress >= 1 ? 1 : nextProgress };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [gameState.isDriving, gameState.player.activeJobId]);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} player={gameState.player} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight text-blue-400">TRUCK LIFE <span className="text-slate-100">SIMULATOR</span></h1>
            <div className="h-4 w-px bg-slate-700 mx-2"></div>
            <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">{activeTab}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-slate-500 font-bold uppercase">Balance</p>
              <p className="text-lg font-bold text-emerald-400 mono leading-none">{formatMoney(gameState.player.money)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-bold uppercase">Reputation</p>
              <p className="text-lg font-bold text-blue-400 mono leading-none">{gameState.player.reputation}%</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dash' && <Dashboard state={gameState} onStart={handleStartTrip} onFinish={handleFinishTrip} />}
          {activeTab === 'jobs' && <JobBoard jobs={gameState.availableJobs} onAccept={handleAcceptJob} activeJobId={gameState.player.activeJobId} license={gameState.player.license} />}
          {activeTab === 'market' && <Market onBuy={handleBuyTruck} playerMoney={gameState.player.money} companies={gameState.companies} />}
          {activeTab === 'licenses' && <LicenseCenter player={gameState.player} onUpgrade={handleLicenseUpgrade} />}
          {activeTab === 'fleet' && <FleetManager trucks={gameState.trucks.filter(t => t.ownerId === 'player')} currentTruckId={gameState.player.currentTruckId} onSelect={(id) => setGameState(prev => ({ ...prev, player: { ...prev.player, currentTruckId: id } }))} />}
          {activeTab === 'companies' && <CompaniesInfo companies={gameState.companies} />}
          {activeTab === 'bank' && <Bank player={gameState.player} onTakeLoan={(amt, term) => {
            const loan = createLoan(amt, 0.08, term);
            setGameState(prev => ({ ...prev, player: { ...prev.player, money: prev.player.money + amt, loans: [...prev.player.loans, loan] }}));
            addLog(`Took out a bank loan for ${formatMoney(amt)}.`);
          }} />}
        </div>

        <footer className="h-12 border-t border-slate-800 bg-slate-900 flex items-center px-6 text-xs text-slate-400 mono">
          <span className="mr-2 text-slate-500">[LOG]:</span> {gameState.gameLog[0]}
        </footer>
      </main>
    </div>
  );
};

export default App;

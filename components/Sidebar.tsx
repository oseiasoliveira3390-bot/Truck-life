
import React from 'react';
import { PlayerProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  player: PlayerProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, player }) => {
  const tabs = [
    { id: 'dash', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'jobs', label: 'Job Board', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'market', label: 'Truck Market', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'fleet', label: 'My Fleet', icon: 'M19 16v3M14 14.5a6.003 6.003 0 01-9.135-4.847L3 6m10 10.5a6.003 6.003 0 009.135-4.847L21 6M10 10.5a3.5 3.5 0 107 0 3.5 3.5 0 00-7 0z' },
    { id: 'bank', label: 'Bank & Loans', icon: 'M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5-10-5z' },
    { id: 'licenses', label: 'License Center', icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' },
    { id: 'companies', label: 'Competition', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg text-white">
            {player.name[0]}
          </div>
          <div>
            <p className="font-bold text-sm leading-tight truncate">{player.name}</p>
            <p className="text-xs text-blue-400 font-medium">Level {player.level}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500" 
              style={{ width: `${(player.xp % 1000) / 10}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex justify-between">
            <span>XP: {player.xp % 1000}/1000</span>
            <span className="text-slate-300">License: {player.license}</span>
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id 
              ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-6 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
        Truck Life v1.0.4 - Alpha Build
      </div>
    </aside>
  );
};

export default Sidebar;

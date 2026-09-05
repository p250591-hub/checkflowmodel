import React from 'react';
import { Layers, ShieldCheck, Activity, Terminal, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentTab: 'clearance' | 'overview' | 'admin';
  onTabChange: (tab: 'clearance' | 'overview' | 'admin') => void;
  activeRunsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  activeRunsCount
}) => {
  return (
    <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col flex-shrink-0 h-full select-none">
      {/* Brand Header */}
      <div className="p-7 pb-4">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center flex-shrink-0">
            <div className="w-3.5 h-3.5 border-2 border-white rotate-45 transition-transform hover:rotate-90 duration-300"></div>
          </div>
          <div>
            <span className="font-semibold tracking-tight text-base block text-[#1A1A1A] leading-tight">
              CLEARFLOW
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#999999] block font-mono">
              AGENT CLEARANCE v2.4
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#999999] mb-3 font-medium">
              Operations
            </p>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onTabChange('clearance')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                    currentTab === 'clearance'
                      ? 'text-black bg-[#F4F4F7]'
                      : 'text-[#666666] hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <div
                    className={`w-1 h-3.5 rounded-full ${
                      currentTab === 'clearance' ? 'bg-black' : 'bg-transparent'
                    }`}
                  />
                  <Layers className="w-4 h-4" />
                  <span>Student Clearance</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onTabChange('overview')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                    currentTab === 'overview'
                      ? 'text-black bg-[#F4F4F7]'
                      : 'text-[#666666] hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <div
                    className={`w-1 h-3.5 rounded-full ${
                      currentTab === 'overview' ? 'bg-black' : 'bg-transparent'
                    }`}
                  />
                  <Activity className="w-4 h-4" />
                  <span>Pipeline Architecture</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onTabChange('admin')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                    currentTab === 'admin'
                      ? 'text-black bg-[#F4F4F7]'
                      : 'text-[#666666] hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <div
                    className={`w-1 h-3.5 rounded-full ${
                      currentTab === 'admin' ? 'bg-black' : 'bg-transparent'
                    }`}
                  />
                  <Terminal className="w-4 h-4" />
                  <span className="flex-1">Audit Control Room</span>
                  {activeRunsCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black text-white">
                      {activeRunsCount}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#999999] mb-3 font-medium">
              Live Specialists
            </p>
            <ul className="space-y-2 text-xs font-mono">
              <li className="flex items-center justify-between text-[#666666] px-2.5 py-1">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Finance Agent
                </span>
                <span className="text-[10px] text-[#999999]">Bursar API</span>
              </li>
              <li className="flex items-center justify-between text-[#666666] px-2.5 py-1">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Library Agent
                </span>
                <span className="text-[10px] text-[#999999]">ILS Index</span>
              </li>
              <li className="flex items-center justify-between text-[#666666] px-2.5 py-1">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Dept Head Agent
                </span>
                <span className="text-[10px] text-[#999999]">Senate Record</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Speed Stat Box */}
      <div className="mx-6 p-3 bg-[#F4F4F7] rounded-lg border border-[#E5E5E5] mb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span className="text-[11px] font-medium text-[#1A1A1A]">Efficiency Differential</span>
        </div>
        <div className="flex justify-between text-[10px] text-[#666666] mb-1">
          <span>Physical Walk</span>
          <span className="font-mono line-through text-[#999999]">~3 Days</span>
        </div>
        <div className="flex justify-between text-[10px] text-[#1A1A1A] font-medium">
          <span>ClearFlow Parallel</span>
          <span className="font-mono text-emerald-700 bg-emerald-50 px-1 rounded">~1.4s</span>
        </div>
      </div>

      {/* Operator profile card at bottom */}
      <div className="mt-auto p-6 border-t border-[#E5E5E5]">
        <div className="flex items-center gap-3 bg-[#F4F4F7] p-2.5 rounded-lg border border-[#E5E5E5]">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs font-semibold">
            CF
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-[#1A1A1A] truncate">Registrar Dispatch</span>
            <span className="text-[10px] text-[#999999] truncate">Autonomous Node 01</span>
          </div>
          <ShieldCheck className="w-4 h-4 text-neutral-400 ml-auto flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
};

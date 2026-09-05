import React from 'react';
import { DepartmentAgentState } from '../types';
import { 
  Play, 
  RotateCw, 
  ShieldCheck, 
  CreditCard, 
  BookOpen, 
  GraduationCap, 
  Check, 
  X, 
  Clock, 
  Radio
} from 'lucide-react';

interface PipelineVisualizationProps {
  agents: DepartmentAgentState[];
  isEvaluating: boolean;
  onStartEvaluation: () => void;
  evaluationProgress: number;
  overallStatus: 'idle' | 'running' | 'completed';
  candidateName: string;
  candidateRoll: string;
  totalDurationMs?: number;
}

export const PipelineVisualization: React.FC<PipelineVisualizationProps> = ({
  agents,
  isEvaluating,
  onStartEvaluation,
  overallStatus,
  candidateName,
  candidateRoll,
  totalDurationMs,
}) => {
  const getIconForDept = (id: string) => {
    switch (id) {
      case 'finance':
        return <CreditCard className="w-4 h-4 text-[#1A1A1A]" />;
      case 'library':
        return <BookOpen className="w-4 h-4 text-[#1A1A1A]" />;
      case 'academic':
        return <GraduationCap className="w-4 h-4 text-[#1A1A1A]" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-[#1A1A1A]" />;
    }
  };

  const allApproved = agents.every((a) => a.status === 'approved');
  const hasRejections = agents.some((a) => a.status === 'rejected');

  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm p-6 mb-8">
      {/* Header with start action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5] mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
              2. Multi-Agent Evaluation Pipeline
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#F4F4F7] text-[#666666] border border-[#E5E5E5]">
              <Radio className={`w-3 h-3 ${isEvaluating ? 'text-emerald-600 animate-pulse' : 'text-neutral-400'}`} />
              {isEvaluating ? 'CONCURRENT FAN-OUT ACTIVE' : 'PARALLEL DISPATCH READY'}
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            The Orchestrator dispatches three specialized micro-agents simultaneously across university data stores.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onStartEvaluation}
            disabled={isEvaluating}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-md transition-all ${
              isEvaluating
                ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.99] shadow-sm'
            }`}
          >
            {isEvaluating ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating Agents...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Clearance Checks</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Pipeline Layout */}
      <div className="relative py-2">
        {/* Orchestrator Master Node */}
        <div className="max-w-md mx-auto mb-8">
          <div className={`p-4 rounded-lg border text-center transition-all ${
            isEvaluating 
              ? 'bg-[#FAFAFA] border-black shadow-sm ring-2 ring-black/5' 
              : 'bg-[#F4F4F7] border-[#E5E5E5]'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#999999]">
                MASTER DISPATCHER
              </span>
              <span className="text-[10px] font-mono text-[#666666]">
                Target: {candidateRoll}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center text-white text-[10px] font-mono">
                Ω
              </div>
              <h3 className="text-sm font-semibold text-[#1A1A1A]">
                ClearFlow Orchestrator Agent
              </h3>
            </div>
            <p className="text-[11px] text-[#666666]">
              {isEvaluating
                ? `Fanning out concurrent verification queries for ${candidateName}...`
                : overallStatus === 'completed'
                ? `Parallel evaluation completed in ${((totalDurationMs || 1400) / 1000).toFixed(2)}s`
                : 'Awaiting clearance dispatch trigger'}
            </p>
          </div>

          {/* Connection Lines to Specialist Agents */}
          <div className="flex justify-center items-center py-2 relative">
            <div className="w-px h-6 bg-[#D1D1D6]"></div>
          </div>
        </div>

        {/* 3 Parallel Specialist Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {agents.map((agent) => {
            const isApproved = agent.status === 'approved';
            const isRejected = agent.status === 'rejected';
            const isChecking = agent.status === 'checking';

            return (
              <div
                key={agent.id}
                className={`rounded-lg border p-4.5 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isChecking
                    ? 'border-black bg-white ring-1 ring-black/10 shadow-sm'
                    : isApproved
                    ? 'border-emerald-200 bg-[#FAFCF9]'
                    : isRejected
                    ? 'border-rose-200 bg-[#FCF9F9]'
                    : 'border-[#E5E5E5] bg-white'
                }`}
              >
                {/* Micro Progress Line at Top of Card */}
                {isChecking && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#F4F4F7] overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-300"
                      style={{ width: `${agent.progressPercent}%` }}
                    />
                  </div>
                )}

                <div>
                  {/* Agent Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-[#F4F4F7] border border-[#E5E5E5] flex items-center justify-center">
                        {getIconForDept(agent.id)}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#1A1A1A] leading-tight">
                          {agent.name}
                        </h4>
                        <span className="text-[10px] text-[#999999] block font-mono">
                          {agent.office}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isChecking && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 text-neutral-800 border border-neutral-300">
                          <RotateCw className="w-2.5 h-2.5 animate-spin" />
                          <span>Auditing</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Approved</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                          <X className="w-3 h-3 text-rose-600" />
                          <span>Hold Flagged</span>
                        </span>
                      )}
                      {agent.status === 'idle' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-[#F4F4F7] text-[#666666] border border-[#E5E5E5]">
                          Standby
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Finding / Reason Box */}
                  <div className="bg-[#F8F8FA] rounded p-3 border border-[#EAEAEA] mb-3 min-h-[56px] flex flex-col justify-center">
                    {agent.status === 'idle' ? (
                      <p className="text-[11px] text-[#999999] italic">
                        Awaiting dispatch command to inspect record ledger...
                      </p>
                    ) : isChecking ? (
                      <p className="text-[11px] text-[#666666] font-mono animate-pulse">
                        &gt; Querying encrypted institutional database...
                      </p>
                    ) : (
                      <p className={`text-[11px] leading-relaxed ${
                        isApproved ? 'text-emerald-950 font-normal' : 'text-rose-950 font-normal'
                      }`}>
                        {agent.reason}
                      </p>
                    )}
                  </div>

                  {/* Micro Logs Terminal */}
                  <div className="bg-black text-[#A0A0A0] font-mono text-[10px] rounded p-2.5 leading-tight space-y-1 overflow-hidden h-20 flex flex-col justify-end">
                    {agent.logs.slice(-3).map((log, idx) => (
                      <div key={idx} className="truncate">
                        <span className="text-neutral-500 mr-1.5">&gt;</span>
                        <span className={idx === agent.logs.slice(-3).length - 1 ? 'text-white' : ''}>
                          {log}
                        </span>
                      </div>
                    ))}
                    {agent.logs.length === 0 && (
                      <div className="text-neutral-600 italic">No operational logs recorded.</div>
                    )}
                  </div>
                </div>

                {/* Footer Metric */}
                <div className="mt-3 pt-2.5 border-t border-[#EAEAEA] flex items-center justify-between text-[10px] text-[#666666] font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#999999]" />
                    {agent.status === 'idle' ? '--' : `${agent.durationMs}ms`}
                  </span>
                  <span>Authority: Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aggregate Status Banner */}
      {overallStatus === 'completed' && (
        <div className={`mt-6 p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          allApproved 
            ? 'bg-emerald-50/70 border-emerald-200' 
            : 'bg-neutral-50 border-neutral-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              allApproved ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-white'
            }`}>
              {allApproved ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1A1A1A]">
                {allApproved
                  ? 'All Department Clearances Verified — Certificate Ready'
                  : 'Action Required On Flagged Departments'}
              </h4>
              <p className="text-[11px] text-[#666666]">
                {allApproved
                  ? `Clearance resolved concurrently in ${((totalDurationMs || 1400) / 1000).toFixed(2)}s across all 3 nodes.`
                  : 'Resolve specific holds below and re-run targeted agent checks without restarting the full workflow.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-[#666666] self-end sm:self-auto">
            <span>Result:</span>
            <span className={`px-2 py-0.5 rounded font-semibold ${
              allApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {allApproved ? 'PASSED (3/3)' : `${agents.filter(a => a.status === 'approved').length}/3 APPROVED`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

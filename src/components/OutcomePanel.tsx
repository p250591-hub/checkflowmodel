import React from 'react';
import { DepartmentAgentState, Student, DepartmentId } from '../types';
import { 
  Award, 
  ArrowRight, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface OutcomePanelProps {
  student: Student;
  agents: DepartmentAgentState[];
  onResolveAndRetry: (deptId: DepartmentId) => void;
  onOpenCertificate: () => void;
  retryingDeptId: DepartmentId | null;
}

export const OutcomePanel: React.FC<OutcomePanelProps> = ({
  student,
  agents,
  onResolveAndRetry,
  onOpenCertificate,
  retryingDeptId,
}) => {
  const rejectedAgents = agents.filter((a) => a.status === 'rejected');
  const allApproved = agents.every((a) => a.status === 'approved');

  if (agents.some((a) => a.status === 'idle' || a.status === 'checking')) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] mb-5">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
            3. Final Clearance Resolution & Outcomes
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Targeted single-office resolution loops prevent restarting multi-day clearance chains.
          </p>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider text-[#999999]">
          Clearance ID: CF-{student.rollNumber.replace(/[^a-zA-Z0-9]/g, '')}
        </span>
      </div>

      {allApproved ? (
        /* Happy Path / Fully Cleared View */
        <div className="bg-[#F8F9FA] rounded-xl border border-[#E5E5E5] p-6 text-center">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Award className="w-6 h-6" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            UNCONDITIONAL GRADUATION CLEARANCE ISSUED
          </span>

          <h3 className="text-xl font-light tracking-tight text-[#1A1A1A] mb-1">
            Congratulations, {student.name}!
          </h3>
          <p className="text-xs text-[#666666] max-w-md mx-auto mb-6">
            All three academic divisions (Finance, Library, and Academic Senate) have signed off electronically.
            Your tamper-evident digital certificate has been issued.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenCertificate}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-medium rounded-md hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>View & Download Certificate (PDF / QR)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Holds & Action Required View */
        <div>
          <div className="mb-4 flex items-center gap-2 text-xs text-rose-900 bg-rose-50 border border-rose-200 p-3 rounded-lg font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>
              {rejectedAgents.length} {rejectedAgents.length === 1 ? 'department has' : 'departments have'} flagged
              an active hold. Use the targeted resolution buttons below to clear the mock hold and re-run only that agent.
            </span>
          </div>

          <div className="space-y-4">
            {rejectedAgents.map((agent) => {
              const holdDetail = student.holds[agent.id];
              const isRetrying = retryingDeptId === agent.id;

              return (
                <div
                  key={agent.id}
                  className="p-5 rounded-lg border border-[#E5E5E5] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-neutral-400"
                >
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-[#1A1A1A]">
                        {agent.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                        Active Hold Flagged
                      </span>
                      {holdDetail.resolutionCost && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F4F7] text-[#666666] border border-[#E5E5E5]">
                          Cost: {holdDetail.resolutionCost}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#666666] mb-2 leading-relaxed">
                      {agent.reason}
                    </p>

                    <div className="text-[11px] text-[#1A1A1A] font-medium flex items-center gap-1">
                      <span className="text-[#999999]">Required Action:</span>
                      <span>{holdDetail.resolutionActionDesc}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={() => onResolveAndRetry(agent.id)}
                      disabled={isRetrying}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium bg-black text-white rounded-md hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-sm"
                    >
                      {isRetrying ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Auditing & Retrying...</span>
                        </>
                      ) : (
                        <>
                          <span>Resolve & Retry Check</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

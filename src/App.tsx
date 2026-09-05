import React, { useState, useEffect } from 'react';
import { Student, DepartmentAgentState, DepartmentId, ClearanceRunRecord } from './types';
import { 
  getStoredStudents, 
  saveStoredStudents, 
  resetStoredStudents,
  getStudentScenarioTag,
  getStudentDescription
} from './lib/mock-data';
import { getRunLogs, addRunLog, clearRunLogs } from './lib/run-log';
import { playClearanceChime } from './lib/chime';
import { generateClearanceId } from './lib/crypto';
import { Sidebar } from './components/Sidebar';
import { StudentPicker } from './components/StudentPicker';
import { PipelineVisualization } from './components/PipelineVisualization';
import { OutcomePanel } from './components/OutcomePanel';
import { CertificateModal } from './components/CertificateModal';
import { AdminControlRoom } from './components/AdminControlRoom';
import { LandingPipelinePreview } from './components/LandingPipelinePreview';
import { ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentTab, setCurrentTab] = useState<'clearance' | 'overview' | 'admin'>('clearance');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [evaluationProgress, setEvaluationProgress] = useState<number>(0);
  const [totalDurationMs, setTotalDurationMs] = useState<number>(1420);
  const [runLogs, setRunLogs] = useState<ClearanceRunRecord[]>([]);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [retryingDeptId, setRetryingDeptId] = useState<DepartmentId | null>(null);
  const [currentClearanceId, setCurrentClearanceId] = useState<string>('CF-BSCS21014-8842');

  const [agents, setAgents] = useState<DepartmentAgentState[]>([
    {
      id: 'finance',
      name: 'Finance & Bursar Agent',
      role: 'Fiscal Auditing',
      office: 'Office of the Bursar',
      status: 'idle',
      reason: null,
      durationMs: 0,
      progressPercent: 0,
      logs: ['Standby for dispatch payload.'],
    },
    {
      id: 'library',
      name: 'Circulation Library Agent',
      role: 'Resource & Inventory',
      office: 'Central University Library',
      status: 'idle',
      reason: null,
      durationMs: 0,
      progressPercent: 0,
      logs: ['ILS catalog link synchronized.'],
    },
    {
      id: 'academic',
      name: 'Department Head Agent',
      role: 'Curricular Verification',
      office: 'Academic Senate & Dept Chair',
      status: 'idle',
      reason: null,
      durationMs: 0,
      progressPercent: 0,
      logs: ['Thesis & credit ledger connected.'],
    },
  ]);

  // Initialize students and logs
  useEffect(() => {
    const loadedStudents = getStoredStudents();
    setStudents(loadedStudents);
    if (loadedStudents.length > 0) {
      setSelectedStudent(loadedStudents[0]);
      setCurrentClearanceId(generateClearanceId(loadedStudents[0].rollNumber));
    }
    setRunLogs(getRunLogs());
  }, []);

  // When candidate selection changes, reset agent statuses to idle
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentClearanceId(generateClearanceId(student.rollNumber));
    setOverallStatus('idle');
    setAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        status: 'idle',
        reason: null,
        durationMs: 0,
        progressPercent: 0,
        logs: [`Target candidate updated to ${student.rollNumber}. Ready for dispatch.`],
      }))
    );
  };

  // Reset all student data back to clean seed definitions
  const handleResetAllData = () => {
    const fresh = resetStoredStudents();
    setStudents(fresh);
    if (fresh.length > 0) {
      setSelectedStudent(fresh[0]);
      setCurrentClearanceId(generateClearanceId(fresh[0].rollNumber));
    }
    setOverallStatus('idle');
    setAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        status: 'idle',
        reason: null,
        durationMs: 0,
        progressPercent: 0,
        logs: ['Persona data re-seeded to factory definitions.'],
      }))
    );
  };

  // Start concurrent parallel evaluation across all three specialist agents
  const handleStartEvaluation = () => {
    if (!selectedStudent || isEvaluating) return;

    setIsEvaluating(true);
    setOverallStatus('running');
    setEvaluationProgress(10);

    const startTime = performance.now();

    // Set agents to checking state
    setAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        status: 'checking',
        progressPercent: 15,
        logs: [
          ...agent.logs,
          `[0.0s] Handshake accepted from Orchestrator.`,
          `[0.1s] Querying encrypted institutional database...`,
        ],
      }))
    );

    // Staggered simulation of parallel evaluation completion
    // Agent 1: Finance (approx 650ms)
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id !== 'finance') return agent;
          const hold = selectedStudent.holds.finance;
          return {
            ...agent,
            status: hold.hasHold ? 'rejected' : 'approved',
            reason: hold.reason,
            durationMs: 640,
            progressPercent: 100,
            logs: [
              ...agent.logs,
              `[0.4s] Auditing semester ledger and convocation charges...`,
              hold.hasHold
                ? `[0.6s] ⚠ Outstanding liability detected.`
                : `[0.6s] ✓ Zero unpaid balance confirmed.`,
            ],
          };
        })
      );
      setEvaluationProgress((prev) => Math.min(prev + 30, 90));
    }, 650);

    // Agent 2: Library (approx 950ms)
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id !== 'library') return agent;
          const hold = selectedStudent.holds.library;
          return {
            ...agent,
            status: hold.hasHold ? 'rejected' : 'approved',
            reason: hold.reason,
            durationMs: 920,
            progressPercent: 100,
            logs: [
              ...agent.logs,
              `[0.5s] Querying ILS RFID circulation inventory...`,
              hold.hasHold
                ? `[0.9s] ⚠ Overdue checked-out catalogued items flagged.`
                : `[0.9s] ✓ No borrowed items on record.`,
            ],
          };
        })
      );
      setEvaluationProgress((prev) => Math.min(prev + 30, 90));
    }, 950);

    // Agent 3: Academic / Dept Head (approx 1350ms)
    setTimeout(() => {
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);
      setTotalDurationMs(elapsed);

      setAgents((prev) => {
        const updated = prev.map((agent) => {
          if (agent.id !== 'academic') return agent;
          const hold = selectedStudent.holds.academic;
          return {
            ...agent,
            status: hold.hasHold ? 'rejected' : 'approved',
            reason: hold.reason,
            durationMs: 1280,
            progressPercent: 100,
            logs: [
              ...agent.logs,
              `[0.7s] Cross-referencing credit hours and capstone defense...`,
              hold.hasHold
                ? `[1.3s] ⚠ Advisor sign-off missing from archive.`
                : `[1.3s] ✓ All 132 credits and defense approved.`,
            ],
          };
        });

        const allPass = updated.every((a) => a.status === 'approved');

        if (allPass) {
          playClearanceChime();

          // Dynamically synchronize student scenarioTag and description to Happy Path
          setStudents((prev) => {
            const refreshed = prev.map((s) => {
              if (s.id === selectedStudent.id) {
                return {
                  ...s,
                  scenarioTag: getStudentScenarioTag(s),
                  description: getStudentDescription(s),
                };
              }
              return s;
            });
            saveStoredStudents(refreshed);
            return refreshed;
          });

          setSelectedStudent((prev) =>
            prev
              ? {
                  ...prev,
                  scenarioTag: getStudentScenarioTag(prev),
                  description: getStudentDescription(prev),
                }
              : prev
          );
        }

        // Record audit run in storage
        const newRunRecord: ClearanceRunRecord = {
          id: currentClearanceId,
          timestamp: 'Just now',
          studentId: selectedStudent.id,
          studentName: selectedStudent.name,
          rollNumber: selectedStudent.rollNumber,
          department: selectedStudent.department,
          outcome: allPass ? 'Passed' : 'Action Required',
          totalDurationSeconds: parseFloat((elapsed / 1000).toFixed(2)),
          financeStatus: updated.find((a) => a.id === 'finance')?.status || 'approved',
          libraryStatus: updated.find((a) => a.id === 'library')?.status || 'approved',
          academicStatus: updated.find((a) => a.id === 'academic')?.status || 'approved',
          note: allPass
            ? 'All 3 divisions verified concurrently.'
            : 'One or more divisional holds flagged.',
        };

        const updatedLogs = addRunLog(newRunRecord);
        setRunLogs(updatedLogs);

        return updated;
      });

      setEvaluationProgress(100);
      setIsEvaluating(false);
      setOverallStatus('completed');
    }, 1350);
  };

  // Targeted single-agent "Resolve & Retry"
  const handleResolveAndRetry = (deptId: DepartmentId) => {
    if (!selectedStudent) return;

    setRetryingDeptId(deptId);

    // 1. Update in-memory and persisted student hold status
    const newHolds = {
      ...selectedStudent.holds,
      [deptId]: {
        ...selectedStudent.holds[deptId],
        hasHold: false,
        reason: `Resolved on-demand: ${selectedStudent.holds[deptId].resolutionActionTitle} completed. All obligations cleared.`,
      },
    };

    const tempCandidate: Student = {
      ...selectedStudent,
      holds: newHolds,
    };

    const updatedStudent: Student = {
      ...tempCandidate,
      scenarioTag: getStudentScenarioTag(tempCandidate),
      description: getStudentDescription(tempCandidate),
    };

    const updatedStudentsList = students.map((s) =>
      s.id === selectedStudent.id ? updatedStudent : s
    );

    setStudents(updatedStudentsList);
    setSelectedStudent(updatedStudent);
    saveStoredStudents(updatedStudentsList);

    // 2. Animate re-evaluation of just this one specialist agent
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === deptId
          ? {
              ...agent,
              status: 'checking',
              progressPercent: 40,
              logs: [
                ...agent.logs,
                `[Re-Audit] Targeted check triggered by student.`,
                `[Re-Audit] Verifying updated settlement proof...`,
              ],
            }
          : agent
      )
    );

    setTimeout(() => {
      setAgents((prev) => {
        const updated = prev.map((agent) => {
          if (agent.id !== deptId) return agent;
          return {
            ...agent,
            status: 'approved',
            reason: `Hold cleared. Targeted re-audit approved by ${agent.office}.`,
            durationMs: 460,
            progressPercent: 100,
            logs: [
              ...agent.logs,
              `[Re-Audit] Settlement acknowledged in record store.`,
              `[Re-Audit] ✓ Official sign-off issued.`,
            ],
          };
        });

        const allApprovedNow = updated.every((a) => a.status === 'approved');

        if (allApprovedNow) {
          playClearanceChime();

          const retryLog: ClearanceRunRecord = {
            id: currentClearanceId,
            timestamp: 'Just now (Retry)',
            studentId: selectedStudent.id,
            studentName: selectedStudent.name,
            rollNumber: selectedStudent.rollNumber,
            department: selectedStudent.department,
            outcome: 'Passed',
            totalDurationSeconds: 0.46,
            financeStatus: 'approved',
            libraryStatus: 'approved',
            academicStatus: 'approved',
            note: `Targeted resolution succeeded for ${deptId}. Certificate unlocked.`,
          };
          setRunLogs(addRunLog(retryLog));
        }

        return updated;
      });

      setRetryingDeptId(null);
    }, 700);
  };

  const handleClearRunLogs = () => {
    clearRunLogs();
    setRunLogs([]);
  };

  const totalRuns = runLogs.length;
  const passedRuns = runLogs.filter((r) => r.outcome === 'Passed').length;
  const passRate = totalRuns > 0 ? ((passedRuns / totalRuns) * 100).toFixed(1) : '98.4';

  return (
    <div className="flex h-screen w-screen bg-[#F4F4F7] font-sans text-[#1A1A1A] overflow-hidden select-text">
      {/* Minimalist Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        activeRunsCount={runLogs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-10">
        {/* Top Header matching Clean Minimalism */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-tight mb-1.5 text-[#1A1A1A]">
              {currentTab === 'clearance' && 'Clearance Operations Hub'}
              {currentTab === 'overview' && 'Parallel Architecture Overview'}
              {currentTab === 'admin' && 'Audit Control Room & History'}
            </h1>
            <p className="text-xs md:text-sm text-[#666666]">
              {currentTab === 'clearance' &&
                'Autonomous multi-agent verification engine resolving university degree clearance in seconds.'}
              {currentTab === 'overview' &&
                'Comparing physical queue delays with ClearFlow concurrent specialist agent orchestration.'}
              {currentTab === 'admin' &&
                'Real-time tamper-evident logs and operational metrics of all clearance requests.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-shrink-0">
            {currentTab === 'clearance' && (
              <>
                <button
                  onClick={() => setCurrentTab('admin')}
                  className="px-3.5 py-2 text-xs font-medium border border-[#E5E5E5] bg-white rounded-md hover:bg-neutral-50 text-[#1A1A1A] transition-colors shadow-sm"
                >
                  View Run Logs
                </button>
                <button
                  onClick={handleStartEvaluation}
                  disabled={isEvaluating}
                  className="px-4 py-2 text-xs font-medium bg-black text-white rounded-md hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3 h-3 ${isEvaluating ? 'animate-spin' : ''}`} />
                  <span>{isEvaluating ? 'Auditing...' : 'Evaluate Clearance'}</span>
                </button>
              </>
            )}

            {currentTab === 'overview' && (
              <button
                onClick={() => setCurrentTab('clearance')}
                className="px-4 py-2 text-xs font-medium bg-black text-white rounded-md hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Launch Candidate Evaluation
              </button>
            )}

            {currentTab === 'admin' && (
              <button
                onClick={() => setCurrentTab('clearance')}
                className="px-4 py-2 text-xs font-medium bg-black text-white rounded-md hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Back to Clearance Hub
              </button>
            )}
          </div>
        </header>

        {/* Tab 1: Primary Clearance Workflow */}
        {currentTab === 'clearance' && selectedStudent && (
          <div>
            {/* 3 Metric Cards matching Clean Minimalism */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-[#999999] mb-2 font-medium">
                  Process Success Rate
                </p>
                <h2 className="text-4xl font-light text-[#1A1A1A]">
                  {passRate}
                  <span className="text-lg text-[#999999]">%</span>
                </h2>
                <div className="mt-4 h-1 w-full bg-[#F4F4F7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all"
                    style={{ width: `${Math.min(parseFloat(passRate), 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-[#999999] mb-2 font-medium">
                  Autonomous Specialist Agents
                </p>
                <h2 className="text-4xl font-light text-[#1A1A1A]">3 Active</h2>
                <p className="text-[10px] text-emerald-700 font-medium mt-4">
                  Finance • Library • Academic Senate
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-[#999999] mb-2 font-medium">
                  Concurrent Resolution Time
                </p>
                <h2 className="text-4xl font-light text-[#1A1A1A]">
                  {(totalDurationMs / 1000).toFixed(2)}
                  <span className="text-lg text-[#999999]">s</span>
                </h2>
                <p className="text-[10px] text-[#999999] mt-4 font-mono">
                  Manual baseline: ~3.2 business days
                </p>
              </div>
            </section>

            {/* Step 1: Candidate Picker */}
            <StudentPicker
              students={students}
              selectedStudent={selectedStudent}
              onSelectStudent={handleSelectStudent}
              onResetAll={handleResetAllData}
              isEvaluating={isEvaluating}
            />

            {/* Step 2: Parallel Multi-Agent Pipeline */}
            <PipelineVisualization
              agents={agents}
              isEvaluating={isEvaluating}
              onStartEvaluation={handleStartEvaluation}
              evaluationProgress={evaluationProgress}
              overallStatus={overallStatus}
              candidateName={selectedStudent.name}
              candidateRoll={selectedStudent.rollNumber}
              totalDurationMs={totalDurationMs}
            />

            {/* Step 3: Resolution & Certificate Actions */}
            <OutcomePanel
              student={selectedStudent}
              agents={agents}
              onResolveAndRetry={handleResolveAndRetry}
              onOpenCertificate={() => setIsCertificateOpen(true)}
              retryingDeptId={retryingDeptId}
            />
          </div>
        )}

        {/* Tab 2: Architecture & Pitch Overview */}
        {currentTab === 'overview' && (
          <LandingPipelinePreview
            onStartRealFlow={() => setCurrentTab('clearance')}
          />
        )}

        {/* Tab 3: Admin Control Room */}
        {currentTab === 'admin' && (
          <AdminControlRoom
            runLogs={runLogs}
            onClearLogs={handleClearRunLogs}
          />
        )}
      </main>

      {/* Official Certificate Modal */}
      {selectedStudent && (
        <CertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          student={selectedStudent}
          clearanceId={currentClearanceId}
        />
      )}
    </div>
  );
}

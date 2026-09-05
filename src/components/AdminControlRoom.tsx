import React, { useState } from 'react';
import { ClearanceRunRecord } from '../types';
import { 
  Download, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileSpreadsheet
} from 'lucide-react';

interface AdminControlRoomProps {
  runLogs: ClearanceRunRecord[];
  onClearLogs: () => void;
  onSelectCandidateFromLog?: (studentId: string) => void;
}

export const AdminControlRoom: React.FC<AdminControlRoomProps> = ({
  runLogs,
  onClearLogs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOutcome, setFilterOutcome] = useState<'all' | 'Passed' | 'Action Required'>('all');

  const filteredLogs = runLogs.filter((log) => {
    const matchesSearch =
      log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterOutcome === 'all' || log.outcome === filterOutcome;

    return matchesSearch && matchesFilter;
  });

  const totalRuns = runLogs.length;
  const passedRuns = runLogs.filter((r) => r.outcome === 'Passed').length;
  const passRate = totalRuns > 0 ? ((passedRuns / totalRuns) * 100).toFixed(1) : '0';
  const avgDuration =
    totalRuns > 0
      ? (runLogs.reduce((acc, r) => acc + r.totalDurationSeconds, 0) / totalRuns).toFixed(2)
      : '0.00';

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(runLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ClearFlow_Audit_Log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* 3 Metrics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-[#999999] mb-2 font-medium">
            Clearance Pass Rate
          </p>
          <h2 className="text-4xl font-light text-[#1A1A1A]">
            {passRate}
            <span className="text-lg text-[#999999]">%</span>
          </h2>
          <div className="mt-4 h-1 w-full bg-[#F4F4F7] rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all"
              style={{ width: `${passRate}%` }}
            />
          </div>
          <p className="text-[10px] text-[#666666] mt-2">
            {passedRuns} of {totalRuns} candidates cleared autonomously
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-[#999999] mb-2 font-medium">
            Total Audits Logged
          </p>
          <h2 className="text-4xl font-light text-[#1A1A1A]">{totalRuns}</h2>
          <p className="text-[10px] text-emerald-700 font-medium mt-4">
            Zero physical queues formed
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-[#999999] mb-2 font-medium">
            Avg Clearance Duration
          </p>
          <h2 className="text-4xl font-light text-[#1A1A1A]">
            {avgDuration}
            <span className="text-lg text-[#999999]">s</span>
          </h2>
          <p className="text-[10px] text-[#999999] mt-4 font-mono">
            Down from ~3.2 business days
          </p>
        </div>
      </section>

      {/* Control Room Table Card */}
      <section className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm flex flex-col overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-[#E5E5E5] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
              Operational Clearance Run Log
            </h3>
            <span className="text-[10px] text-[#999999]">
              Persisted audit record • Showing {filteredLogs.length} entries
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search roll, name, ID..."
                className="pl-8 pr-3 py-1.5 text-xs bg-[#F4F4F7] border border-[#E5E5E5] rounded-md focus:outline-none focus:border-black text-[#1A1A1A] w-48"
              />
            </div>

            {/* Filter */}
            <select
              value={filterOutcome}
              onChange={(e) => setFilterOutcome(e.target.value as 'all' | 'Passed' | 'Action Required')}
              className="px-2.5 py-1.5 text-xs bg-[#F4F4F7] border border-[#E5E5E5] rounded-md text-[#1A1A1A] focus:outline-none focus:border-black font-medium"
            >
              <option value="all">All Outcomes</option>
              <option value="Passed">Passed Only</option>
              <option value="Action Required">Action Required</option>
            </select>

            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#E5E5E5] bg-white rounded-md hover:bg-neutral-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            {runLogs.length > 0 && (
              <button
                onClick={onClearLogs}
                className="p-1.5 text-[#999999] hover:text-rose-600 border border-[#E5E5E5] rounded-md hover:bg-rose-50 transition-colors"
                title="Clear local audit log"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAFAFA] text-[10px] uppercase tracking-widest text-[#999999] border-b border-[#E5E5E5]">
              <tr>
                <th className="px-6 py-3.5 font-medium">Clearance ID</th>
                <th className="px-6 py-3.5 font-medium">Candidate</th>
                <th className="px-6 py-3.5 font-medium">Department Checks</th>
                <th className="px-6 py-3.5 font-medium">Final Outcome</th>
                <th className="px-6 py-3.5 font-medium">Duration</th>
                <th className="px-6 py-3.5 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#F0F0F0]">
              {filteredLogs.map((log) => {
                const isPassed = log.outcome === 'Passed';

                return (
                  <tr key={log.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-medium text-[#1A1A1A]">
                      {log.id}
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-[#1A1A1A]">{log.studentName}</div>
                      <div className="text-[10px] font-mono text-[#666666]">
                        {log.rollNumber} • {log.department}
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span
                          className={`px-1.5 py-0.5 rounded border ${
                            log.financeStatus === 'approved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          FIN: {log.financeStatus === 'approved' ? '✓' : '✗'}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded border ${
                            log.libraryStatus === 'approved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          LIB: {log.libraryStatus === 'approved' ? '✓' : '✗'}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded border ${
                            log.academicStatus === 'approved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          DEPT: {log.academicStatus === 'approved' ? '✓' : '✗'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium font-mono ${
                          isPassed
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                        )}
                        <span>{log.outcome}</span>
                      </span>
                    </td>

                    <td className="px-6 py-3.5 font-mono text-[#666666]">
                      {log.totalDurationSeconds}s
                    </td>

                    <td className="px-6 py-3.5 text-right font-mono text-[#999999] text-[11px]">
                      {log.timestamp}
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#999999]">
                    <FileSpreadsheet className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    <p className="text-xs">No clearance records match your query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

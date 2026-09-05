import React from 'react';
import { Student, DepartmentHold, DepartmentId } from '../types';
import { getStudentScenarioTag, getStudentDescription } from '../lib/mock-data';
import { CheckCircle2, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';

interface StudentPickerProps {
  students: Student[];
  selectedStudent: Student;
  onSelectStudent: (student: Student) => void;
  onResetAll: () => void;
  isEvaluating: boolean;
}

export const StudentPicker: React.FC<StudentPickerProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  onResetAll,
  isEvaluating,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
              1. Select Test Candidate
            </h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F4F4F7] text-[#666666] border border-[#E5E5E5]">
              4 Test Personas
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Select a seeded graduation candidate to evaluate instant clearance or test targeted resolution.
          </p>
        </div>

        <button
          onClick={onResetAll}
          disabled={isEvaluating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#666666] hover:text-black border border-[#E5E5E5] bg-[#F4F4F7] hover:bg-white rounded-md transition-colors self-start sm:self-auto disabled:opacity-50"
          title="Reset all modified hold statuses back to seed definitions"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Persona Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {students.map((student) => {
          const isSelected = student.id === selectedStudent.id;
          const activeHolds = (Object.entries(student.holds || {}) as [DepartmentId, DepartmentHold][]).filter(
            ([_, hold]) => hold && hold.hasHold
          );
          const holdsCount = activeHolds.length;
          const isAllCleared = holdsCount === 0;

          // Dynamic badge label & styling: always strictly reflect real-time holds status
          let badgeText = 'Happy Path';
          let badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';

          if (isAllCleared) {
            badgeText = student.id === 'ayesha-raza' ? 'Happy Path' : 'Happy Path (Resolved)';
            badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
          } else if (holdsCount === 1) {
            const [deptId] = activeHolds[0];
            badgeText = deptId === 'finance' ? 'Financial Hold' : 'Single Hold';
            badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
          } else {
            badgeText = `Multi-Dept Hold (${holdsCount})`;
            badgeClass = 'bg-rose-50 text-rose-800 border-rose-200';
          }

          const dynamicDescription = getStudentDescription(student);

          return (
            <div
              key={student.id}
              onClick={() => !isEvaluating && onSelectStudent(student)}
              className={`p-4 rounded-lg border transition-all text-left relative flex flex-col justify-between ${
                isSelected
                  ? 'border-black bg-[#FAFAFA] shadow-sm ring-1 ring-black/5'
                  : 'border-[#E5E5E5] bg-white hover:border-neutral-400 hover:bg-neutral-50/50'
              } ${isEvaluating ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
            >
              <div>
                {/* Header tag */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-[#E5E5E5] text-[#1A1A1A]">
                    {student.rollNumber}
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-medium transition-colors border ${badgeClass}`}
                  >
                    {badgeText}
                  </span>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: student.avatarBg }}
                  >
                    {student.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-[#1A1A1A] truncate leading-tight">
                      {student.name}
                    </h3>
                    <p className="text-[10px] text-[#666666] truncate">{student.department}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-[#666666] line-clamp-2 leading-relaxed mb-3">
                  {dynamicDescription}
                </p>
              </div>

              {/* Status footer indicator */}
              <div className="pt-2 border-t border-[#EAEAEA] flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  {isAllCleared ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">
                        {student.id !== 'ayesha-raza' ? 'All issues resolved • Clear of holds' : 'Clear of holds'}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-amber-700 font-medium">
                        {holdsCount} active {holdsCount === 1 ? 'hold' : 'holds'}
                      </span>
                    </>
                  )}
                </div>

                {isSelected && (
                  <span className="text-[9px] font-mono font-medium text-black flex items-center gap-0.5">
                    Active <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

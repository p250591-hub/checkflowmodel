export type DepartmentId = 'finance' | 'library' | 'academic';

export type AgentStatus = 'idle' | 'checking' | 'approved' | 'rejected';

export interface DepartmentHold {
  hasHold: boolean;
  reason: string;
  resolutionCost?: string;
  resolutionActionTitle: string;
  resolutionActionDesc: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  degree: string;
  cgpa: string;
  expectedGraduation: string;
  avatarInitials: string;
  avatarBg: string;
  description: string;
  scenarioTag: 'Happy Path' | 'Single Hold' | 'Financial Hold' | 'Multi-Dept Hold';
  holds: Record<DepartmentId, DepartmentHold>;
}

export interface DepartmentAgentState {
  id: DepartmentId;
  name: string;
  role: string;
  office: string;
  status: AgentStatus;
  reason: string | null;
  durationMs: number;
  progressPercent: number;
  logs: string[];
}

export interface ClearanceRunRecord {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  outcome: 'Passed' | 'Action Required' | 'Evaluating';
  totalDurationSeconds: number;
  financeStatus: AgentStatus;
  libraryStatus: AgentStatus;
  academicStatus: AgentStatus;
  note?: string;
}

export interface CertificateData {
  certificateId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  degree: string;
  issuedAt: string;
  sha256Hash: string;
  verificationUrl: string;
}

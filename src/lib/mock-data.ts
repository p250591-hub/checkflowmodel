import { Student } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'ayesha-raza',
    name: 'Ayesha Raza',
    rollNumber: 'BSCS-21-014',
    department: 'Computer Science',
    degree: 'Bachelor of Science in Computer Science',
    cgpa: '3.88',
    expectedGraduation: 'Spring 2026',
    avatarInitials: 'AR',
    avatarBg: '#1A1A1A',
    description: 'All university dues cleared, all catalogued volumes returned, senior capstone thesis verified by committee chair.',
    scenarioTag: 'Happy Path',
    holds: {
      finance: {
        hasHold: false,
        reason: 'Tuition fees, lab fees, and convocation dues settled in full. Ledger balance: $0.00.',
        resolutionActionTitle: 'Verify Ledger',
        resolutionActionDesc: 'No action needed. All accounts clear.'
      },
      library: {
        hasHold: false,
        reason: 'Zero overdue loans. All 14 borrowed textbooks and IEEE journal repository items checked in.',
        resolutionActionTitle: 'Return Books',
        resolutionActionDesc: 'No items currently on loan.'
      },
      academic: {
        hasHold: false,
        reason: 'Capstone project "Neural Search Systems" approved. 132 credit hours confirmed by Dept Board.',
        resolutionActionTitle: 'Advisor Sign-off',
        resolutionActionDesc: 'All graduation criteria satisfied.'
      }
    }
  },
  {
    id: 'bilal-ahmed',
    name: 'Bilal Ahmed',
    rollNumber: 'BSSE-20-087',
    department: 'Software Engineering',
    degree: 'Bachelor of Science in Software Engineering',
    cgpa: '3.62',
    expectedGraduation: 'Spring 2026',
    avatarInitials: 'BA',
    avatarBg: '#2D3748',
    description: 'Outstanding library book hold. Retains 2 reserved reference volumes with overdue fines accumulated.',
    scenarioTag: 'Single Hold',
    holds: {
      finance: {
        hasHold: false,
        reason: 'Account in good standing. Semester 8 tuition receipt #FN-88291 acknowledged.',
        resolutionActionTitle: 'Pay Balance',
        resolutionActionDesc: 'No outstanding institutional dues.'
      },
      library: {
        hasHold: true,
        reason: '2 overdue library items flagged: "Clean Architecture (Martin)" and "Database Internals (Petrov)". Fine: $38.50.',
        resolutionCost: '$38.50 fine + item return',
        resolutionActionTitle: 'Return Books & Pay Fine',
        resolutionActionDesc: 'Drop books at Circulation Desk & waive fine via campus credit.'
      },
      academic: {
        hasHold: false,
        reason: 'Final year software project "MediFlow EHR" graded A-. Required elective credits verified.',
        resolutionActionTitle: 'Submit Project',
        resolutionActionDesc: 'Department approval granted.'
      }
    }
  },
  {
    id: 'hina-sultana',
    name: 'Hina Sultana',
    rollNumber: 'BBA-21-142',
    department: 'Business Administration',
    degree: 'Bachelor of Business Administration',
    cgpa: '3.74',
    expectedGraduation: 'Spring 2026',
    avatarInitials: 'HS',
    avatarBg: '#374151',
    description: 'Pending bursar clearance. Outstanding semester tuition installment and graduation audit charge.',
    scenarioTag: 'Financial Hold',
    holds: {
      finance: {
        hasHold: true,
        reason: 'Outstanding balance of $1,450.00 (Final semester tuition installment $1,200 + Convocation gown fee $250).',
        resolutionCost: '$1,450.00',
        resolutionActionTitle: 'Settle Finance Hold',
        resolutionActionDesc: 'Simulate one-click online tuition settlement & clear Bursar lock.'
      },
      library: {
        hasHold: false,
        reason: 'Digital & physical circulation clearance confirmed. Zero active holds.',
        resolutionActionTitle: 'Verify Library',
        resolutionActionDesc: 'No library obligations.'
      },
      academic: {
        hasHold: false,
        reason: 'Corporate internship dossier accepted. 130 credits verified by Undergraduate Director.',
        resolutionActionTitle: 'Verify Internship',
        resolutionActionDesc: 'Internship and capstone approved.'
      }
    }
  },
  {
    id: 'omar-farooq',
    name: 'Omar Farooq',
    rollNumber: 'BSEE-19-056',
    department: 'Electrical Engineering',
    degree: 'Bachelor of Science in Electrical Engineering',
    cgpa: '3.41',
    expectedGraduation: 'Spring 2026',
    avatarInitials: 'OF',
    avatarBg: '#1F2937',
    description: 'Complex multi-department block across Finance, Library, and Electrical Engineering Department.',
    scenarioTag: 'Multi-Dept Hold',
    holds: {
      finance: {
        hasHold: true,
        reason: 'Hardware laboratory damage liability fee of $320.00 pending payment in Bursar account.',
        resolutionCost: '$320.00',
        resolutionActionTitle: 'Settle Lab Liability',
        resolutionActionDesc: 'Clear the hardware replacement charge with University Accounts.'
      },
      library: {
        hasHold: true,
        reason: 'Unreturned physical reference textbook: "Microelectronic Circuits (Sedra & Smith 7th Ed)". Overdue by 42 days.',
        resolutionCost: '$65.00 replacement fee',
        resolutionActionTitle: 'Return Book & Pay Fee',
        resolutionActionDesc: 'Return reserve desk reference volume and zero overdue penalty.'
      },
      academic: {
        hasHold: true,
        reason: 'Department Head sign-off withheld. Final year thesis bench prototype report not uploaded to archive.',
        resolutionActionTitle: 'Upload Thesis Archive',
        resolutionActionDesc: 'Submit final hardware schematics & obtain Dept Chair sign-off.'
      }
    }
  }
];

// Persistent local record store state in memory + optional localStorage hydration
const STORAGE_KEY = 'clearflow_students_store_v1';

import { DepartmentId, DepartmentHold } from '../types';

export function getStudentScenarioTag(
  student: Student
): 'Happy Path' | 'Single Hold' | 'Financial Hold' | 'Multi-Dept Hold' {
  if (!student || !student.holds) return 'Happy Path';
  const activeHolds = (Object.entries(student.holds) as [DepartmentId, DepartmentHold][]).filter(
    ([_, hold]) => hold && hold.hasHold
  );

  if (activeHolds.length === 0) {
    return 'Happy Path';
  }

  if (activeHolds.length === 1) {
    const [deptId] = activeHolds[0];
    if (deptId === 'finance') {
      return 'Financial Hold';
    }
    return 'Single Hold';
  }

  return 'Multi-Dept Hold';
}

export function getStudentDescription(student: Student): string {
  if (!student || !student.holds) return '';
  const activeHolds = (Object.entries(student.holds) as [DepartmentId, DepartmentHold][]).filter(
    ([_, hold]) => hold && hold.hasHold
  );

  if (activeHolds.length === 0) {
    if (student.id === 'ayesha-raza') {
      return 'All university dues cleared, all catalogued volumes returned, senior capstone thesis verified by committee chair.';
    }
    if (student.id === 'bilal-ahmed') {
      return 'Happy path verified: All overdue library volumes returned and fines settled. Cleared for convocation.';
    }
    if (student.id === 'hina-sultana') {
      return 'Happy path verified: Final tuition installment and convocation fee settled. All bursar obligations cleared.';
    }
    if (student.id === 'omar-farooq') {
      return 'Happy path verified: Hardware liabilities, library loans, and thesis archive verified. Full clearance achieved.';
    }
    return 'Happy path verified: All departmental holds and institutional requirements cleared. Ready for degree conferral.';
  }

  if (activeHolds.length === 1) {
    const [deptId, hold] = activeHolds[0];
    if (student.id === 'omar-farooq') {
      return `Single hold remaining: ${hold.reason || hold.resolutionActionTitle}. Other departmental holds cleared.`;
    }
    if (student.id === 'bilal-ahmed') {
      return 'Outstanding library book hold. Retains 2 reserved reference volumes with overdue fines accumulated.';
    }
    if (student.id === 'hina-sultana') {
      return 'Pending bursar clearance. Outstanding semester tuition installment and graduation audit charge.';
    }
    return student.description;
  }

  if (student.id === 'omar-farooq') {
    return 'Complex multi-department block across Finance, Library, and Electrical Engineering Department.';
  }

  return student.description;
}

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((s: Student) => ({
          ...s,
          scenarioTag: getStudentScenarioTag(s),
          description: getStudentDescription(s),
        }));
      }
    }
  } catch (err) {
    console.error('Error reading student store from storage:', err);
  }
  return INITIAL_STUDENTS;
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving student store:', err);
  }
}

export function resetStoredStudents(): Student[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error resetting student store:', err);
  }
  return INITIAL_STUDENTS;
}

// Initial mock / starter data for a realistic 3rd Sem B.Tech CSE student

export const initialProfile = {
  name: "Aarav Sharma",
  branch: "B.Tech Computer Science & Engineering",
  semester: "3rd Semester",
  college: "National Institute of Technology",
  dailyGoalHours: 4,
};

export const initialSubjects = [
  {
    id: "sub-1",
    name: "Data Structures & Algorithms",
    code: "CS201",
    color: "#2D6A4F", // Forest emerald
    faculty: "Dr. K. Raman",
    targetHoursWeekly: 8,
  },
  {
    id: "sub-2",
    name: "Object-Oriented Programming (Java)",
    code: "CS203",
    color: "#1D4ED8", // Royal blue
    faculty: "Prof. S. Mehra",
    targetHoursWeekly: 6,
  },
  {
    id: "sub-3",
    name: "Discrete Mathematics",
    code: "MA205",
    color: "#B45309", // Warm amber
    faculty: "Dr. N. Iyer",
    targetHoursWeekly: 5,
  },
  {
    id: "sub-4",
    name: "Computer Organization & Architecture",
    code: "CS205",
    color: "#7C3AED", // Purple
    faculty: "Prof. V. Gupta",
    targetHoursWeekly: 5,
  },
  {
    id: "sub-5",
    name: "Database Management Systems",
    code: "CS207",
    color: "#0F766E", // Teal
    faculty: "Dr. A. Verma",
    targetHoursWeekly: 6,
  },
];

// Helper to get formatted dates relative to today
const getRelativeDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
};

export const initialTasks = [
  {
    id: "task-1",
    title: "Implement AVL Tree balance rotations in C++",
    description: "Write recursive insertion, left/right rotation helpers and test with 10 sample test cases.",
    subjectId: "sub-1",
    dueDate: getRelativeDate(1), // Tomorrow
    priority: "High",
    status: "Pending", // 'Pending' | 'Completed'
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Java OOP Mini-Lab 4: Banking System with Exceptions",
    description: "Design Account hierarchy, custom InsufficientFundsException, and unit tests.",
    subjectId: "sub-2",
    dueDate: getRelativeDate(-1), // Yesterday (Overdue on purpose to demonstrate overdue highlighting)
    priority: "High",
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Discrete Math Assignment: Proof by Induction & Recurrence",
    description: "Solve problems 4.1 to 4.8 from Rosen Chapter 5.",
    subjectId: "sub-3",
    dueDate: getRelativeDate(3),
    priority: "Medium",
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "COA Pipeline Hazard Simulation Notes",
    description: "Summarize data hazards, structural hazards, and forwarding techniques with diagram.",
    subjectId: "sub-4",
    dueDate: getRelativeDate(5),
    priority: "Low",
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-5",
    title: "DBMS ER Diagram for Hospital Management System",
    description: "Draw complete ER schema with cardinality constraints and identify primary keys.",
    subjectId: "sub-5",
    dueDate: getRelativeDate(0), // Today
    priority: "Medium",
    status: "Completed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-6",
    title: "Binary Search Tree Traversals Implementation",
    description: "Iterative and recursive Inorder, Preorder, and Postorder traversals.",
    subjectId: "sub-1",
    dueDate: getRelativeDate(-3),
    priority: "Medium",
    status: "Completed",
    createdAt: new Date().toISOString(),
  },
];

export const initialSessions = [
  {
    id: "ses-1",
    subjectId: "sub-1",
    date: getRelativeDate(0), // Today
    startTime: "16:00",
    durationMinutes: 90,
    goal: "Revise Graph BFS/DFS traversal and Dijkstra's algorithm",
    completed: false,
  },
  {
    id: "ses-2",
    subjectId: "sub-2",
    date: getRelativeDate(0), // Today
    startTime: "18:30",
    durationMinutes: 60,
    goal: "Java Multithreading: Runnable interface vs Thread class",
    completed: true,
  },
  {
    id: "ses-3",
    subjectId: "sub-3",
    date: getRelativeDate(1), // Tomorrow
    startTime: "17:00",
    durationMinutes: 75,
    goal: "Solve Pigeonhole principle and Permutation problems",
    completed: false,
  },
  {
    id: "ses-4",
    subjectId: "sub-5",
    date: getRelativeDate(2),
    startTime: "19:00",
    durationMinutes: 90,
    goal: "SQL Subqueries and Group By / Having clauses practice",
    completed: false,
  },
  {
    id: "ses-5",
    subjectId: "sub-4",
    date: getRelativeDate(-1), // Yesterday
    startTime: "15:00",
    durationMinutes: 60,
    goal: "Instruction cycle timing diagrams & Micro-operations",
    completed: true,
  },
  {
    id: "ses-6",
    subjectId: "sub-1",
    date: getRelativeDate(-2), // 2 days ago
    startTime: "16:30",
    durationMinutes: 90,
    goal: "Dynamic Programming: Knapsack 0/1 Memoization",
    completed: true,
  },
];

export const initialFaculty = [
  {
    id: "fac-1",
    name: "Dr. K. Raman",
    email: "k.raman@college.edu",
    department: "Computer Science & Engineering",
    designation: "Professor & Head",
    office: "CS Block, Room 302",
    subjectId: "sub-1",
    subjectName: "Data Structures & Algorithms",
    statusText: "Available for consultation (2 PM - 4 PM)",
    avatarInitials: "KR",
    color: "#2D6A4F",
  },
  {
    id: "fac-2",
    name: "Prof. S. Mehra",
    email: "s.mehra@college.edu",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    office: "CS Block, Room 215",
    subjectId: "sub-2",
    subjectName: "Object-Oriented Programming (Java)",
    statusText: "In Lab Session till 4 PM",
    avatarInitials: "SM",
    color: "#1D4ED8",
  },
  {
    id: "fac-3",
    name: "Dr. N. Iyer",
    email: "n.iyer@college.edu",
    department: "Mathematics & Computing",
    designation: "Assistant Professor",
    office: "Science Block, Room 108",
    subjectId: "sub-3",
    subjectName: "Discrete Mathematics",
    statusText: "Available tomorrow morning",
    avatarInitials: "NI",
    color: "#B45309",
  },
  {
    id: "fac-4",
    name: "Prof. V. Gupta",
    email: "v.gupta@college.edu",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    office: "Hardware Lab 1",
    subjectId: "sub-4",
    subjectName: "Computer Organization & Architecture",
    statusText: "Available via portal chat",
    avatarInitials: "VG",
    color: "#7C3AED",
  },
  {
    id: "fac-5",
    name: "Dr. A. Verma",
    email: "a.verma@college.edu",
    department: "Information Technology",
    designation: "Associate Professor",
    office: "IT Block, Room 405",
    subjectId: "sub-5",
    subjectName: "Database Management Systems",
    statusText: "Reviewing project schemas",
    avatarInitials: "AV",
    color: "#0F766E",
  },
];

export const initialConversations = [
  {
    id: "conv-1",
    facultyId: "fac-1", // Dr. K. Raman (DSA)
    studentName: "Aarav Sharma",
    studentRoll: "22BCSE104",
    subjectName: "Data Structures & Algorithms",
    status: "Answered", // 'Pending' | 'Answered'
    updatedAt: "2026-10-12T11:45:00.000Z",
    messages: [
      {
        id: "msg-101",
        sender: "student",
        senderName: "Aarav Sharma",
        text: "Good morning Sir, in Assignment 1 on AVL Trees, should we handle duplicate keys during insertion, or assume unique integer keys?",
        timestamp: "2026-10-12T09:15:00.000Z",
      },
      {
        id: "msg-102",
        sender: "faculty",
        senderName: "Dr. K. Raman",
        text: "Good morning Aarav. You can assume all input keys are strictly unique. Focus on recursive balance factor calculation and clean RR/LL/RL/LR rotation cases.",
        timestamp: "2026-10-12T11:45:00.000Z",
      },
    ],
  },
  {
    id: "conv-2",
    facultyId: "fac-2", // Prof. S. Mehra (Java)
    studentName: "Aarav Sharma",
    studentRoll: "22BCSE104",
    subjectName: "Object-Oriented Programming (Java)",
    status: "Pending", // Needs faculty response
    updatedAt: "2026-10-12T13:20:00.000Z",
    messages: [
      {
        id: "msg-201",
        sender: "student",
        senderName: "Aarav Sharma",
        text: "Prof. Mehra, in Mini-Lab 4 for banking exceptions, is it acceptable to extend RuntimeException for custom InsufficientFundsException, or should it be a checked Exception extending java.lang.Exception?",
        timestamp: "2026-10-12T13:20:00.000Z",
      },
    ],
  },
  {
    id: "conv-3",
    facultyId: "fac-5", // Dr. A. Verma (DBMS)
    studentName: "Aarav Sharma",
    studentRoll: "22BCSE104",
    subjectName: "Database Management Systems",
    status: "Answered",
    updatedAt: "2026-10-11T16:30:00.000Z",
    messages: [
      {
        id: "msg-301",
        sender: "student",
        senderName: "Aarav Sharma",
        text: "Respected Ma'am, for the Hospital Management ER diagram, can a doctor have a ternary relationship with patient and ward, or is binary relationship preferred?",
        timestamp: "2026-10-11T14:10:00.000Z",
      },
      {
        id: "msg-302",
        sender: "faculty",
        senderName: "Dr. A. Verma",
        text: "Keep it clean with binary relationships (Doctor admits Patient, Ward allocates Bed). Ternary will complicate schema decomposition into 3NF later.",
        timestamp: "2026-10-11T16:30:00.000Z",
      },
    ],
  },
];


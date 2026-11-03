# Smart Student Hub — Student Productivity & Academic Management Portal

**College Mini-Project | Hack-O-Week Evaluation**  
**Team:** 3rd Semester B.Tech Computer Science & Engineering (3 Members)  
**Stack:** React 18, Vite 5, JavaScript (ES6+), CSS Modules, React Router v6, Context API, localStorage

---

## 📌 Project Overview
**Smart Student Hub** is an academic productivity portal engineered specifically for college students to coordinate assignments, semester coursework, revision schedules, and track productivity metrics in one place.

The system requires no external backend or database server. All data is persisted client-side in the browser using `localStorage` through custom React hooks.

---

## 👥 Three-Member Module Breakdown (Viva Guide)

### 🧑‍💻 Member 1: Academic Task & Deadline Manager
- **File / Route:** `src/pages/TasksPage.jsx`, `src/components/TaskForm.jsx`
- **Key Responsibilities:**
  1. Add, edit, delete, and toggle completion of assignments.
  2. Input validation for title, subject, and due date.
  3. Interactive search bar (filters live by title & description keywords).
  4. Multi-level filtering by Subject, Priority (High/Medium/Low), and Status (Pending/Completed).
  5. Sorting by earliest due date, latest due date, and priority level.
  6. Dynamic **overdue detection** (`isOverdue` helper) highlighting overdue assignments in crimson with a warning badge.
  7. Confirm modal prior to deleting assignments.

### 🧑‍💻 Member 2: Study Planner & Subject Goals
- **File / Route:** `src/pages/PlannerPage.jsx`, `src/pages/SubjectsPage.jsx`, `src/components/PlannerForms.jsx`
- **Key Responsibilities:**
  1. Semester subject registry: course codes, professors, weekly study targets, and color tags.
  2. Study session scheduler: study date, start time (24hr formatted to 12hr AM/PM), duration, and specific study goal/topic.
  3. **Weekly 7-Day Visual Timetable**: dynamic Monday–Sunday column layout showing scheduled blocks with subject color accents and today indicator.
  4. Real-time metric cards for planned sessions, completed sessions, and study consistency percentage.
  5. Filter sessions by subject or completion status.

### 🧑‍💻 Member 3: Dashboard, Productivity Insights & Integration
- **File / Route:** `src/pages/DashboardPage.jsx`, `src/context/AppContext.jsx`, `src/components/Layout.jsx`
- **Key Responsibilities:**
  1. Centralized **Context API (`AppContext`)** architecture managing shared state, localStorage synchronization, and statistics calculation.
  2. Student Welcome Hero with in-place editable profile name and college.
  3. Metric cards displaying Total Assignments, Completed, Pending, and Overdue deadlines.
  4. Calculated Productivity Health bars (Task Completion Rate % and Study Consistency %).
  5. Quick preview of upcoming deadlines and today's study schedule with quick "Done" toggles.
  6. Responsive Layout Shell with sidebar navigation, mobile drawer toggle, and "Reset Demo Data" helper.

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (v18+ or v20+)
- NPM

### Steps
1. Navigate to the project directory:
   ```bash
   cd smart-student-hub
   ```
2. Install dependencies (if needed):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the browser and visit `http://localhost:5173`.

---

## 💡 Viva Questions & Quick Answers

1. **Why use Context API instead of Redux?**  
   *Answer:* For a mini-project of this scale, Redux introduces unnecessary boilerplate (actions, reducers, store configuration). React's built-in `createContext` and `useContext` hooks cleanly share state across all three modules without adding external dependencies.

2. **How does localStorage persistence work?**  
   *Answer:* We created a custom hook `useLocalStorage(key, initialValue)` located in `src/hooks/useLocalStorage.js`. It reads from `localStorage.getItem` during initialization and automatically writes back via `useEffect` whenever state updates.

3. **How does overdue deadline calculation work?**  
   *Answer:* In `src/utils/dateUtils.js`, `isOverdue` parses the task's `YYYY-MM-DD` string, compares its timestamp against midnight of the current day (`today.setHours(0,0,0,0)`), and returns `true` only if the date is in the past and status is not `'Completed'`.

4. **Why use CSS Modules?**  
   *Answer:* CSS Modules scope class names locally (e.g., `styles.taskCard`), preventing CSS collisions across components while keeping standard CSS syntax clean and easy to explain.

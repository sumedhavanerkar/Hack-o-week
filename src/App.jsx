import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { TasksPage } from "./pages/TasksPage";
import { PlannerPage } from "./pages/PlannerPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { StudentChatPage } from "./pages/StudentChatPage";
import { FacultyDashboardPage } from "./pages/FacultyDashboardPage";
import { FacultyQueriesPage } from "./pages/FacultyQueriesPage";

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            {/* Student Portal Routes */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/chat" element={<StudentChatPage />} />

            {/* Faculty Portal Routes */}
            <Route path="/faculty" element={<FacultyDashboardPage />} />
            <Route path="/faculty/queries" element={<FacultyQueriesPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
}

export default App;

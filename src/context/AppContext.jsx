import React, { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  initialProfile,
  initialSubjects,
  initialTasks,
  initialSessions,
  initialFaculty,
  initialConversations,
} from "../utils/initialData";
import { isOverdue } from "../utils/dateUtils";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Persistent State
  const [profile, setProfile] = useLocalStorage("ssh_profile", initialProfile);
  const [subjects, setSubjects] = useLocalStorage("ssh_subjects", initialSubjects);
  const [tasks, setTasks] = useLocalStorage("ssh_tasks", initialTasks);
  const [sessions, setSessions] = useLocalStorage("ssh_sessions", initialSessions);
  const [faculty, setFaculty] = useLocalStorage("ssh_faculty", initialFaculty);
  const [conversations, setConversations] = useLocalStorage("ssh_conversations", initialConversations);
  // Active demo role: 'student' or 'faculty'
  const [activeRole, setActiveRole] = useLocalStorage("ssh_active_role", "student");
  // Currently logged-in / active faculty ID in Faculty Portal demo
  const [activeFacultyId, setActiveFacultyId] = useLocalStorage("ssh_active_faculty_id", "fac-1");

  // Profile actions
  const updateProfile = (updatedFields) => {
    setProfile((prev) => ({ ...prev, ...updatedFields }));
  };

  // Subject actions
  const addSubject = (newSubject) => {
    const subjectWithId = {
      ...newSubject,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, subjectWithId]);
    return subjectWithId;
  };

  const updateSubject = (id, updatedFields) => {
    setSubjects((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updatedFields } : sub))
    );
  };

  const deleteSubject = (id) => {
    // Also cleanup tasks or keep them safely mapped
    setSubjects((prev) => prev.filter((sub) => sub.id !== id));
  };

  // Task actions (Member 1)
  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: taskData.status || "Pending",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedFields } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskStatus = (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  // Study Session actions (Member 2)
  const addSession = (sessionData) => {
    const newSession = {
      ...sessionData,
      id: `ses-${Date.now()}`,
      completed: false,
    };
    setSessions((prev) => [...prev, newSession]);
    return newSession;
  };

  const updateSession = (id, updatedFields) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleSessionCompletion = (id) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  // Reset to initial demo data (Very useful for college viva demo!)
  const resetToDemoData = () => {
    setProfile(initialProfile);
    setSubjects(initialSubjects);
    setTasks(initialTasks);
    setSessions(initialSessions);
    setFaculty(initialFaculty);
    setConversations(initialConversations);
    setActiveRole("student");
    setActiveFacultyId("fac-1");
  };

  // Chat & Query Actions (Shared between Student & Faculty Views)
  const sendStudentMessage = (facultyId, text) => {
    if (!text || !text.trim()) return null;
    const trimmed = text.trim();
    const timestamp = new Date().toISOString();

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "student",
      senderName: profile.name || "Student",
      text: trimmed,
      timestamp,
    };

    setConversations((prev) => {
      const existingIndex = prev.findIndex((c) => c.facultyId === facultyId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          status: "Pending", // Needs faculty response
          updatedAt: timestamp,
          messages: [...existing.messages, newMsg],
        };
        return updated;
      } else {
        // Start new conversation with this faculty
        const targetFac = faculty.find((f) => f.id === facultyId);
        const newConv = {
          id: `conv-${Date.now()}`,
          facultyId,
          studentName: profile.name || "Student",
          studentRoll: "22BCSE104",
          subjectName: targetFac?.subjectName || "Academic Inquiry",
          status: "Pending",
          updatedAt: timestamp,
          messages: [newMsg],
        };
        return [newConv, ...prev];
      }
    });

    return newMsg;
  };

  const sendFacultyReply = (conversationId, text) => {
    if (!text || !text.trim()) return null;
    const trimmed = text.trim();
    const timestamp = new Date().toISOString();
    const currentFac = faculty.find((f) => f.id === activeFacultyId) || faculty[0];

    const replyMsg = {
      id: `msg-${Date.now()}`,
      sender: "faculty",
      senderName: currentFac?.name || "Faculty",
      text: trimmed,
      timestamp,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            status: "Answered",
            updatedAt: timestamp,
            messages: [...conv.messages, replyMsg],
          };
        }
        return conv;
      })
    );

    return replyMsg;
  };

  const toggleQueryStatus = (conversationId) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const next = c.status === "Pending" ? "Answered" : "Pending";
          return { ...c, status: next };
        }
        return c;
      })
    );
  };

  // Derived Analytics (Member 3 - Real calculated numbers)
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
    const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.completed).length;
    const sessionCompletionRate =
      totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    const totalStudyMinutes = sessions
      .filter((s) => s.completed)
      .reduce((acc, curr) => acc + Number(curr.durationMinutes || 0), 0);
    const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      taskCompletionRate,
      totalSessions,
      completedSessions,
      sessionCompletionRate,
      totalStudyMinutes,
      totalStudyHours,
    };
  }, [tasks, sessions]);

  // Subject lookup map for quick access
  const subjectMap = useMemo(() => {
    const map = {};
    subjects.forEach((sub) => {
      map[sub.id] = sub;
    });
    return map;
  }, [subjects]);

  const value = {
    profile,
    updateProfile,
    subjects,
    subjectMap,
    addSubject,
    updateSubject,
    deleteSubject,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    sessions,
    addSession,
    updateSession,
    deleteSession,
    toggleSessionCompletion,
    stats,
    resetToDemoData,
    faculty,
    setFaculty,
    conversations,
    setConversations,
    sendStudentMessage,
    sendFacultyReply,
    toggleQueryStatus,
    activeRole,
    setActiveRole,
    activeFacultyId,
    setActiveFacultyId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

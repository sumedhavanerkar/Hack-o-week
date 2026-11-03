import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  Edit3,
  TrendingUp,
  Plus,
  BookOpen,
  UserCheck,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";
import { TaskForm } from "../components/TaskForm";
import { SessionForm } from "../components/PlannerForms";
import { PriorityBadge, SubjectBadge } from "../components/Badge";
import { formatDate, formatRelativeDate, formatTime, isOverdue, isToday } from "../utils/dateUtils";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const {
    profile,
    updateProfile,
    tasks,
    sessions,
    subjectMap,
    stats,
    addTask,
    addSession,
    toggleTaskStatus,
    toggleSessionCompletion,
  } = useApp();

  // Edit Name Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [tempCollege, setTempCollege] = useState(profile.college);

  // Quick Action Modal States
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
  const [isQuickSessionOpen, setIsQuickSessionOpen] = useState(false);

  // Filter Upcoming Deadlines (Pending tasks sorted by earliest due date)
  const upcomingDeadlines = tasks
    .filter((t) => t.status === "Pending")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  // Filter Today's Study Sessions
  const todaySessions = sessions
    .filter((s) => isToday(s.date))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      updateProfile({ name: tempName.trim(), college: tempCollege.trim() });
      setIsEditProfileOpen(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Welcome Hero Card */}
      <section className={styles.welcomeCard}>
        <div className={styles.welcomeText}>
          <div className={styles.welcomeGreeting}>
            <h1>Hello, {profile.name}!</h1>
            <button
              type="button"
              className={styles.editNameBtn}
              onClick={() => {
                setTempName(profile.name);
                setTempCollege(profile.college);
                setIsEditProfileOpen(true);
              }}
              title="Edit Profile Name"
            >
              <Edit3 size={15} />
            </button>
          </div>
          <p className={styles.welcomeSubtitle}>
            {profile.branch} • {profile.college}
          </p>
          <span className={styles.memberTag}>
            <UserCheck size={13} />
            Module 3 — Dashboard & Insights Integration (Member 3)
          </span>
        </div>

        <div className={styles.quickActions}>
          <button
            type="button"
            className={styles.heroBtn}
            onClick={() => setIsQuickTaskOpen(true)}
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
          <button
            type="button"
            className={styles.heroBtn}
            onClick={() => setIsQuickSessionOpen(true)}
          >
            <Calendar size={16} />
            <span>Plan Session</span>
          </button>
        </div>
      </section>

      {/* Summary Stat Cards */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.iconCircleTasks}`}>
            <CheckSquare size={22} />
          </div>
          <div className={styles.statDetails}>
            <span className={styles.statNumber}>{stats.totalTasks}</span>
            <span className={styles.statTitle}>Total Assignments</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.iconCircleCompleted}`}>
            <TrendingUp size={22} />
          </div>
          <div className={styles.statDetails}>
            <span className={styles.statNumber}>{stats.completedTasks}</span>
            <span className={styles.statTitle}>Completed Tasks</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.iconCirclePending}`}>
            <Clock size={22} />
          </div>
          <div className={styles.statDetails}>
            <span className={styles.statNumber}>{stats.pendingTasks}</span>
            <span className={styles.statTitle}>Pending Tasks</span>
          </div>
        </div>

        <div
          className={`${styles.statCard} ${
            stats.overdueTasks > 0 ? styles.statCardAlert : ""
          }`}
        >
          <div className={`${styles.iconCircle} ${styles.iconCircleOverdue}`}>
            <AlertCircle size={22} />
          </div>
          <div className={styles.statDetails}>
            <span className={styles.statNumber}>{stats.overdueTasks}</span>
            <span className={styles.statTitle}>Overdue Deadlines</span>
          </div>
        </div>
      </section>

      {/* Productivity Insight Summary Banner */}
      <section className={styles.productivityCard}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Flame size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-main)" }}>
              Weekly Productivity Health
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Real-time progress based on your completed assignments & study hours.
            </p>
          </div>
        </div>

        <div className={styles.progressCluster}>
          <div className={styles.progressItem}>
            <div className={styles.progressLabel}>
              <span>Task Completion</span>
              <strong>{stats.taskCompletionRate}%</strong>
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${stats.taskCompletionRate}%`,
                  backgroundColor: "var(--primary)",
                }}
              />
            </div>
          </div>

          <div className={styles.progressItem}>
            <div className={styles.progressLabel}>
              <span>Study Consistency</span>
              <strong>{stats.sessionCompletionRate}%</strong>
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${stats.sessionCompletionRate}%`,
                  backgroundColor: "var(--secondary)",
                }}
              />
            </div>
          </div>

          <div className={styles.progressItem}>
            <div className={styles.progressLabel}>
              <span>Total Hours Logged</span>
              <strong>{stats.totalStudyHours} hrs</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Split: Upcoming Deadlines & Today's Schedule */}
      <div className={styles.dashboardSplit}>
        {/* Panel 1: Upcoming Assignment Deadlines */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>
              <AlertCircle size={18} color="var(--primary)" />
              <span>Upcoming Deadlines</span>
            </h2>
            <Link to="/tasks" className={styles.panelLink}>
              View All ({tasks.length}) <ChevronRight size={14} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", padding: "1rem 0" }}>
              🎉 All assignments are currently completed! Great job.
            </p>
          ) : (
            <div className={styles.itemsList}>
              {upcomingDeadlines.map((task) => {
                const sub = subjectMap[task.subjectId];
                const overdue = isOverdue(task.dueDate, task.status);

                return (
                  <div
                    key={task.id}
                    className={`${styles.miniTaskItem} ${
                      overdue ? styles.miniTaskItemOverdue : ""
                    }`}
                  >
                    <div className={styles.miniTaskDetails}>
                      <span className={styles.miniTaskTitle}>{task.title}</span>
                      <div className={styles.miniTaskMeta}>
                        <span>{sub?.code || "Course"}</span>
                        <span>•</span>
                        <span style={{ color: overdue ? "var(--danger-text)" : "inherit" }}>
                          {formatRelativeDate(task.dueDate)}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <PriorityBadge priority={task.priority} />
                      <button
                        type="button"
                        onClick={() => toggleTaskStatus(task.id)}
                        style={{
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-color)",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.72rem",
                          cursor: "pointer",
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Panel 2: Today's Study Sessions */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>
              <Calendar size={18} color="var(--primary)" />
              <span>Today's Study Schedule</span>
            </h2>
            <Link to="/planner" className={styles.panelLink}>
              Full Planner <ChevronRight size={14} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>

          {todaySessions.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", padding: "1rem 0" }}>
              No study sessions scheduled for today yet. Use "Plan Session" above to set a target!
            </p>
          ) : (
            <div className={styles.itemsList}>
              {todaySessions.map((s) => {
                const sub = subjectMap[s.subjectId];

                return (
                  <div
                    key={s.id}
                    className={`${styles.miniSessionItem} ${
                      s.completed ? styles.miniSessionItemDone : ""
                    }`}
                    style={{ borderLeftColor: sub?.color || "#2D6A4F" }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={styles.miniSessionGoal}>
                        {s.goal}
                      </div>
                      <div className={styles.miniSessionTime}>
                        {sub?.name} • {formatTime(s.startTime)} ({s.durationMinutes}m)
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSessionCompletion(s.id)}
                      style={{
                        background: s.completed ? "var(--primary-light)" : "var(--bg-surface)",
                        color: s.completed ? "var(--primary)" : "var(--text-main)",
                        border: "1px solid var(--border-color)",
                        padding: "0.25rem 0.55rem",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      {s.completed ? "Completed ✓" : "Mark Done"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Student Profile"
      >
        <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>
              Student Display Name
            </label>
            <input
              type="text"
              required
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.8rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>
              College / University
            </label>
            <input
              type="text"
              value={tempCollege}
              onChange={(e) => setTempCollege(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.8rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              style={{
                background: "transparent",
                border: "1px solid var(--border-color)",
                padding: "0.55rem 1rem",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: "var(--primary)",
                color: "#ffffff",
                border: "none",
                padding: "0.55rem 1.25rem",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save Name
            </button>
          </div>
        </form>
      </Modal>

      {/* Quick Task Modal */}
      <Modal
        isOpen={isQuickTaskOpen}
        onClose={() => setIsQuickTaskOpen(false)}
        title="Quick Add Assignment"
      >
        <TaskForm
          onSubmit={(data) => {
            addTask(data);
            setIsQuickTaskOpen(false);
          }}
          onCancel={() => setIsQuickTaskOpen(false)}
        />
      </Modal>

      {/* Quick Session Modal */}
      <Modal
        isOpen={isQuickSessionOpen}
        onClose={() => setIsQuickSessionOpen(false)}
        title="Quick Schedule Study Session"
      >
        <SessionForm
          onSubmit={(data) => {
            addSession(data);
            setIsQuickSessionOpen(false);
          }}
          onCancel={() => setIsQuickSessionOpen(false)}
        />
      </Modal>
    </div>
  );
}

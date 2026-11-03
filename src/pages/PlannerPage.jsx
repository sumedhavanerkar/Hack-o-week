import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle,
  Calendar as CalendarIcon,
  Edit2,
  Trash2,
  UserCheck,
  Check,
  Flame,
  Target,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { EmptyState } from "../components/EmptyState";
import { SessionForm } from "../components/PlannerForms";
import { SubjectBadge } from "../components/Badge";
import {
  formatDate,
  formatTime,
  isToday,
  getCurrentWeekDates,
} from "../utils/dateUtils";
import styles from "./PlannerPage.module.css";

export function PlannerPage() {
  const {
    sessions,
    addSession,
    updateSession,
    deleteSession,
    toggleSessionCompletion,
    subjects,
    subjectMap,
    stats,
  } = useApp();

  // Filters & Tabs
  const [filterSubject, setFilterSubject] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL"); // 'ALL' | 'completed' | 'pending'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const weekDates = useMemo(() => getCurrentWeekDates(), []);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions
      .filter((s) => {
        const matchSub = filterSubject === "ALL" || s.subjectId === filterSubject;
        const matchStatus =
          filterStatus === "ALL" ||
          (filterStatus === "completed" ? s.completed : !s.completed);
        return matchSub && matchStatus;
      })
      .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`));
  }, [sessions, filterSubject, filterStatus]);

  const handleCreateSession = (data) => {
    addSession(data);
    setIsAddModalOpen(false);
  };

  const handleUpdateSession = (data) => {
    if (editingSession) {
      updateSession(editingSession.id, data);
      setEditingSession(null);
    }
  };

  const handleDeleteSession = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete.id);
      setSessionToDelete(null);
    }
  };

  return (
    <div className={styles.plannerPage}>
      {/* Page Header */}
      <div className={styles.headerSection}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Study Planner & Weekly Schedule</h1>
          <p className={styles.subtitle}>
            Plan targeted study blocks, track daily revision goals, and maintain academic consistency.
          </p>
          <span className={styles.memberTag}>
            <UserCheck size={13} />
            Module 2 — Built by Member 2
          </span>
        </div>

        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          <span>Schedule Study Session</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIconWrap}>
            <Target size={22} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{stats.totalSessions}</span>
            <span className={styles.metricLabel}>Total Sessions Planned</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrap}>
            <CheckCircle size={22} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{stats.completedSessions}</span>
            <span className={styles.metricLabel}>Sessions Completed</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrap}>
            <Flame size={22} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{stats.sessionCompletionRate}%</span>
            <span className={styles.metricLabel}>Completion Consistency</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrap}>
            <Clock size={22} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{stats.totalStudyHours} hrs</span>
            <span className={styles.metricLabel}>Total Study Time Logged</span>
          </div>
        </div>
      </div>

      {/* Weekly Visual Schedule Section */}
      <section className={styles.weekSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>This Week's Timetable</h2>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Current 7-Day Window
          </span>
        </div>

        <div className={styles.weekGrid}>
          {weekDates.map((day) => {
            const daySessions = sessions.filter((s) => s.date === day.dateStr);

            return (
              <div
                key={day.dateStr}
                className={`${styles.dayColumn} ${
                  day.isToday ? styles.dayColumnToday : ""
                }`}
              >
                <div className={styles.dayHeader}>
                  <div className={styles.dayName}>
                    {day.dayName} {day.isToday && "(Today)"}
                  </div>
                  <div className={styles.dayDate}>{day.formattedDate}</div>
                </div>

                <div className={styles.daySessionsList}>
                  {daySessions.length === 0 ? (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-light)",
                        textAlign: "center",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      No sessions
                    </span>
                  ) : (
                    daySessions.map((s) => {
                      const sub = subjectMap[s.subjectId];
                      return (
                        <div
                          key={s.id}
                          className={`${styles.miniSessionCard} ${
                            s.completed ? styles.miniSessionDone : ""
                          }`}
                          style={{ borderLeftColor: sub?.color || "#2D6A4F" }}
                          onClick={() => toggleSessionCompletion(s.id)}
                          title={`${s.goal} (${s.completed ? "Done" : "Pending"}) - Click to toggle`}
                        >
                          <div className={styles.miniSessionSubject}>
                            {sub?.code || "Study"}
                          </div>
                          <div className={styles.miniSessionTime}>
                            {formatTime(s.startTime)} • {s.durationMinutes}m
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detailed Sessions List with Filters */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className={styles.controlsBar}>
          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
            All Scheduled Sessions ({filteredSessions.length})
          </span>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select
              className={styles.filterSelect}
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="ALL">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              className={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="pending">Upcoming / Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No study sessions scheduled"
            description="Set a goal and assign 30-90 minutes of dedicated revision time."
            actionLabel="Schedule Session"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className={styles.sessionsList}>
            {filteredSessions.map((session) => {
              const sub = subjectMap[session.subjectId];
              const todayFlag = isToday(session.date);

              return (
                <div key={session.id} className={styles.sessionCard}>
                  <button
                    type="button"
                    className={`${styles.checkBtn} ${
                      session.completed ? styles.checkBtnCompleted : ""
                    }`}
                    onClick={() => toggleSessionCompletion(session.id)}
                    title={session.completed ? "Mark incomplete" : "Mark as completed"}
                  >
                    {session.completed && <Check size={14} />}
                  </button>

                  <div className={styles.sessionContent}>
                    <div className={styles.sessionHeader}>
                      <h3
                        className={`${styles.sessionGoal} ${
                          session.completed ? styles.sessionGoalDone : ""
                        }`}
                      >
                        {session.goal}
                      </h3>
                      <SubjectBadge subject={sub} />
                    </div>

                    <div className={styles.sessionMeta}>
                      <div className={styles.metaItem}>
                        <CalendarIcon size={14} />
                        <span>
                          {formatDate(session.date)}{" "}
                          {todayFlag && (
                            <strong style={{ color: "var(--primary)" }}>
                              (Today)
                            </strong>
                          )}
                        </span>
                      </div>

                      <div className={styles.metaItem}>
                        <Clock size={14} />
                        <span>
                          {formatTime(session.startTime)} ({session.durationMinutes} mins)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => setEditingSession(session)}
                      title="Edit Session"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => setSessionToDelete(session)}
                      title="Delete Session"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Add Session Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Study Session"
      >
        <SessionForm
          onSubmit={handleCreateSession}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Session Modal */}
      <Modal
        isOpen={!!editingSession}
        onClose={() => setEditingSession(null)}
        title="Edit Study Session"
      >
        {editingSession && (
          <SessionForm
            initialData={editingSession}
            onSubmit={handleUpdateSession}
            onCancel={() => setEditingSession(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleDeleteSession}
        title="Delete Study Session"
        message="Are you sure you want to remove this study session from your schedule?"
      />
    </div>
  );
}

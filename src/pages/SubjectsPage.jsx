import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  User,
  Edit2,
  Trash2,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { EmptyState } from "../components/EmptyState";
import { SubjectForm } from "../components/PlannerForms";
import styles from "./SubjectsPage.module.css";

export function SubjectsPage() {
  const {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    tasks,
    sessions,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const handleCreateSubject = (data) => {
    addSubject(data);
    setIsAddModalOpen(false);
  };

  const handleUpdateSubject = (data) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, data);
      setEditingSubject(null);
    }
  };

  const handleDeleteSubject = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete.id);
      setSubjectToDelete(null);
    }
  };

  return (
    <div className={styles.subjectsPage}>
      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Subjects & Study Goals</h1>
          <p className={styles.subtitle}>
            Manage enrolled college courses, professors, and weekly study target hours.
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
          <span>Add New Subject</span>
        </button>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects registered yet"
          description="Add your semester subjects to start organizing assignments and study schedules."
          actionLabel="Add Subject"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className={styles.subjectsGrid}>
          {subjects.map((subject) => {
            // Calculate stats for this subject
            const subjectTasks = tasks.filter((t) => t.subjectId === subject.id);
            const pendingTasks = subjectTasks.filter((t) => t.status === "Pending").length;

            const subjectSessions = sessions.filter(
              (s) => s.subjectId === subject.id && s.completed
            );
            const studiedMinutes = subjectSessions.reduce(
              (acc, s) => acc + (s.durationMinutes || 0),
              0
            );
            const studiedHours = (studiedMinutes / 60).toFixed(1);
            const targetHours = subject.targetHoursWeekly || 5;
            const progressPercent = Math.min(
              100,
              Math.round((studiedHours / targetHours) * 100)
            );

            return (
              <div key={subject.id} className={styles.subjectCard}>
                <div
                  className={styles.colorBar}
                  style={{ backgroundColor: subject.color || "#2D6A4F" }}
                />

                <div className={styles.cardHeader}>
                  <span className={styles.codeBadge}>{subject.code}</span>
                </div>

                <h3 className={styles.subjectName}>{subject.name}</h3>

                {subject.faculty ? (
                  <div className={styles.facultyName}>
                    <User size={13} />
                    <span>{subject.faculty}</span>
                  </div>
                ) : (
                  <div className={styles.facultyName}>
                    <User size={13} />
                    <span>Faculty unassigned</span>
                  </div>
                )}

                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <span className={styles.statVal}>{pendingTasks}</span>
                    <span className={styles.statLbl}>Pending Tasks</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statVal}>{studiedHours}h / {targetHours}h</span>
                    <span className={styles.statLbl}>Weekly Goal</span>
                  </div>
                </div>

                <div className={styles.progressContainer}>
                  <div className={styles.progressHeader}>
                    <span>Weekly Target Progress</span>
                    <strong>{progressPercent}%</strong>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: subject.color || "#2D6A4F",
                      }}
                    />
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => setEditingSubject(subject)}
                    title="Edit Subject"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => setSubjectToDelete(subject)}
                    title="Delete Subject"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add College Subject"
      >
        <SubjectForm
          onSubmit={handleCreateSubject}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingSubject}
        onClose={() => setEditingSubject(null)}
        title="Edit Subject"
      >
        {editingSubject && (
          <SubjectForm
            initialData={editingSubject}
            onSubmit={handleUpdateSubject}
            onCancel={() => setEditingSubject(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={!!subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={handleDeleteSubject}
        title="Delete Subject"
        message={`Are you sure you want to delete "${subjectToDelete?.name}"? Assignments under this subject will remain.`}
      />
    </div>
  );
}

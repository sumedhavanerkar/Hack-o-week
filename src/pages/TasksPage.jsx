import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Calendar,
  Check,
  Edit2,
  Trash2,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { EmptyState } from "../components/EmptyState";
import { TaskForm } from "../components/TaskForm";
import { PriorityBadge, StatusBadge, SubjectBadge } from "../components/Badge";
import { formatDate, formatRelativeDate, isOverdue } from "../utils/dateUtils";
import styles from "./TasksPage.module.css";

export function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus, subjects, subjectMap } =
    useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("dueDateAsc"); // 'dueDateAsc' | 'dueDateDesc' | 'priority'

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search by title or description
        const matchSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description &&
            task.description.toLowerCase().includes(searchQuery.toLowerCase()));

        // Filter subject
        const matchSubject =
          filterSubject === "ALL" || task.subjectId === filterSubject;

        // Filter priority
        const matchPriority =
          filterPriority === "ALL" || task.priority === filterPriority;

        // Filter status
        const matchStatus =
          filterStatus === "ALL" || task.status === filterStatus;

        return matchSearch && matchSubject && matchPriority && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === "dueDateAsc") {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === "dueDateDesc") {
          return new Date(b.dueDate) - new Date(a.dueDate);
        }
        if (sortBy === "priority") {
          const priorityScore = { High: 3, Medium: 2, Low: 1 };
          return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
        }
        return 0;
      });
  }, [tasks, searchQuery, filterSubject, filterPriority, filterStatus, sortBy]);

  const handleCreateTask = (data) => {
    addTask(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdateTask = (data) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      setEditingTask(null);
    }
  };

  const handleDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className={styles.tasksPage}>
      {/* Top Header */}
      <div className={styles.headerSection}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Academic Task & Deadline Manager</h1>
          <p className={styles.subtitle}>
            Organize assignments, lab submissions, and track strict deadlines.
          </p>
          <span className={styles.memberTag}>
            <UserCheck size={13} />
            Module 1 — Built by Member 1
          </span>
        </div>

        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} />
          <span>Add New Assignment</span>
        </button>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search tasks by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filtersGroup}>
          {/* Subject Filter */}
          <select
            className={styles.filterSelect}
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="ALL">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            className={styles.filterSelect}
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="Pending">Pending Only</option>
            <option value="Completed">Completed Only</option>
          </select>

          {/* Sort */}
          <select
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDateAsc">Sort: Due Date (Earliest)</option>
            <option value="dueDateDesc">Sort: Due Date (Latest)</option>
            <option value="priority">Sort: Highest Priority</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No assignments match your filter"
          description="Try clearing search filters or create a new assignment to keep track of upcoming submissions."
          actionLabel="Create Assignment"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className={styles.taskList}>
          {filteredTasks.map((task) => {
            const subject = subjectMap[task.subjectId];
            const overdue = isOverdue(task.dueDate, task.status);
            const isCompleted = task.status === "Completed";

            return (
              <div
                key={task.id}
                className={`${styles.taskCard} ${overdue ? styles.taskOverdue : ""}`}
              >
                {/* Complete checkbox button */}
                <button
                  type="button"
                  className={`${styles.checkBtn} ${
                    isCompleted ? styles.checkBtnCompleted : ""
                  }`}
                  onClick={() => toggleTaskStatus(task.id)}
                  title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
                >
                  {isCompleted && <Check size={14} />}
                </button>

                {/* Content */}
                <div className={styles.taskContent}>
                  <div className={styles.taskTopRow}>
                    <h3
                      className={`${styles.taskTitle} ${
                        isCompleted ? styles.taskTitleCompleted : ""
                      }`}
                    >
                      {task.title}
                    </h3>

                    <div className={styles.badgesGroup}>
                      <SubjectBadge subject={subject} />
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} isOverdueItem={overdue} />
                    </div>
                  </div>

                  {task.description && (
                    <p className={styles.taskDesc}>{task.description}</p>
                  )}

                  <div className={styles.taskMeta}>
                    <div className={styles.metaItem}>
                      <Calendar size={14} />
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>

                    <div
                      className={`${styles.metaItem} ${
                        overdue ? styles.overdueText : ""
                      }`}
                    >
                      {overdue && <AlertTriangle size={14} />}
                      <span>({formatRelativeDate(task.dueDate)})</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.taskActions}>
                  <button
                    type="button"
                    className={styles.actionIconBtn}
                    onClick={() => setEditingTask(task)}
                    title="Edit Task"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                    onClick={() => setTaskToDelete(task)}
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Academic Assignment"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Assignment Details"
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This cannot be undone.`}
      />
    </div>
  );
}

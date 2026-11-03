import React from "react";
import styles from "./Badge.module.css";

export function PriorityBadge({ priority }) {
  const normalized = (priority || "").toLowerCase();
  const cls = styles[normalized] || styles.low;
  return <span className={`${styles.badge} ${cls}`}>{priority} Priority</span>;
}

export function StatusBadge({ status, isOverdueItem }) {
  if (isOverdueItem && status !== "Completed") {
    return <span className={`${styles.badge} ${styles.overdue}`}>⚠️ Overdue</span>;
  }
  const cls = status === "Completed" ? styles.completed : styles.pending;
  return <span className={`${styles.badge} ${cls}`}>{status}</span>;
}

export function SubjectBadge({ subject }) {
  if (!subject) return <span className={`${styles.badge} ${styles.subjectBadge}`}>General</span>;
  return (
    <span className={`${styles.badge} ${styles.subjectBadge}`}>
      <span
        className={styles.colorDot}
        style={{ backgroundColor: subject.color || "#2D6A4F" }}
      />
      {subject.name}
    </span>
  );
}

import React from "react";
import { FolderOpen } from "lucide-react";
import styles from "./EmptyState.module.css";

export function EmptyState({
  icon: Icon = FolderOpen,
  title = "No items found",
  description = "Get started by creating your first entry.",
  actionLabel,
  onAction,
}) {
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.iconWrapper}>
        <Icon size={24} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {actionLabel && onAction && (
        <button type="button" className={styles.actionBtn} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

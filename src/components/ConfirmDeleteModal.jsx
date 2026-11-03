import React from "react";
import { Modal } from "./Modal";
import styles from "./ConfirmDeleteModal.module.css";

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={styles.confirmModal}>
        <p className={styles.warningText}>{message}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

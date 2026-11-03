import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import styles from "./TaskForm.module.css";

export function TaskForm({ initialData = null, onSubmit, onCancel }) {
  const { subjects } = useApp();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: subjects[0]?.id || "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Medium",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        subjectId: initialData.subjectId || subjects[0]?.id || "",
        dueDate: initialData.dueDate || new Date().toISOString().split("T")[0],
        priority: initialData.priority || "Medium",
        status: initialData.status || "Pending",
      });
    }
  }, [initialData, subjects]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = "Task title is required";
    } else if (formData.title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters long";
    }

    if (!formData.subjectId) {
      errs.subjectId = "Please select a subject";
    }

    if (!formData.dueDate) {
      errs.dueDate = "Due date is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Assignment / Task Title *</label>
        <input
          type="text"
          className={styles.input}
          placeholder="e.g. Implement Dijkstra's Algorithm in C++"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        {errors.title && <span className={styles.errorText}>{errors.title}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description / Instructions</label>
        <textarea
          className={styles.textarea}
          placeholder="Add assignment details, test cases, or submission guidelines..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Subject *</label>
          <select
            className={styles.select}
            value={formData.subjectId}
            onChange={(e) => handleChange("subjectId", e.target.value)}
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name} ({sub.code})
              </option>
            ))}
          </select>
          {errors.subjectId && (
            <span className={styles.errorText}>{errors.subjectId}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Due Date *</label>
          <input
            type="date"
            className={styles.input}
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
          />
          {errors.dueDate && <span className={styles.errorText}>{errors.dueDate}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Priority</label>
          <select
            className={styles.select}
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Initial Status</label>
          <select
            className={styles.select}
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn}>
          {initialData ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </form>
  );
}

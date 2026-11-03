import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import styles from "./PlannerForms.module.css";

export function SessionForm({ initialData = null, onSubmit, onCancel }) {
  const { subjects } = useApp();

  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    startTime: "16:00",
    durationMinutes: 60,
    goal: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        subjectId: initialData.subjectId || subjects[0]?.id || "",
        date: initialData.date || new Date().toISOString().split("T")[0],
        startTime: initialData.startTime || "16:00",
        durationMinutes: initialData.durationMinutes || 60,
        goal: initialData.goal || "",
      });
    }
  }, [initialData, subjects]);

  const validate = () => {
    const errs = {};
    if (!formData.subjectId) errs.subjectId = "Please choose a subject";
    if (!formData.date) errs.date = "Study date is required";
    if (!formData.startTime) errs.startTime = "Start time is required";
    if (!formData.durationMinutes || Number(formData.durationMinutes) <= 0) {
      errs.durationMinutes = "Enter a valid duration (minimum 15 mins)";
    }
    if (!formData.goal.trim()) {
      errs.goal = "Please enter a specific study goal or topic";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      durationMinutes: Number(formData.durationMinutes),
    });
  };

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
        <label className={styles.label}>Study Goal / Topic to Revise *</label>
        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="e.g. Master Binary Search Trees & practice 3 LeetCode problems"
          value={formData.goal}
          onChange={(e) => handleChange("goal", e.target.value)}
        />
        {errors.goal && <span className={styles.errorText}>{errors.goal}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Date *</label>
          <input
            type="date"
            className={styles.input}
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          {errors.date && <span className={styles.errorText}>{errors.date}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Start Time *</label>
          <input
            type="time"
            className={styles.input}
            value={formData.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
          />
          {errors.startTime && (
            <span className={styles.errorText}>{errors.startTime}</span>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Duration (Minutes) *</label>
        <select
          className={styles.select}
          value={formData.durationMinutes}
          onChange={(e) => handleChange("durationMinutes", e.target.value)}
        >
          <option value={30}>30 mins (Quick Review)</option>
          <option value={45}>45 mins</option>
          <option value={60}>60 mins (1 Hour Session)</option>
          <option value={90}>90 mins (1.5 Hours Deep Work)</option>
          <option value={120}>120 mins (2 Hours Lab / Prep)</option>
        </select>
        {errors.durationMinutes && (
          <span className={styles.errorText}>{errors.durationMinutes}</span>
        )}
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn}>
          {initialData ? "Save Session" : "Schedule Session"}
        </button>
      </div>
    </form>
  );
}

const PALETTE = [
  "#2D6A4F", // Green
  "#1D4ED8", // Blue
  "#B45309", // Amber
  "#7C3AED", // Purple
  "#0F766E", // Teal
  "#BE123C", // Rose
];

export function SubjectForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    faculty: "",
    color: PALETTE[0],
    targetHoursWeekly: 5,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        faculty: initialData.faculty || "",
        color: initialData.color || PALETTE[0],
        targetHoursWeekly: initialData.targetHoursWeekly || 5,
      });
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Subject name is required";
    if (!formData.code.trim()) errs.code = "Course code is required (e.g. CS201)";
    if (!formData.targetHoursWeekly || Number(formData.targetHoursWeekly) <= 0) {
      errs.targetHoursWeekly = "Enter weekly study target hours";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      targetHoursWeekly: Number(formData.targetHoursWeekly),
    });
  };

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Subject Name *</label>
        <input
          type="text"
          className={styles.input}
          placeholder="e.g. Computer Networks"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Course Code *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. CS302"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
          />
          {errors.code && <span className={styles.errorText}>{errors.code}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Weekly Target (Hours) *</label>
          <input
            type="number"
            className={styles.input}
            min={1}
            max={30}
            value={formData.targetHoursWeekly}
            onChange={(e) => handleChange("targetHoursWeekly", e.target.value)}
          />
          {errors.targetHoursWeekly && (
            <span className={styles.errorText}>{errors.targetHoursWeekly}</span>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Professor / Faculty Name</label>
        <input
          type="text"
          className={styles.input}
          placeholder="e.g. Dr. A. Sharma"
          value={formData.faculty}
          onChange={(e) => handleChange("faculty", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Card Accent Color</label>
        <div className={styles.colorPickerGroup}>
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.colorOption} ${
                formData.color === c ? styles.colorOptionSelected : ""
              }`}
              style={{ backgroundColor: c }}
              onClick={() => handleChange("color", c)}
            />
          ))}
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn}>
          {initialData ? "Save Subject" : "Add Subject"}
        </button>
      </div>
    </form>
  );
}

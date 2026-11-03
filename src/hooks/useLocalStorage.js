import { useState, useEffect } from "react";

/**
 * Custom hook to sync state with localStorage.
 * Simple, beginner-friendly, and safe against JSON parsing errors.
 *
 * @param {string} key - localStorage key
 * @param {any} initialValue - fallback initial state
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
    }
    return typeof initialValue === "function" ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error saving to localStorage key "${key}":`, err);
    }
  }, [key, value]);

  return [value, setValue];
}

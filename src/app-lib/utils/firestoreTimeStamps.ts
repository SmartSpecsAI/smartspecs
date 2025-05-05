import { Timestamp } from "firebase/firestore";

export const toISODate = (value: unknown): string => {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  console.warn("Valor no reconocido en toISODate:", value);
  return new Date().toISOString(); // fallback
};
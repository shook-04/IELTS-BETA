"use client";

import { createContext, useContext } from "react";
import type { CurrentUser } from "../lib/currentUser";

export const StudentContext = createContext<CurrentUser | null>(null);

/**
 * Access the authenticated student's data from any page under app/student.
 * Must be used within app/student/layout.tsx's provider, which guarantees
 * the user is loaded and is actually a Student by the time children render.
 */
export function useStudent(): CurrentUser {
  const student = useContext(StudentContext);
  if (!student) {
    throw new Error("useStudent() must be used within the student layout");
  }
  return student;
}
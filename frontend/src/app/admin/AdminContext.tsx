"use client";

import { createContext, useContext } from "react";
import type { CurrentUser } from "../lib/currentUser";

export const AdminContext = createContext<CurrentUser | null>(null);

/**
 * Access the authenticated admin's data from any page under app/admin.
 * Must be used within app/admin/layout.tsx's provider, which guarantees
 * the user is loaded and is actually an Admin by the time children render.
 */
export function useAdmin(): CurrentUser {
  const admin = useContext(AdminContext);
  if (!admin) {
    throw new Error("useAdmin() must be used within the admin layout");
  }
  return admin;
}
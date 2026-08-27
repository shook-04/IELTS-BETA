export type Role = "Student" | "Teacher" | "Admin";

export interface CurrentUser {
  userId: number;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  // Present only when role === "Student"
  targetBand: number | null;
  currentBand: number | null;
  daysActive: number | null;
}

export const AUTH_ME_URL = "http://localhost:8080/api/auth/me";

/**
 * Fetches the currently authenticated user from the backend session.
 * Returns null if the request fails (401 unauthenticated, network error, etc.)
 * so callers can decide how to handle "not logged in".
 */
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const res = await fetch(AUTH_ME_URL, {
      method: "GET",
      credentials: "include", // required so the session cookie is sent
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as CurrentUser;
  } catch {
    return null;
  }
}

export function getInitials(firstName: string, lastName: string): string {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "?";
}

export function getFullName(firstName: string, lastName: string): string {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}
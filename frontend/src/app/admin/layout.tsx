"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import { fetchCurrentUser, type CurrentUser } from "../lib/currentUser";
import { AdminContext } from "./AdminContext";

// Where a logged-in-but-wrong-role user should land instead of /admin/*.
const ROLE_DASHBOARD: Record<string, string> = {
  Student: "/student/dashboard",
  Teacher: "/teacher/dashboard",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "denied">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser().then((current) => {
      if (cancelled) return;

      if (!current) {
        // No valid session — send them to log in.
        router.replace("/login");
        setStatus("denied");
        return;
      }

      if (current.role !== "Admin") {
        // Authenticated, but as a Student/Teacher — don't treat them as an
        // admin. Send them to their own dashboard instead.
        router.replace(ROLE_DASHBOARD[current.role] ?? "/login");
        setStatus("denied");
        return;
      }

      setUser(current);
      setStatus("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status !== "ready" || !user) {
    // Brief loading/redirect state — intentionally minimal so it never
    // flashes real (or stale) admin content before the identity check
    // completes.
    return null;
  }

  return (
    <AdminContext.Provider value={user}>
      <div className="app">
        <AdminSidebar firstName={user.firstName} lastName={user.lastName} />
        <div className="main">{children}</div>
      </div>
    </AdminContext.Provider>
  );
}
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import { fetchCurrentUser, type CurrentUser } from "../lib/currentUser";
import { StudentContext } from "./StudentContext";

// Where a logged-in-but-wrong-role user should land instead of /student/*.
const ROLE_DASHBOARD: Record<string, string> = {
  Teacher: "/teacher/dashboard",
  Admin: "/admin/dashboard",
};

export default function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
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

      if (current.role !== "Student") {
        // Authenticated, but as a Teacher/Admin — don't treat them as a
        // student. Send them to their own dashboard instead.
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
    // flashes real (or stale) student content before the identity check
    // completes.
    return null;
  }

  return (
    <StudentContext.Provider value={user}>
      <div className="app">
        <StudentSidebar daysActive={user.daysActive} />
        <div className="main">
          <StudentTopbar firstName={user.firstName} lastName={user.lastName} />
          {children}
        </div>
      </div>
    </StudentContext.Provider>
  );
}
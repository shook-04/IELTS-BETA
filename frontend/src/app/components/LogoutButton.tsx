"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include", // required so the backend can identify and invalidate the session
      });
    } catch {
      // Even if the network call fails, still send the user back to login —
      // the session will expire server-side on its own regardless.
    } finally {
      router.push("/login");
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      style={{
        background: "none",
        border: "1.5px solid #E4E8DF",
        borderRadius: "9px",
        padding: "9px 16px",
        fontSize: "13.5px",
        fontWeight: 700,
        color: "#C4453A",
        cursor: loggingOut ? "default" : "pointer",
        opacity: loggingOut ? 0.6 : 1,
        fontFamily: "inherit",
      }}
    >
      {loggingOut ? "Logging out..." : "Log out"}
    </button>
  );
}

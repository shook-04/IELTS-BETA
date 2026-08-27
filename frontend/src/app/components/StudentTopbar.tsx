"use client";

import LogoutButton from "./LogoutButton";
import { getFullName, getInitials } from "../lib/currentUser";

interface StudentTopbarProps {
  firstName: string;
  lastName: string;
}

export default function StudentTopbar({ firstName, lastName }: StudentTopbarProps) {
  return (
    <div className="topbar">
      <div className="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        Search courses, tests, lessons…
      </div>
      <div className="top-actions">
        <div className="bell">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          <span className="dot"></span>
        </div>
        <div className="avatar-wrap">
          <div className="avatar">{getInitials(firstName, lastName)}</div>
          <div>
            <div className="avatar-name">{getFullName(firstName, lastName)}</div>
            <div className="avatar-role">Student</div>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
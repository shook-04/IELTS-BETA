"use client";

import LogoutButton from "./LogoutButton";
import { getFullName, getInitials } from "../lib/currentUser";

interface AdminTopbarProps {
  breadcrumb: string;
  title: string;
  searchPlaceholder?: string;
  firstName: string;
  lastName: string;
}

export default function AdminTopbar({
  breadcrumb,
  title,
  searchPlaceholder = "Search students, tests, tickets…",
  firstName,
  lastName,
}: AdminTopbarProps) {
  return (
    <div className="topbar">
      <div className="breadcrumb">
        <div className="path">{breadcrumb}</div>
        <h1>{title}</h1>
      </div>
      <div className="top-actions">
        <div className="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          {searchPlaceholder}
        </div>
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
            <div className="avatar-role">Admin</div>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  // Route prefixes that should also light up this tab (e.g. course-detail
  // belongs under the Courses tab even though it isn't nested under it).
  activePrefixes: string[];
  icon: ReactElement;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/student/dashboard",
    activePrefixes: ["/student/dashboard"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Courses",
    href: "/student/courses",
    activePrefixes: ["/student/courses", "/student/course-detail"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    label: "Practice Test",
    href: "/student/tests",
    activePrefixes: ["/student/tests"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    label: "Progress",
    href: "/student/progress",
    activePrefixes: ["/student/progress"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18" />
        <path d="M18 17V9M13 17V5M8 17v-4" />
      </svg>
    ),
  },
];

interface PlaceholderItem {
  label: string;
  icon: ReactElement;
}

// These don't have real pages/routes yet. They're here to fill out the
// sidebar visually, matching the original design's placeholder links.
// Wire these up to real routes once those pages exist.
const PLACEHOLDER_ITEMS: PlaceholderItem[] = [
  {
    label: "Live Classes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="15" height="10" rx="2" />
        <path d="M17 10l5-3v10l-5-3" />
      </svg>
    ),
  },
  {
    label: "Support",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 2-2 3.5M12 17h.01" />
      </svg>
    ),
  },
  {
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

interface StudentSidebarProps {
  daysActive: number | null;
}

export default function StudentSidebar({ daysActive }: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <Image
          src="/images/ielts-beta-logo.jpg"
          alt="IELTS Beta logo"
          width={160}
          height={50}
          priority
        />
        <div className="brand-text">
          <span className="name">IELTS Beta</span>
          <span className="tag">Student Portal</span>
        </div>
      </div>

      <div className="nav-label">Menu</div>
      <nav className="nav">
        {NAV_ITEMS.map((item) => {
          const isActive = item.activePrefixes.some((prefix) =>
            pathname.startsWith(prefix)
          );
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "active" : ""}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        {PLACEHOLDER_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="streak">
          <div className="flame">🔥</div>
          <div>
            <div className="num">
              {daysActive !== null ? `${daysActive}-day streak` : "Welcome!"}
            </div>
            <div className="lbl">Keep it going today</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
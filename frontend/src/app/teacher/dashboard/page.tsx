"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Chart from "chart.js/auto";
import LogoutButton from "../../components/LogoutButton";
import { fetchCurrentUser, getFullName, getInitials, type CurrentUser } from "../../lib/currentUser";
import "./teacher-dashboard.css";

interface CourseRow {
  title: string;
  meta: string;
  progressPct: number;
  thumbGradient: string;
  icon: React.ReactElement;
}

interface LiveClassRow {
  month: string;
  day: string;
  title: string;
  meta: string;
}

interface ActivityRow {
  dotClass: "a1" | "a2" | "a3";
  icon: React.ReactElement;
  text: string;
  time: string;
}

const courses: CourseRow[] = [
  {
    title: "IELTS Academic Reading Mastery",
    meta: "Intermediate · 128 students enrolled",
    progressPct: 62,
    thumbGradient: "linear-gradient(135deg, var(--forest-700), var(--teal-500))",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H12v18H4.5A2.5 2.5 0 0 1 2 18.5z"/></svg>,
  },
  {
    title: "IELTS Listening Foundations",
    meta: "Foundation · 94 students enrolled",
    progressPct: 40,
    thumbGradient: "linear-gradient(135deg, var(--blue), var(--blue-400))",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/></svg>,
  },
  {
    title: "IELTS Reading — Advanced Strategies",
    meta: "Advanced · 56 students enrolled",
    progressPct: 78,
    thumbGradient: "linear-gradient(135deg, var(--amber), #D9A15A)",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>,
  },
  {
    title: "Skimming & Scanning Bootcamp",
    meta: "Foundation · 34 students enrolled",
    progressPct: 20,
    thumbGradient: "linear-gradient(135deg, var(--purple), #B487DE)",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H12v18H4.5A2.5 2.5 0 0 1 2 18.5z"/></svg>,
  },
];

const liveClasses: LiveClassRow[] = [
  { month: "Aug", day: "22", title: "Reading: Matching Headings Workshop", meta: "6:00 PM · 42 students" },
  { month: "Aug", day: "25", title: "Skimming Techniques Live Q&A", meta: "7:30 PM · 28 students" },
];

const activity: ActivityRow[] = [
  {
    dotClass: "a1",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
    text: "Sarah Ahmed submitted Writing Task 2",
    time: "28 minutes ago",
  },
  {
    dotClass: "a2",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
    text: "6 new students enrolled in Reading Mastery",
    time: "2 hours ago",
  },
  {
    dotClass: "a3",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="15" height="10" rx="2"/></svg>,
    text: 'Live class "Matching Headings" scheduled',
    time: "Yesterday",
  },
  {
    dotClass: "a1",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/></svg>,
    text: "Arafat Rahman completed Module 3",
    time: "Yesterday",
  },
];

// Where a logged-in-but-wrong-role user should land instead of /teacher/dashboard.
const ROLE_DASHBOARD: Record<string, string> = {
  Student: "/student/dashboard",
  Admin: "/admin/dashboard",
};

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<CurrentUser | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "denied">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser().then((current) => {
      if (cancelled) return;

      if (!current) {
        router.replace("/login");
        setStatus("denied");
        return;
      }

      if (current.role !== "Teacher") {
        router.replace(ROLE_DASHBOARD[current.role] ?? "/login");
        setStatus("denied");
        return;
      }

      setTeacher(current);
      setStatus("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const engagementRef = useRef<HTMLCanvasElement>(null);
  const completionRef = useRef<HTMLCanvasElement>(null);
  const testActivityRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (status !== "ready") return;

    const gridColor = "#E4E8DF";
    const tickColor = "#6E7A72";
    const charts: Chart[] = [];

    if (engagementRef.current) {
      charts.push(
        new Chart(engagementRef.current, {
          type: "line",
          data: {
            labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
            datasets: [
              {
                data: [180, 210, 195, 240, 265, 288],
                borderColor: "#41957D",
                backgroundColor: "rgba(65,149,125,0.08)",
                fill: true,
                tension: 0.35,
                pointRadius: 2.5,
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: gridColor }, ticks: { font: { size: 9.5 }, color: tickColor } },
              x: { grid: { display: false }, ticks: { font: { size: 9.5 }, color: tickColor } },
            },
          },
        })
      );
    }

    if (completionRef.current) {
      charts.push(
        new Chart(completionRef.current, {
          type: "bar",
          data: {
            labels: ["Reading Mastery", "Listening Fnd.", "Adv. Strategies", "Skim & Scan"],
            datasets: [
              {
                data: [62, 40, 78, 20],
                backgroundColor: "#41957D",
                borderRadius: 5,
                maxBarThickness: 22,
              },
            ],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { min: 0, max: 100, grid: { color: gridColor }, ticks: { font: { size: 9.5 }, color: tickColor } },
              y: { grid: { display: false }, ticks: { font: { size: 9.5 }, color: tickColor } },
            },
          },
        })
      );
    }

    if (testActivityRef.current) {
      charts.push(
        new Chart(testActivityRef.current, {
          type: "bar",
          data: {
            labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
            datasets: [
              {
                data: [24, 31, 28, 35, 40, 37],
                backgroundColor: "#C9862E",
                borderRadius: 5,
                maxBarThickness: 18,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: gridColor }, ticks: { font: { size: 9.5 }, color: tickColor } },
              x: { grid: { display: false }, ticks: { font: { size: 9.5 }, color: tickColor } },
            },
          },
        })
      );
    }

    return () => {
      charts.forEach((c) => c.destroy());
    };
  }, [status]);

  if (status !== "ready" || !teacher) {
    // Brief loading/redirect state — intentionally minimal so it never
    // flashes real (or stale) teacher content before the identity check
    // completes.
    return null;
  }

  return (
<div className="app">

  {/* SIDEBAR */}
  <aside className="sidebar">
    <div className="brand">
      <Image
        src="/images/ielts-beta-logo.jpg"
        alt="IELTS Beta logo"
        width={40}
        height={40}
        priority
      />
      <div className="brand-text"><span className="name">IELTS Beta</span><span className="tag">Teacher Portal</span></div>
    </div>
    <nav className="nav">
      <a href="#" className="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>
        Dashboard
      </a>
      <a href="#">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        My Courses
      </a>
      <a href="#">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 10l5-3v10l-5-3"/></svg>
        Live Classes
      </a>
      <a href="#">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Students
      </a>
      <a href="#">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg>
        Profile
      </a>
    </nav>
    <div className="sidebar-foot">
      <div className="teacher-chip">
        <div className="av">{getInitials(teacher.firstName, teacher.lastName)}</div>
        <div><div className="name">{getFullName(teacher.firstName, teacher.lastName)}</div><div className="role">Teacher</div></div>
      </div>
    </div>
  </aside>

  {/* MAIN */}
  <div className="main">
    <div className="topbar">
      <div className="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        Search courses, students…
      </div>
      <div className="top-actions">
        <div className="bell"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg><span className="dot"></span></div>
        <div className="avatar-wrap">
          <div className="avatar">{getInitials(teacher.firstName, teacher.lastName)}</div>
          <div><div className="avatar-name">{getFullName(teacher.firstName, teacher.lastName)}</div><div className="avatar-role">Teacher</div></div>
        </div>
        <LogoutButton />
      </div>
    </div>

    <div className="content">

      {/* HERO */}
      <div className="hero">
        <div className="hero-left">
          <h1>Welcome back, {teacher.firstName} 👋</h1>
          <p>You have 2 live classes this week and 6 essays awaiting review.</p>
        </div>
        <div className="hero-cta">
          <a href="#" className="hero-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>View Courses</a>
          <a href="#" className="hero-btn solid"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>Create Live Class</a>
        </div>
      </div>

      {/* STAT GRID */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon i1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
          <div><div className="stat-val">4</div><div className="stat-lbl">Total Courses</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon i2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
          <div><div className="stat-val">312</div><div className="stat-lbl">Active Students</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon i3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 10l5-3v10l-5-3"/></svg></div>
          <div><div className="stat-val">2</div><div className="stat-lbl">Upcoming Classes</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon i4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></div>
          <div><div className="stat-val">48</div><div className="stat-lbl">Completed Classes</div></div>
        </div>
      </div>

      <div className="two-col">
        <div>
          {/* MY COURSES */}
          <div className="section">
            <div className="section-head"><h2>My Courses</h2><a href="#" className="view-all">View all</a></div>
            <div className="course-list">
              {courses.map((c) => (
                <div className="course-row" key={c.title}>
                  <div className="course-thumb" style={{background: c.thumbGradient}}>{c.icon}</div>
                  <div className="course-row-info">
                    <div className="course-row-title">{c.title}</div>
                    <div className="course-row-meta">{c.meta}</div>
                  </div>
                  <div className="course-row-progress"><div className="bar-track"><div className="bar-fill" style={{width: `${c.progressPct}%`}}></div></div><span className="pct">{c.progressPct}%</span></div>
                  <a href="#" className="btn-manage">Manage</a>
                </div>
              ))}
            </div>
          </div>

          {/* STUDENT ACTIVITY CHARTS */}
          <div className="section">
            <div className="section-head"><h2>Student Activity</h2></div>
            <div className="chart-grid">
              <div className="panel">
                <h3>Engagement</h3>
                <div className="sub">Weekly active students</div>
                <div className="chart-wrap"><canvas ref={engagementRef}></canvas></div>
              </div>
              <div className="panel">
                <h3>Course Completion</h3>
                <div className="sub">Avg. % across your courses</div>
                <div className="chart-wrap"><canvas ref={completionRef}></canvas></div>
              </div>
              <div className="panel">
                <h3>Test Activity</h3>
                <div className="sub">Tests submitted per week</div>
                <div className="chart-wrap"><canvas ref={testActivityRef}></canvas></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* UPCOMING LIVE CLASSES */}
          <div className="section">
            <div className="section-head"><h2>Upcoming Live Classes</h2><a href="#" className="view-all">View all</a></div>
            <div className="live-list">
              {liveClasses.map((lc) => (
                <div className="live-card" key={lc.title}>
                  <div className="live-date-box"><span className="mon">{lc.month}</span><span className="day">{lc.day}</span></div>
                  <div className="live-info">
                    <div className="live-title">{lc.title}</div>
                    <div className="live-meta">{lc.meta}</div>
                  </div>
                  <div className="live-actions">
                    <div className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                    <a href="#" className="btn-join-mini">Join</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="section">
            <div className="section-head"><h2>Recent Activity</h2></div>
            <div className="panel">
              {activity.map((a, i) => (
                <div className="activity-item" key={i}>
                  <div className={`activity-dot ${a.dotClass}`}>{a.icon}</div>
                  <div><div className="activity-text">{a.text}</div><div className="activity-time">{a.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
  );
}
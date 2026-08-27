"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import AdminTopbar from "../../components/AdminTopbar";
import { useAdmin } from "../AdminContext";
import "./admin-dashboard.css";

interface StatCard {
  iconClass: string;
  icon: React.ReactElement;
  trend: string;
  value: string;
  label: string;
}

interface BandSkillRow {
  name: string;
  pct: number;
  color: string;
  val: string;
}

interface QuickAction {
  label: string;
  icon: React.ReactElement;
  primary?: boolean;
}

interface TestAttemptRow {
  initials: string;
  name: string;
  test: string;
  testTitle: string;
  score: string;
  band: string;
  bandLow?: boolean;
  date: string;
}

interface ActivityRow {
  dotClass: "a1" | "a2" | "a3";
  icon: React.ReactElement;
  text: string;
  time: string;
}

const quickActions: QuickAction[] = [
  { label: "Add User", primary: true, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg> },
  { label: "Create Course", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { label: "Create Test", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  { label: "Add Question", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg> },
  { label: "View Reports", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="7"/></svg> },
];

const statCards: StatCard[] = [
  { iconClass: "i1", trend: "▲ 8.2%", value: "4,812", label: "Total Students", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
  { iconClass: "i2", trend: "▲ 3.1%", value: "86", label: "Total Teachers", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg> },
  { iconClass: "i3", trend: "▲ 4", value: "142", label: "Total Courses", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { iconClass: "i4", trend: "▲ 11", value: "368", label: "Total Tests", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  { iconClass: "i5", trend: "▲ 6.4%", value: "31,204", label: "Tests Taken", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
  { iconClass: "i6", trend: "▲ 0.2", value: "6.7", label: "Avg. Band Score", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-4"/></svg> },
];

const bandSkillRows: BandSkillRow[] = [
  { name: "Listening", pct: 78, color: "var(--blue)", val: "7.0" },
  { name: "Reading", pct: 72, color: "var(--teal-500)", val: "6.5" },
  { name: "Writing", pct: 62, color: "var(--amber)", val: "5.5" },
  { name: "Speaking", pct: 70, color: "var(--purple)", val: "6.5" },
  { name: "Overall", pct: 74, color: "var(--forest-700)", val: "6.7" },
];

const testAttempts: TestAttemptRow[] = [
  { initials: "SA", name: "Sarah Ahmed", test: "Academic Reading", testTitle: "Reading Practice Test 01", score: "34/40", band: "7.0", date: "Aug 20, 2026" },
  { initials: "AR", name: "Arafat Rahman", test: "Listening", testTitle: "Listening Mock Test 02", score: "29/40", band: "6.0", bandLow: true, date: "Aug 20, 2026" },
  { initials: "NJ", name: "Nusrat Jahan", test: "Writing", testTitle: "Writing Task 2 Assessment", score: "—", band: "7.5", date: "Aug 19, 2026" },
  { initials: "TH", name: "Tanvir Hasan", test: "Speaking", testTitle: "Speaking Practice Test 03", score: "—", band: "7.0", date: "Aug 19, 2026" },
  { initials: "MI", name: "Mahin Islam", test: "Academic Reading", testTitle: "Reading Practice Test 04", score: "22/40", band: "5.5", bandLow: true, date: "Aug 18, 2026" },
];

const activity: ActivityRow[] = [
  { dotClass: "a1", text: 'Nadia Karim published "IELTS Writing Task 2"', time: "32 minutes ago", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { dotClass: "a2", text: "14 new students registered today", time: "1 hour ago", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
  { dotClass: "a3", text: "3 new support tickets awaiting reply", time: "2 hours ago", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 2-2 3.5M12 17h.01"/></svg> },
  { dotClass: "a1", text: 'Michael Anderson created "Listening Mock Test 05"', time: "4 hours ago", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  { dotClass: "a2", text: 'Announcement "Free Writing Workshop" published', time: "Yesterday", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l18-5v12L3 14v-3z"/></svg> },
];

export default function AdminDashboardPage() {
  const admin = useAdmin();
  const growthRef = useRef<HTMLCanvasElement>(null);
  const activityChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const forestGreen = "#134F2D";
    const teal = "#41957D";
    const grayGrid = "#E4E8DF";
    const charts: Chart[] = [];

    if (growthRef.current) {
      charts.push(
        new Chart(growthRef.current, {
          type: "line",
          data: {
            labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
            datasets: [
              {
                label: "Students",
                data: [3120, 3480, 3810, 4150, 4520, 4812],
                borderColor: forestGreen,
                backgroundColor: "rgba(19,79,45,0.08)",
                fill: true,
                tension: 0.35,
                pointRadius: 3,
                pointBackgroundColor: forestGreen,
                borderWidth: 2.5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: grayGrid }, ticks: { font: { size: 10.5 }, color: "#6E7A72" } },
              x: { grid: { display: false }, ticks: { font: { size: 10.5 }, color: "#6E7A72" } },
            },
          },
        })
      );
    }

    if (activityChartRef.current) {
      charts.push(
        new Chart(activityChartRef.current, {
          type: "bar",
          data: {
            labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"],
            datasets: [
              {
                label: "Tests Taken",
                data: [720, 810, 690, 940, 1020, 880, 1150, 1240],
                backgroundColor: teal,
                borderRadius: 5,
                maxBarThickness: 34,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: grayGrid }, ticks: { font: { size: 10.5 }, color: "#6E7A72" } },
              x: { grid: { display: false }, ticks: { font: { size: 10.5 }, color: "#6E7A72" } },
            },
          },
        })
      );
    }

    return () => {
      charts.forEach((c) => c.destroy());
    };
  }, []);

  return (
    <>
      <AdminTopbar
        breadcrumb="Admin / Dashboard"
        title="Overview"
        firstName={admin.firstName}
        lastName={admin.lastName}
      />

    <div className="content">

      {/* QUICK ACTIONS */}
      <div className="quick-actions">
        {quickActions.map((qa) => (
          <div className={`qa-btn ${qa.primary ? "primary" : ""}`} key={qa.label}>
            {qa.icon}
            {qa.label}
          </div>
        ))}
      </div>

      {/* STAT GRID */}
      <div className="stat-grid">
        {statCards.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-top"><div className={`stat-icon ${s.iconClass}`}>{s.icon}</div><span className="stat-trend">{s.trend}</span></div>
            <div className="stat-val">{s.value}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="chart-grid">
        <div className="panel">
          <div className="panel-head">
            <div><h3>Student Growth</h3><div className="sub">Registered students over time</div></div>
            <div className="tab-group">
              <button className="active">6M</button>
              <button>1Y</button>
              <button>All</button>
            </div>
          </div>
          <div className="chart-wrap"><canvas ref={growthRef}></canvas></div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div><h3>Average Band by Skill</h3><div className="sub">Across all students, current term</div></div>
          </div>
          {bandSkillRows.map((row) => (
            <div className="band-skill-row" key={row.name}>
              <div className="band-skill-name">{row.name}</div>
              <div className="band-skill-track"><div className="band-skill-fill" style={{width: `${row.pct}%`, background: row.color}}></div></div>
              <div className="band-skill-val">{row.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-grid-2">
        <div className="panel">
          <div className="panel-head">
            <div><h3>Test Activity</h3><div className="sub">Tests taken per week, last 8 weeks</div></div>
          </div>
          <div className="chart-wrap" style={{height: '180px'}}><canvas ref={activityChartRef}></canvas></div>
        </div>
      </div>

      {/* BOTTOM: table + activity */}
      <div className="bottom-grid">
        <div className="panel table-panel">
          <div className="panel-head"><div><h3>Recent Test Attempts</h3><div className="sub">Latest submissions across all students</div></div><a href="#" style={{fontSize: '11.5px', fontWeight: 700, color: 'var(--teal-500)'}}>View all results</a></div>
          <table>
            <thead><tr><th>Student</th><th>Test</th><th>Score</th><th>Band</th><th>Date</th></tr></thead>
            <tbody>
              {testAttempts.map((row) => (
                <tr key={row.name}>
                  <td><div className="student-cell"><div className="mini-av">{row.initials}</div><div><div className="student-name">{row.name}</div><div className="student-test">{row.test}</div></div></div></td>
                  <td>{row.testTitle}</td>
                  <td>{row.score}</td>
                  <td><span className={`band-pill ${row.bandLow ? "low" : ""}`}>{row.band}</span></td>
                  <td className="table-date">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-head"><div><h3>Recent Activity</h3></div></div>
          {activity.map((a, i) => (
            <div className="activity-item" key={i}>
              <div className={`activity-dot ${a.dotClass}`}>{a.icon}</div>
              <div><div className="activity-text">{a.text}</div><div className="activity-time">{a.time}</div></div>
            </div>
          ))}
        </div>
      </div>

    </div>
    </>
  );
}
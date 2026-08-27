"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Chart from "chart.js/auto";
import "./student-progress.css";

type Skill = "listening" | "reading" | "writing" | "speaking";

interface SkillStat {
  skill: Skill;
  improve: string;
  improveColor?: string;
  band: string;
  barPct: number;
  barColor?: string;
  icon: React.ReactElement;
}

interface TestRow {
  title: string;
  skill: Skill;
  date: string;
  score: string;
  band: string;
  status: "completed" | "pending";
  statusLabel: string;
}

const skillIcons: Record<Skill, React.ReactElement> = {
  listening: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
  ),
  reading: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H12v18H4.5A2.5 2.5 0 0 1 2 18.5z"/><path d="M22 5.5A2.5 2.5 0 0 0 19.5 3H12v18h7.5a2.5 2.5 0 0 0 2.5-2.5z"/></svg>
  ),
  writing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
  ),
  speaking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4"/></svg>
  ),
};

const skillStats: SkillStat[] = [
  { skill: "listening", improve: "▲ 0.5", band: "7.0", barPct: 78, barColor: "var(--blue)", icon: skillIcons.listening },
  { skill: "reading", improve: "▲ 0.5", band: "6.5", barPct: 70, icon: skillIcons.reading },
  { skill: "writing", improve: "▲ 0.0", improveColor: "var(--amber)", band: "6.0", barPct: 60, barColor: "var(--amber)", icon: skillIcons.writing },
  { skill: "speaking", improve: "▲ 0.5", band: "6.5", barPct: 70, barColor: "var(--purple)", icon: skillIcons.speaking },
];

const testHistory: TestRow[] = [
  { title: "Academic Reading Practice Test 01", skill: "reading", date: "Aug 20, 2026", score: "34/40", band: "7.0", status: "completed", statusLabel: "Completed" },
  { title: "Listening Mock Test 02", skill: "listening", date: "Aug 15, 2026", score: "29/40", band: "6.5", status: "completed", statusLabel: "Completed" },
  { title: "Writing Task 2 Assessment", skill: "writing", date: "Aug 12, 2026", score: "—", band: "6.0", status: "pending", statusLabel: "Awaiting Review" },
  { title: "Speaking Practice Test 03", skill: "speaking", date: "Aug 8, 2026", score: "—", band: "6.5", status: "completed", statusLabel: "Completed" },
  { title: "Academic Reading Practice Test 04", skill: "reading", date: "Jul 30, 2026", score: "26/40", band: "6.0", status: "completed", statusLabel: "Completed" },
  { title: "Listening Mock Test 05", skill: "listening", date: "Jul 22, 2026", score: "25/40", band: "6.0", status: "completed", statusLabel: "Completed" },
];

const skillLabel: Record<Skill, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

export default function ProgressPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: ["Test 1", "Test 2", "Test 3", "Test 4", "Test 5", "Test 6", "Test 7", "Test 8"],
        datasets: [
          {
            label: "Overall Band",
            data: [5.5, 5.5, 6.0, 6.0, 6.5, 6.5, 6.5, 7.0],
            borderColor: "#134F2D",
            backgroundColor: "rgba(19,79,45,0.08)",
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: "#134F2D",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 4, max: 9, grid: { color: "#E4E8DF" }, ticks: { stepSize: 1, font: { size: 11 }, color: "#6E7A72" } },
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#6E7A72" } },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return (
    <div className="content">
      <div className="page-header">
        <h1>Results &amp; Progress</h1>
        <p>Track your band score journey across every skill and test attempt.</p>
      </div>

      {/* BAND SUMMARY */}
      <div className="band-summary">
        <div className="bs-left">
          <h2>Band Score Journey</h2>
          <div className="bs-numbers">
            <span className="curr">6.5</span>
            <span className="arrow">→</span>
            <span className="tgt">7.5</span>
            <div className="lbl-col"><span>Current</span><span style={{marginTop: '22px'}}>Target</span></div>
          </div>
          <div className="ruler-track"><div className="ruler-fill" style={{width: '72.2%'}}></div></div>
          <div className="ruler-ticks"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>
        </div>
        <div className="bs-right">
          <div className="val">+1.0</div>
          <div className="lbl">Overall Improvement</div>
          <div className="delta">▲ Since you started, Mar 2026</div>
        </div>
      </div>

      {/* SKILL CARDS */}
      <div className="skills-grid">
        {skillStats.map((s) => (
          <div className="skill-card" key={s.skill}>
            <div className="skill-top">
              <div className={`skill-icon ${s.skill}`}>{s.icon}</div>
              <span className="skill-improve" style={s.improveColor ? {color: s.improveColor} : undefined}>{s.improve}</span>
            </div>
            <div className="skill-name">{skillLabel[s.skill]}</div>
            <div className="skill-band">{s.band}</div>
            <div className="bar-track"><div className="bar-fill" style={{width: `${s.barPct}%`, ...(s.barColor ? {background: s.barColor} : {})}}></div></div>
          </div>
        ))}
      </div>

      {/* BAND HISTORY CHART */}
      <div className="panel">
        <div className="panel-head">
          <div><h3>Band Score History</h3><div className="sub">Overall band across your last 8 test attempts</div></div>
          <div className="tab-group">
            <button className="active">Overall</button>
            <button>By Skill</button>
          </div>
        </div>
        <div className="chart-wrap"><canvas ref={canvasRef}></canvas></div>
      </div>

      {/* TEST HISTORY TABLE */}
      <div className="panel">
        <div className="panel-head">
          <div><h3>Test History</h3><div className="sub">Every practice test you&apos;ve attempted</div></div>
        </div>
        <div className="filter-bar">
          <div className="filter-select">Skill: All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
          <div className="filter-select">Test Type: All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
          <div className="filter-select">Date: Last 3 months <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
        </div>
        <table>
          <thead><tr><th>Test</th><th>Skill</th><th>Date</th><th>Score</th><th>Band</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {testHistory.map((row) => (
              <tr key={row.title}>
                <td>{row.title}</td>
                <td><div className="skill-cell"><span className={`skill-dot ${row.skill}`}></span>{skillLabel[row.skill]}</div></td>
                <td>{row.date}</td>
                <td>{row.score}</td>
                <td><span className="band-pill">{row.band}</span></td>
                <td><span className={`status-pill ${row.status}`}>{row.statusLabel}</span></td>
                <td><Link href="/test-result" className="link-action">View Result</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
"use client";

import Link from "next/link";
import { useState } from "react";
import "./course-detail.css";

type LessonType = "Video" | "PDF" | "Notes";

interface Lesson {
  name: string;
  type: LessonType;
  done: boolean;
}

interface Module {
  id: number;
  title: string;
  meta: string;
  status: "done" | "progress" | "locked";
  progressPct: number;
  lessons: Lesson[];
}

const modules: Module[] = [
  {
    id: 1,
    title: "Module 01 — Introduction",
    meta: "4 lessons · Completed",
    status: "done",
    progressPct: 100,
    lessons: [
      { name: "Understanding the Reading Paper Format", type: "Video", done: true },
      { name: "Skimming vs. Scanning Techniques", type: "Video", done: true },
      { name: "Time Management Strategies", type: "PDF", done: true },
      { name: "Module 01 Quick Check", type: "Notes", done: true },
    ],
  },
  {
    id: 2,
    title: "Module 02 — Basic Skills",
    meta: "5 lessons · Completed",
    status: "done",
    progressPct: 100,
    lessons: [
      { name: "True / False / Not Given Questions", type: "Video", done: true },
      { name: "Matching Headings", type: "Video", done: true },
      { name: "Sentence Completion", type: "PDF", done: true },
      { name: "Practice Set A", type: "Notes", done: true },
      { name: "Module 02 Quick Check", type: "Notes", done: true },
    ],
  },
  {
    id: 3,
    title: "Module 03 — Intermediate Practice",
    meta: "6 lessons · In progress",
    status: "progress",
    progressPct: 50,
    lessons: [
      { name: "Matching Information", type: "Video", done: true },
      { name: "Summary Completion", type: "Video", done: true },
      { name: "Diagram Labeling", type: "PDF", done: true },
      { name: "Multiple Choice Deep Dive", type: "Video", done: false },
      { name: "Practice Set B", type: "Notes", done: false },
      { name: "Module 03 Quick Check", type: "Notes", done: false },
    ],
  },
  {
    id: 4,
    title: "Module 04 — Advanced Practice",
    meta: "5 lessons · Locked",
    status: "locked",
    progressPct: 0,
    lessons: [
      { name: "Full-Length Timed Passage 1", type: "Video", done: false },
      { name: "Full-Length Timed Passage 2", type: "Video", done: false },
      { name: "Full-Length Timed Passage 3", type: "Video", done: false },
      { name: "Error Review Workshop", type: "Notes", done: false },
      { name: "Module 04 Quick Check", type: "Notes", done: false },
    ],
  },
  {
    id: 5,
    title: "Module 05 — Final Assessment",
    meta: "4 lessons · Locked",
    status: "locked",
    progressPct: 0,
    lessons: [
      { name: "Full Mock Reading Test", type: "Video", done: false },
      { name: "Score Review Session", type: "Notes", done: false },
      { name: "Band Feedback from Teacher", type: "Notes", done: false },
      { name: "Certificate of Completion", type: "PDF", done: false },
    ],
  },
];

const statusIcon = {
  done: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
  ),
  progress: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  ),
  locked: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
  ),
};

export default function CourseDetailPage() {
  const [openModules, setOpenModules] = useState<number[]>([1, 2, 3]);

  const toggleModule = (id: number) => {
    setOpenModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="content">
      <div className="breadcrumb-row">
        <Link href="/student/courses">Courses</Link><span className="sep">/</span><span className="curr">IELTS Academic Reading Mastery</span>
      </div>

      {/* HERO */}
      <div className="course-hero">
        <div className="hero-left">
          <div className="hero-badges">
            <span className="hero-badge">Intermediate</span>
            <span className="hero-badge">Reading</span>
          </div>
          <h1>IELTS Academic Reading Mastery</h1>
          <p>Master skimming, scanning, and the seven core question types used in the Academic Reading paper — with timed drills modeled on real exam passages.</p>
          <div className="hero-meta">
            <div className="hero-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg>Dr. Sarah Rahman</div>
            <div className="hero-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>6 weeks</div>
            <div className="hero-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>5 modules · 24 lessons</div>
          </div>
        </div>
        <div className="hero-right">
          <div className="progress-ring-wrap">
            <div className="progress-ring-val">62%</div>
            <div className="progress-ring-lbl">Completed</div>
          </div>
          <Link href="/course-content" className="btn-continue-hero">Continue Learning</Link>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <div className="section-title">Course Modules</div>
          <div className="module-list">

            {modules.map((mod) => {
              const isOpen = openModules.includes(mod.id);
              return (
                <div key={mod.id} className={`module-card ${isOpen ? "open" : ""}`}>
                  <div className="module-head" onClick={() => toggleModule(mod.id)}>
                    <div className={`module-status-icon ${mod.status}`}>{statusIcon[mod.status]}</div>
                    <div className="module-info">
                      <div className="m-title">{mod.title}</div>
                      <div className="m-meta">{mod.meta}</div>
                    </div>
                    <div className="module-progress-mini"><div className="bar-track"><div className="bar-fill" style={{width: `${mod.progressPct}%`}}></div></div><span className="pct">{mod.progressPct}%</span></div>
                    <div className="expand-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
                  </div>
                  <div className="module-lessons">
                    {mod.lessons.map((lesson) => (
                      <div key={lesson.name} className={`lesson-row ${lesson.done ? "done" : ""}`}>
                        <svg viewBox="0 0 24 24" fill={lesson.done ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                        <span className="lname">{lesson.name}</span>
                        <span className="ltype">{lesson.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* SIDE PANEL */}
        <div>
          <div className="side-panel">
            <h3>Your Instructor</h3>
            <div className="teacher-card">
              <div className="teacher-av">SR</div>
              <div>
                <div className="teacher-name">Dr. Sarah Rahman</div>
                <div className="teacher-role">IELTS Reading Specialist</div>
              </div>
            </div>
          </div>

          <div className="side-panel">
            <h3>Course Information</h3>
            <div className="info-row"><span className="k">Level</span><span className="v">Intermediate</span></div>
            <div className="info-row"><span className="k">Duration</span><span className="v">6 weeks</span></div>
            <div className="info-row"><span className="k">Modules</span><span className="v">5</span></div>
            <div className="info-row"><span className="k">Total Lessons</span><span className="v">24</span></div>
            <div className="info-row"><span className="k">Enrollment</span><span className="v" style={{color: 'var(--forest-700)'}}>Enrolled</span></div>
            <div className="info-row"><span className="k">Your Progress</span><span className="v">62%</span></div>
          </div>
        </div>
      </div>

    </div>
  );
}
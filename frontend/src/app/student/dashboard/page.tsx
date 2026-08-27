"use client";

import "./dashboard.css";
import { useStudent } from "../StudentContext";

export default function StudentDashboard() {
  const student = useStudent();

  return (
    <div className="content">

      {/* HERO */}
      <div className="hero">
        <div className="hero-greeting">
          <h1>Good morning, {student.firstName} 👋</h1>
          <p>Keep working toward your IELTS goal — You&apos;re 1.0 band away.</p>
          <div className="hero-stats">
            <div className="hero-stat"><div className="val">78%</div><div className="lbl">Overall Progress</div></div>
            <div className="hero-stat"><div className="val">14</div><div className="lbl">Tests Completed</div></div>
            <div className="hero-stat"><div className="val">42</div><div className="lbl">Days Active</div></div>
          </div>
        </div>

        <div className="band-card">
          <div className="band-head">
            <h3>Band Score Journey</h3>
            <span className="delta">▲ 0.5 this month</span>
          </div>
          <div className="band-numbers">
            <span className="curr">6.5</span>
            <span className="arrow">→</span>
            <span className="tgt">7.5</span>
            <div className="lbl-col">
              <span>Current</span>
              <span style={{marginTop: '22px', color: 'var(--teal-500)'}}>Target</span>
            </div>
          </div>
          <div className="ruler">
            <div className="ruler-track">
              <div className="ruler-fill" style={{width: '72.2%'}}></div>
              <div className="ruler-marker" style={{left: '72.2%'}} data-label="6.5"></div>
              <div className="ruler-marker target" style={{left: '83.3%'}} data-label="7.5"></div>
            </div>
            <div className="ruler-ticks">
              <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>
            </div>
          </div>
        </div>
      </div>

      {/* SKILL PROGRESS */}
      <div className="section">
        <div className="section-head"><h2>Skill Progress</h2><a href="#" className="view-all">View details</a></div>
        <div className="skills-grid">
          <div className="skill-card">
            <div className="skill-top">
              <div className="skill-icon listening"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg></div>
              <span className="skill-improve">▲ 0.5</span>
            </div>
            <div className="skill-name">Listening</div>
            <div className="skill-band">7.0</div>
            <div className="bar-track"><div className="bar-fill" style={{width: '75%'}}></div></div>
          </div>
          <div className="skill-card">
            <div className="skill-top">
              <div className="skill-icon reading"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H12v18H4.5A2.5 2.5 0 0 1 2 18.5z"/><path d="M22 5.5A2.5 2.5 0 0 0 19.5 3H12v18h7.5a2.5 2.5 0 0 0 2.5-2.5z"/></svg></div>
              <span className="skill-improve">▲ 0.5</span>
            </div>
            <div className="skill-name">Reading</div>
            <div className="skill-band">6.5</div>
            <div className="bar-track"><div className="bar-fill" style={{width: '70%'}}></div></div>
          </div>
          <div className="skill-card">
            <div className="skill-top">
              <div className="skill-icon writing"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></div>
              <span className="skill-improve" style={{color: 'var(--amber)'}}>▲ 0.0</span>
            </div>
            <div className="skill-name">Writing</div>
            <div className="skill-band">6.0</div>
            <div className="bar-track"><div className="bar-fill" style={{width: '60%', background: 'var(--amber)'}}></div></div>
          </div>
          <div className="skill-card">
            <div className="skill-top">
              <div className="skill-icon speaking"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4"/></svg></div>
              <span className="skill-improve">▲ 0.5</span>
            </div>
            <div className="skill-name">Speaking</div>
            <div className="skill-band">6.5</div>
            <div className="bar-track"><div className="bar-fill" style={{width: '70%', background: '#8E51C9'}}></div></div>
          </div>
        </div>
      </div>

      {/* CONTINUE LEARNING */}
      <div className="section">
        <div className="section-head"><h2>Continue Learning</h2><a href="#" className="view-all">View all courses</a></div>
        <div className="row-scroll">
          <div className="course-card">
            <div className="course-cover"><span className="badge">Intermediate</span><span className="type">Video</span></div>
            <div className="course-body">
              <div className="course-title">IELTS Academic Reading Mastery</div>
              <div className="course-meta">Dr. Sarah Rahman · Module 3 of 5</div>
              <div className="course-progress-row"><div className="bar-track"><div className="bar-fill" style={{width: '62%'}}></div></div><span className="pct">62%</span></div>
              <div className="btn-continue">Continue Learning</div>
            </div>
          </div>
          <div className="course-card">
            <div className="course-cover" style={{background: 'linear-gradient(120deg, var(--forest-600), #3372C4)'}}><span className="badge">Foundation</span><span className="type">PDF</span></div>
            <div className="course-body">
              <div className="course-title">IELTS Listening Foundations</div>
              <div className="course-meta">Michael Anderson · Module 2 of 4</div>
              <div className="course-progress-row"><div className="bar-track"><div className="bar-fill" style={{width: '40%', background: '#3372C4'}}></div></div><span className="pct">40%</span></div>
              <div className="btn-continue">Continue Learning</div>
            </div>
          </div>
          <div className="course-card">
            <div className="course-cover" style={{background: 'linear-gradient(120deg, #8E51C9, var(--teal-500))'}}><span className="badge">Advanced</span><span className="type">Notes</span></div>
            <div className="course-body">
              <div className="course-title">IELTS Writing Task 2</div>
              <div className="course-meta">Nadia Karim · Module 4 of 6</div>
              <div className="course-progress-row"><div className="bar-track"><div className="bar-fill" style={{width: '25%', background: '#8E51C9'}}></div></div><span className="pct">25%</span></div>
              <div className="btn-continue">Continue Learning</div>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED PRACTICE */}
      <div className="section">
        <div className="section-head"><h2>Recommended Practice</h2><a href="#" className="view-all">View all tests</a></div>
        <div className="practice-grid">
          <div className="practice-card">
            <div className="practice-top"><span className="practice-skill">Reading</span><span className="diff-tag med">Medium</span></div>
            <div className="practice-meta"><span>⏱ 60 min</span><span>📝 40 Qs</span></div>
            <div className="btn-start">Start Test</div>
          </div>
          <div className="practice-card">
            <div className="practice-top"><span className="practice-skill">Listening</span><span className="diff-tag easy">Easy</span></div>
            <div className="practice-meta"><span>⏱ 30 min</span><span>📝 40 Qs</span></div>
            <div className="btn-start">Start Test</div>
          </div>
          <div className="practice-card">
            <div className="practice-top"><span className="practice-skill">Writing</span><span className="diff-tag hard">Hard</span></div>
            <div className="practice-meta"><span>⏱ 40 min</span><span>📝 2 Tasks</span></div>
            <div className="btn-start">Start Test</div>
          </div>
          <div className="practice-card">
            <div className="practice-top"><span className="practice-skill">Speaking</span><span className="diff-tag med">Medium</span></div>
            <div className="practice-meta"><span>⏱ 14 min</span><span>📝 3 Parts</span></div>
            <div className="btn-start">Start Test</div>
          </div>
        </div>
      </div>

      {/* DAILY CONTENT */}
      <div className="section">
        <div className="section-head"><h2>Daily Content</h2></div>
        <div className="daily-grid">
          <div className="daily-card">
            <div className="daily-eyebrow">Word of the Day</div>
            <div className="daily-word">Meticulous</div>
            <div className="daily-sub">(adj.) showing great attention to detail. &quot;She was meticulous in checking her Task 1 report for errors.&quot;</div>
          </div>
          <div className="daily-card">
            <div className="daily-eyebrow">Daily Situation</div>
            <div className="daily-word">At the Airport</div>
            <div className="daily-sub">Practice check-in and immigration dialogue phrases commonly used in Speaking Part 2.</div>
          </div>
          <div className="daily-card">
            <div className="daily-eyebrow">Mini Challenge</div>
            <div className="daily-word">3-Minute Cue Card</div>
            <div className="daily-sub">Describe a skill you would like to learn. Record and review your fluency today.</div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="bottom-grid">
        <div className="panel">
          <h3>Announcements</h3>
          <div className="ann-item"><div className="ann-dot"></div><div><div className="ann-title">New Speaking mock tests added</div><div className="ann-date">Aug 18, 2026</div></div></div>
          <div className="ann-item"><div className="ann-dot"></div><div><div className="ann-title">Platform maintenance, Sat 2–4 AM</div><div className="ann-date">Aug 16, 2026</div></div></div>
          <div className="ann-item"><div className="ann-dot"></div><div><div className="ann-title">Free Writing workshop this Friday</div><div className="ann-date">Aug 14, 2026</div></div></div>
        </div>

        <div className="panel">
          <h3>Upcoming Live Classes</h3>
          <div className="live-item">
            <div className="live-dot">AUG<br />22</div>
            <div className="live-info"><div className="t">Writing Task 2 — Argument Essays</div><div className="s">Nadia Karim · 6:00 PM</div></div>
          </div>
          <div className="live-item">
            <div className="live-dot">AUG<br />24</div>
            <div className="live-info"><div className="t">Speaking Part 2 Practice Room</div><div className="s">Dr. Sarah Rahman · 7:30 PM</div></div>
          </div>
        </div>

        <div className="panel">
          <h3>Recent Test Results</h3>
          <table className="result-table">
            <thead><tr><th>Test</th><th>Skill</th><th>Band</th></tr></thead>
            <tbody>
              <tr><td>Academic Reading Practice Test 01</td><td>Reading</td><td><span className="band-pill">6.5</span></td></tr>
              <tr><td>Listening Mock Test 02</td><td>Listening</td><td><span className="band-pill">7.0</span></td></tr>
              <tr><td>Writing Task 2 Assessment</td><td>Writing</td><td><span className="band-pill">6.0</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
import Link from "next/link";
import "./courses.css";

export default function CoursesPage() {
  return (
    <div className="content">
      <div className="page-header">
        <h1>Courses</h1>
        <p>Build your IELTS skills with structured learning.</p>
      </div>

      <div className="cat-tabs">
        <div className="cat-tab active">All Courses</div>
        <div className="cat-tab">Listening</div>
        <div className="cat-tab">Reading</div>
        <div className="cat-tab">Writing</div>
        <div className="cat-tab">Speaking</div>
        <div className="cat-tab">Grammar</div>
        <div className="cat-tab">Vocabulary</div>
      </div>

      <div className="filter-bar">
        <div className="search-field">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input type="text" placeholder="Search courses…" />
        </div>
        <div className="filter-select">Level: All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
        <div className="filter-select">Category: All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
        <div className="filter-select">Enrollment: All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
      </div>

      <div className="course-grid">

        {/* Card 1: Enrolled */}
        <div className="course-card">
          <div className="course-cover" style={{background: 'linear-gradient(120deg, var(--forest-700), var(--teal-500))'}}>
            <span className="badge">Intermediate</span>
            <span className="skill-tag" style={{color: 'var(--teal-500)'}}>Reading</span>
          </div>
          <div className="course-body">
            <div className="course-title">IELTS Academic Reading Mastery</div>
            <div className="course-desc">Master skimming, scanning, and the seven core question types used in the Academic Reading paper.</div>
            <div className="course-meta-row">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg>Dr. Sarah Rahman</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>6 weeks</span>
            </div>
            <div className="enroll-status enrolled">Enrolled</div>
            <div className="course-progress-row"><div className="bar-track"><div className="bar-fill" style={{width: '62%'}}></div></div><span className="pct">62%</span></div>
            <Link href="/student/course-detail" className="btn-view">Continue Learning</Link>
          </div>
        </div>

        {/* Card 2: Enrolled */}
        <div className="course-card">
          <div className="course-cover" style={{background: 'linear-gradient(120deg, var(--forest-600), var(--blue))'}}>
            <span className="badge">Foundation</span>
            <span className="skill-tag" style={{color: 'var(--blue)'}}>Listening</span>
          </div>
          <div className="course-body">
            <div className="course-title">IELTS Listening Foundations</div>
            <div className="course-desc">Build core listening stamina with map labeling, form completion, and multiple-choice drills.</div>
            <div className="course-meta-row">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg>Michael Anderson</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>4 weeks</span>
            </div>
            <div className="enroll-status enrolled">Enrolled</div>
            <div className="course-progress-row"><div className="bar-track"><div className="bar-fill" style={{width: '40%', background: 'var(--blue)'}}></div></div><span className="pct">40%</span></div>
            <Link href="/student/course-detail" className="btn-view">Continue Learning</Link>
          </div>
        </div>

        {/* Card 3: Enrolled */}
        <div className="course-card">
          <div className="course-cover" style={{background: 'linear-gradient(120deg, var(--purple), var(--teal-500))'}}>
            <span className="badge">Advanced</span>
            <span className="skill-tag" style={{color: 'var(--purple)'}}>Writing</span>
          </div>
          <div className="course-body">
            <div className="course-title">IELTS Writing Task 2</div>
            <div className="course-desc">Learn argument structuring, cohesive devices, and band-9 essay strategies for Task 2 essays.</div>
            <div className="course-meta-row">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg>Nadia Karim</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>8 weeks</span>
            </div>
            <div className="enroll-status enrolled">Enrolled</div>
            <div className="course-progress-row"><div className="bar-track"><div className="bar-fill" style={{width: '25%', background: 'var(--purple)'}}></div></div><span className="pct">25%</span></div>
            <Link href="/student/course-detail" className="btn-view">Continue Learning</Link>
          </div>
        </div>

        {/* Card 4: Not enrolled */}
        <div className="course-card">
          <div className="course-cover" style={{background: 'linear-gradient(120deg, var(--amber), var(--clay))'}}>
            <span className="badge">Intermediate</span>
            <span className="skill-tag" style={{color: 'var(--purple)'}}>Speaking</span>
          </div>
          <div className="course-body">
            <div className="course-title">IELTS Speaking Confidence</div>
            <div className="course-desc">Practice all three speaking parts with fluency drills, cue cards, and pronunciation coaching.</div>
            <div className="course-meta-row">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg>Dr. Sarah Rahman</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>5 weeks</span>
            </div>
            <div className="enroll-status not-enrolled">Not Enrolled</div>
            <Link href="/student/course-detail" className="btn-view outline">View Course</Link>
          </div>
        </div>

        {/* Card 5: Not enrolled */}
        <div className="course-card">
          <div className="course-cover" style={{background: 'linear-gradient(120deg, var(--forest-700), var(--forest-600))'}}>
            <span className="badge">Foundation</span>
            <span className="skill-tag" style={{color: 'var(--forest-700)'}}>Grammar</span>
          </div>
          <div className="course-body">
            <div className="course-title">IELTS Grammar Essentials</div>
            <div className="course-desc">Fix the most common grammar errors that cost band points in Writing and Speaking.</div>
            <div className="course-meta-row">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg>Michael Anderson</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>3 weeks</span>
            </div>
            <div className="enroll-status not-enrolled">Not Enrolled</div>
            <Link href="/student/course-detail" className="btn-view outline">View Course</Link>
          </div>
        </div>

        {/* Card 6: Not enrolled */}
        <div className="course-card">
          <div className="course-cover" style={{background: 'linear-gradient(120deg, var(--clay), var(--amber))'}}>
            <span className="badge">All Levels</span>
            <span className="skill-tag" style={{color: 'var(--clay)'}}>Vocabulary</span>
          </div>
          <div className="course-body">
            <div className="course-title">IELTS Vocabulary Builder</div>
            <div className="course-desc">Expand topic-based vocabulary for higher-band lexical resource across all four skills.</div>
            <div className="course-meta-row">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg>Nadia Karim</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>6 weeks</span>
            </div>
            <div className="enroll-status not-enrolled">Not Enrolled</div>
            <Link href="/student/course-detail" className="btn-view outline">View Course</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
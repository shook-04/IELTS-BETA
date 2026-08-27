import Image from "next/image";
import Link from "next/link";
import "./landing.css";

export default function LandingPage() {
  return (
<>

  {/* NAV */}
  <nav className="nav">
    <div className="nav-inner">
      <Link href="/" className="nav-brand">
        <Image
          src="/images/ielts-beta-logo.jpg"
          alt="IELTS Beta logo"
          width={36}
          height={36}
          priority
        />
        <span className="name">IELTS Beta</span>
      </Link>
      <div className="nav-links">
        <Link href="/courses">Courses</Link>
        <Link href="/tests">Practice Tests</Link>
        <a href="#pricing">Pricing</a>
        <a href="#about">About</a>
      </div>
      <div className="nav-actions">
        <Link href="/login" className="btn-ghost">Log in</Link>
        <Link href="/register" className="btn-primary">Get Started Free</Link>
      </div>
    </div>
  </nav>

  {/* HERO */}
  <section className="hero">
    <div className="wrap hero-grid">
      <div>
        <div className="hero-eyebrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h7v8l11-14h-8z"/></svg>
          Trusted by 4,800+ IELTS learners
        </div>
        <h1>Reach your target <span className="accent">band score</span>, one skill at a time.</h1>
        <p className="lead">IELTS Beta combines structured courses, realistic mock tests, and live classes so you always know exactly what to practice next.</p>
        <div className="hero-cta-row">
          <a href="/register" className="btn-hero-primary">
            Start Free Today
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="/tests" className="btn-hero-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z"/></svg>
            Try a Free Mock Test
          </a>
        </div>
        <div className="hero-trust">
          <div className="avatar-stack">
            <div className="av" style={{background: '#3372C4'}}>SA</div>
            <div className="av" style={{background: '#8E51C9'}}>AR</div>
            <div className="av" style={{background: 'var(--forest-700)'}}>NJ</div>
            <div className="av" style={{background: 'var(--amber)'}}>TH</div>
          </div>
          <div className="hero-trust-text"><b>4,800+</b> students improved their band score with IELTS Beta</div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="float-card fc1">
          <div className="fc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></div>
          <div><div className="fc-t">Test Completed</div><div className="fc-s">Band 7.0 achieved</div></div>
        </div>
        <div className="mock-card">
          <div className="mock-top">
            <span className="who">Arafat Rahman&apos;s Progress</span>
            <div className="mock-dots"><span></span><span></span><span></span></div>
          </div>
          <div className="mock-band-row">
            <span className="curr">6.5</span><span className="arrow">→</span><span className="tgt">7.5</span>
          </div>
          <div className="mock-ruler-track"><div className="mock-ruler-fill"></div></div>
          <div className="mock-skills">
            <div className="mock-skill"><div className="lbl">Listen</div><div className="val">7.0</div></div>
            <div className="mock-skill"><div className="lbl">Read</div><div className="val">6.5</div></div>
            <div className="mock-skill"><div className="lbl">Write</div><div className="val">6.0</div></div>
            <div className="mock-skill"><div className="lbl">Speak</div><div className="val">6.5</div></div>
          </div>
        </div>
        <div className="float-card fc2">
          <div className="fc-icon" style={{background: '#EAF4FF', color: 'var(--blue)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 10l5-3v10l-5-3"/></svg></div>
          <div><div className="fc-t">Live Class Today</div><div className="fc-s">Writing Task 2 · 6 PM</div></div>
        </div>
      </div>
    </div>
  </section>

  {/* STATS STRIP */}
  <div className="stats-strip">
    <div className="wrap stats-strip-grid">
      <div><div className="val">4,800+</div><div className="lbl">Active Students</div></div>
      <div><div className="val">142</div><div className="lbl">Structured Courses</div></div>
      <div><div className="val">368</div><div className="lbl">Practice Tests</div></div>
      <div><div className="val">+1.0</div><div className="lbl">Avg. Band Improvement</div></div>
    </div>
  </div>

  {/* FEATURES */}
  <section className="section">
    <div className="wrap">
      <div className="section-head">
        <div className="section-eyebrow">Why IELTS Beta</div>
        <h2>Everything you need to hit your target band</h2>
        <p>One platform for structured learning, realistic practice, live coaching, and clear progress tracking.</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon f1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
          <h3>Structured Courses</h3>
          <p>Module-by-module learning across Listening, Reading, Writing, and Speaking — built by certified IELTS instructors.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon f2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
          <h3>Realistic Mock Tests</h3>
          <p>Timed practice tests scored exactly the way the real exam is scored, with detailed band-level feedback.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon f3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 10l5-3v10l-5-3"/></svg></div>
          <h3>Live Classes</h3>
          <p>Join live sessions with expert teachers for real-time speaking practice, feedback, and Q&amp;A.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon f4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-4"/></svg></div>
          <h3>Progress Tracking</h3>
          <p>Watch your band score move from where you start to where you&apos;re headed, skill by skill.</p>
        </div>
      </div>
    </div>
  </section>

  {/* SKILLS */}
  <section className="skills-section">
    <div className="wrap">
      <div className="section-head">
        <div className="section-eyebrow" style={{color: 'var(--teal-400)'}}>All Four Skills</div>
        <h2>Practice built around the real exam</h2>
        <p>Every skill has its own dedicated practice format, modeled on the actual IELTS test structure.</p>
      </div>
      <div className="skills-grid-pub">
        <div className="skill-pub-card">
          <div className="skill-pub-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg></div>
          <h3>Listening</h3>
          <p>Map labeling, form completion, and multiple-choice drills across four real exam sections.</p>
          <div className="skill-pub-stat">120+ practice tests</div>
        </div>
        <div className="skill-pub-card">
          <div className="skill-pub-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H12v18H4.5A2.5 2.5 0 0 1 2 18.5z"/><path d="M22 5.5A2.5 2.5 0 0 0 19.5 3H12v18h7.5a2.5 2.5 0 0 0 2.5-2.5z"/></svg></div>
          <h3>Reading</h3>
          <p>Skimming, scanning, and all seven core question types from the Academic and General papers.</p>
          <div className="skill-pub-stat">140+ practice tests</div>
        </div>
        <div className="skill-pub-card">
          <div className="skill-pub-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></div>
          <h3>Writing</h3>
          <p>Task 1 and Task 2 structuring, cohesive devices, and real feedback from certified teachers.</p>
          <div className="skill-pub-stat">60+ prompts &amp; model answers</div>
        </div>
        <div className="skill-pub-card">
          <div className="skill-pub-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4"/></svg></div>
          <h3>Speaking</h3>
          <p>All three speaking parts with fluency drills, cue cards, and pronunciation coaching.</p>
          <div className="skill-pub-stat">Live speaking rooms weekly</div>
        </div>
      </div>
    </div>
  </section>

  {/* HOW IT WORKS */}
  <section className="section">
    <div className="wrap">
      <div className="section-head">
        <div className="section-eyebrow">How It Works</div>
        <h2>From sign-up to your target band</h2>
        <p>A simple, structured path built around your current level and your goal.</p>
      </div>
      <div className="steps-row">
        <div className="step-item">
          <div className="step-num">1</div>
          <h3>Set your target band</h3>
          <p>Tell us your current level and the band score you&apos;re aiming for.</p>
        </div>
        <div className="step-item">
          <div className="step-num">2</div>
          <h3>Study &amp; practice</h3>
          <p>Work through structured courses and take realistic mock tests for every skill.</p>
        </div>
        <div className="step-item">
          <div className="step-num">3</div>
          <h3>Track your progress</h3>
          <p>Watch your band score improve with every test, and join live classes when you need extra help.</p>
        </div>
      </div>
    </div>
  </section>

  {/* COURSES PREVIEW */}
  <section className="section" style={{background: 'var(--cream)'}}>
    <div className="wrap">
      <div className="section-head">
        <div className="section-eyebrow">Popular Courses</div>
        <h2>Start with a course built for your level</h2>
        <p>A sample of the 140+ structured courses available on IELTS Beta.</p>
      </div>
      <div className="courses-preview-grid">
        <div className="cp-card">
          <div className="cp-cover" style={{background: 'linear-gradient(120deg, var(--forest-700), var(--teal-500))'}}><span className="badge">Intermediate</span></div>
          <div className="cp-body">
            <div className="cp-title">IELTS Academic Reading Mastery</div>
            <div className="cp-desc">Master skimming, scanning, and all core question types for the Academic Reading paper.</div>
            <div className="cp-meta"><span className="teacher">Dr. Sarah Rahman</span><span className="price">6 weeks</span></div>
          </div>
        </div>
        <div className="cp-card">
          <div className="cp-cover" style={{background: 'linear-gradient(120deg, var(--forest-600), var(--blue))'}}><span className="badge">Foundation</span></div>
          <div className="cp-body">
            <div className="cp-title">IELTS Listening Foundations</div>
            <div className="cp-desc">Build core listening stamina with map labeling, form completion, and MCQ drills.</div>
            <div className="cp-meta"><span className="teacher">Michael Anderson</span><span className="price">4 weeks</span></div>
          </div>
        </div>
        <div className="cp-card">
          <div className="cp-cover" style={{background: 'linear-gradient(120deg, var(--purple), var(--teal-500))'}}><span className="badge">Advanced</span></div>
          <div className="cp-body">
            <div className="cp-title">IELTS Writing Task 2</div>
            <div className="cp-desc">Learn argument structuring and band-9 essay strategies for Task 2 essays.</div>
            <div className="cp-meta"><span className="teacher">Nadia Karim</span><span className="price">8 weeks</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* TESTIMONIALS */}
  <section className="section">
    <div className="wrap">
      <div className="section-head">
        <div className="section-eyebrow">Student Stories</div>
        <h2>Real students, real band improvements</h2>
      </div>
      <div className="testimonial-grid">
        <div className="t-card">
          <div className="t-stars">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
          </div>
          <div className="t-quote">&quot;The practice tests felt exactly like the real exam. I went from 6.0 to 7.5 in ten weeks.&quot;</div>
          <div className="t-person">
            <div className="t-av" style={{background: 'var(--forest-700)'}}>NJ</div>
            <div><div className="t-name">Nusrat Jahan</div><div className="t-band">Band 6.0 → 7.5</div></div>
          </div>
        </div>
        <div className="t-card">
          <div className="t-stars">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
          </div>
          <div className="t-quote">&quot;I finally understood exactly which skill was holding my band back — the progress tracking made it obvious.&quot;</div>
          <div className="t-person">
            <div className="t-av" style={{background: 'var(--amber)'}}>TH</div>
            <div><div className="t-name">Tanvir Hasan</div><div className="t-band">Band 6.0 → 7.0</div></div>
          </div>
        </div>
        <div className="t-card">
          <div className="t-stars">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
          </div>
          <div className="t-quote">&quot;The live speaking classes gave me the confidence I needed. Highly recommend for anyone nervous about Part 2.&quot;</div>
          <div className="t-person">
            <div className="t-av" style={{background: 'var(--blue)'}}>SA</div>
            <div><div className="t-name">Sarah Ahmed</div><div className="t-band">Band 6.5 → 7.0</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* CTA BANNER */}
  <div className="cta-banner">
    <h2>Start your IELTS journey today</h2>
    <p>Join thousands of students already improving their band score with IELTS Beta.</p>
    <div className="cta-banner-btns">
      <a href="/register" className="btn-cta-white">Create Free Account</a>
      <a href="/tests" className="btn-cta-outline">Explore Practice Tests</a>
    </div>
  </div>

  {/* FOOTER */}
  <footer className="footer">
    <div className="wrap">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <Image
              src="/images/ielts-beta-logo.jpg"
              alt="IELTS Beta logo"
              width={34}
              height={34}
            />
            <span className="name">IELTS Beta</span>
          </div>
          <p className="footer-desc">A modern IELTS preparation, learning, testing, and progress-tracking platform for students, teachers, and institutions.</p>
        </div>
        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/tests">Practice Tests</a></li>
            <li><a href="#">Live Classes</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 IELTS Beta. All rights reserved.</span>
        <div className="footer-socials">
          <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
          <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/></svg></a>
          <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
        </div>
      </div>
    </div>
  </footer>

</>
  );
}

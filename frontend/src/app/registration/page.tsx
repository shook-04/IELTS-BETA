"use client";

import { useState } from "react";
import Image from "next/image";
import "./registration.css";

type Role = "Student" | "Teacher" | "Admin";

const ROLE_LABELS: Record<Role, string> = {
  Student: "Create Student Account",
  Teacher: "Create Teacher Account",
  Admin: "Request Admin Account",
};

const BANDS = ["6.0", "6.5", "7.0", "7.5", "8.0", "8.5+"];

// UI shows "8.5+" as a label, but the database stores a numeric target_band.
// "8.5+" is treated as the UI representation of 8.5 (or higher).
function bandToNumeric(uiBand: string): string {
  return uiBand === "8.5+" ? "8.5" : uiBand;
}

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("Student");
  const [band, setBand] = useState("7.0");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  function getPasswordStrength(value: string) {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[0-9]/.test(value) && /[a-zA-Z]/.test(value)) score++;
    if (/[^a-zA-Z0-9]/.test(value) && value.length >= 10) score++;

    if (value.length === 0) {
      return { level: "", label: "Use 8+ characters with a number and symbol" };
    }
    if (score <= 1) {
      return { level: "weak", label: "Weak — add numbers and symbols" };
    }
    if (score === 2) {
      return { level: "medium", label: "Medium — a bit more length helps" };
    }
    return { level: "strong", label: "Strong password" };
  }

  const strength = getPasswordStrength(password);
  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;

  function resetForm() {
    setRole("Student");
    setBand("7.0");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setDateOfBirth("");
    setGender("");
    setSpecialization("");
    setPassword("");
    setConfirmPassword("");
    setShowPw(false);
    setShowPw2(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (password !== confirmPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }

    if (role === "Student" && !band) {
      setSubmitError("Please select a target IELTS band.");
      return;
    }

    const payload: Record<string, unknown> = {
      role,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      password,
      confirmPassword,
    };

    if (role === "Student") {
      payload.targetBand = bandToNumeric(band);
    } else if (role === "Teacher") {
      payload.specialization = specialization || undefined;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = "Registration failed. Please try again.";
        try {
          const errorBody = await res.json();
          if (errorBody?.message) {
            message = errorBody.message;
          }
        } catch {
          // response wasn't JSON — fall back to default message
        }
        throw new Error(message);
      }

      setSubmitSuccess(true);
      resetForm();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
<div className="screen">

  {/* LEFT BRAND PANEL */}
  <div className="brand-panel">
    <div className="brand-row">
      <Image
        src="/images/ielts-beta-logo.jpg"
        alt="IELTS Beta logo"
        width={44}
        height={44}
        priority
      />
      <div>
        <div className="name">IELTS Beta</div>
        <div className="tag">Exam Preparation</div>
      </div>
    </div>

    <div className="panel-mid">
      <h2>Start your journey to the band score you need.</h2>
      <div className="why-list">
        <div className="why-item">
          <div className="why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
          <div className="why-text"><div className="t">Structured courses</div><div className="s">Listening, Reading, Writing &amp; Speaking, built module by module.</div></div>
        </div>
        <div className="why-item">
          <div className="why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
          <div className="why-text"><div className="t">Realistic mock tests</div><div className="s">Timed practice tests scored the way the real exam is scored.</div></div>
        </div>
        <div className="why-item">
          <div className="why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-4"/></svg></div>
          <div className="why-text"><div className="t">Track every band</div><div className="s">Watch your score move from where you start to where you&apos;re headed.</div></div>
        </div>
      </div>
    </div>

    <div className="quote-block">
      <p>&quot;I finally understood exactly which skill was holding my band back.&quot;</p>
      <div className="who">— Tanvir Hasan, Band 7.0</div>
    </div>
  </div>

  {/* RIGHT FORM PANEL */}
  <div className="form-panel">
    <div className="form-box">
      <div className="mobile-brand">
        <Image
          src="/images/ielts-beta-logo.jpg"
          alt="IELTS Beta logo"
          width={38}
          height={38}
        />
        <span className="name">IELTS Beta</span>
      </div>

      <h1>Create your account</h1>
      <div className="sub">Set up your profile and start practicing today.</div>

      <form onSubmit={handleSubmit}>

        <div className="field span-2" style={{ marginBottom: "6px" }}>
          <label>I am registering as<span className="req">*</span></label>
        </div>
        <div className="role-toggle">
          <div
            className={`role-option${role === "Student" ? " selected" : ""}`}
            data-role="Student"
            onClick={() => setRole("Student")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>
            <span className="role-label">Student</span>
          </div>
          <div
            className={`role-option${role === "Teacher" ? " selected" : ""}`}
            data-role="Teacher"
            onClick={() => setRole("Teacher")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span className="role-label">Teacher</span>
          </div>
          <div
            className={`role-option${role === "Admin" ? " selected" : ""}`}
            data-role="Admin"
            onClick={() => setRole("Admin")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span className="role-label">Admin</span>
          </div>
        </div>
        <input type="hidden" name="role" value={role} readOnly />

        <div className="form-grid">
          <div className="field">
            <label>First name<span className="req">*</span></label>
            <div className="input-wrap">
              <input
                type="text"
                placeholder="Sarah"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label>Last name<span className="req">*</span></label>
            <div className="input-wrap">
              <input
                type="text"
                placeholder="Ahmed"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field span-2">
            <label>Email address<span className="req">*</span></label>
            <div className="input-wrap">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Phone number<span className="req">*</span></label>
            <div className="input-wrap">
              <input
                type="tel"
                placeholder="+880 1XXX-XXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label>Date of birth<span className="req">*</span></label>
            <div className="input-wrap">
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field span-2">
            <label>Gender<span className="req">*</span></label>
            <div className="input-wrap">
              <select
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>Select gender</option>
                <option>Female</option>
                <option>Male</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Password<span className="req">*</span></label>
            <div className="input-wrap">
              <input
                type={showPw ? "text" : "password"}
                id="pw"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="toggle-eye" onClick={() => setShowPw(!showPw)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div className={`pw-strength${strength.level ? " " + strength.level : ""}`}>
              <div className="bar"></div><div className="bar"></div><div className="bar"></div>
            </div>
            <div className="pw-strength-label">{strength.label}</div>
          </div>

          <div className={`field${passwordsMatch ? "" : " has-error"}`}>
            <label>Confirm password<span className="req">*</span></label>
            <div className="input-wrap">
              <input
                type={showPw2 ? "text" : "password"}
                id="pw2"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" className="toggle-eye" onClick={() => setShowPw2(!showPw2)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div className="field-error">Passwords do not match.</div>
          </div>

        </div>

        {/* STUDENT-ONLY FIELDS */}
        <div className={`role-fields${role === "Student" ? " active" : ""}`}>
          <div className="field">
            <label>Target IELTS band<span className="req">*</span></label>
            <div className="band-chips">
              {BANDS.map((b) => (
                <div
                  key={b}
                  className={`band-chip${band === b ? " selected" : ""}`}
                  data-band={b}
                  onClick={() => setBand(b)}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TEACHER-ONLY FIELDS */}
        <div className={`role-fields${role === "Teacher" ? " active" : ""}`}>
          <div className="field">
            <label>Specialization</label>
            <div className="input-wrap">
              <input
                type="text"
                id="specialization"
                placeholder="e.g. IELTS Writing, Speaking Coach"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
            <div className="field-hint">Optional — the subject or skill you teach. Shown on your teacher profile.</div>
          </div>
        </div>

        {/* ADMIN-ONLY NOTE */}
        <div className={`role-fields${role === "Admin" ? " active" : ""}`}>
          <div className="role-note">
            Admin accounts get platform-wide access to manage users, courses, tests, and settings. New admin signups are reviewed and approved by an existing administrator before activation.
          </div>
        </div>

        {submitError && (
          <div className="field-error" style={{ display: "block", marginBottom: "12px" }}>
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div style={{ color: "var(--green-ok)", fontSize: "13px", marginBottom: "12px" }}>
            Registration successful! You can now log in.
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Creating account..." : ROLE_LABELS[role]}
        </button>
      </form>

      <div className="switch-line">
        Already have an account? <a href="/login">Log in</a>
      </div>

      <div className="terms-line">
        By creating an account, you agree to IELTS Beta&apos;s <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  </div>

</div>
  );
}
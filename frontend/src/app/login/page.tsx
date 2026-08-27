"use client";

import { useState } from "react";
import Image from "next/image";
import "./login.css";

type Role = "Student" | "Teacher" | "Admin";

const ROLE_DASHBOARD: Record<Role, string> = {
  Student: "/student/dashboard",
  Teacher: "/teacher/dashboard",
  Admin: "/admin/dashboard",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required so the session cookie is stored by the browser
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let message = "Login failed. Please check your credentials and try again.";
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

      const data = await res.json();
      const role = data.role as Role;
      const destination = ROLE_DASHBOARD[role];

      if (destination) {
        window.location.href = destination;
      } else {
        setSubmitError("Login succeeded but your account role is not recognized.");
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Login failed. Please try again."
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
      <Image src="/images/ielts-beta-logo.jpg" alt="IELTS Beta logo" width={44} height={44} priority />
      <div>
        <div className="name">IELTS Beta</div>
        <div className="tag">Exam Preparation</div>
      </div>
    </div>

    <div className="panel-mid">
      <h2>Continue your IELTS preparation journey.</h2>
      <p>Track your band score, practice all four skills, and study with structured courses built around real exam patterns.</p>

      <div className="band-illustration">
        <div className="ruler-track"><div className="ruler-fill"></div></div>
        <div className="ruler-ticks"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>
        <div className="cap">Average learner improves <b>+1.0 band</b> within 8 weeks on IELTS Beta.</div>
      </div>
    </div>

    <div className="quote-block">
      <p>&quot;The practice tests felt exactly like the real exam. I went from 6.0 to 7.5 in ten weeks.&quot;</p>
      <div className="who">— Nusrat Jahan, Band 7.5</div>
    </div>
  </div>

  {/* RIGHT FORM PANEL */}
  <div className="form-panel">
    <div className="form-box">
      <div className="mobile-brand">
        <Image src="/images/ielts-beta-logo.jpg" alt="IELTS Beta logo" width={44} height={44} priority />
        <span className="name">IELTS Beta</span>
      </div>

      <h1>Welcome back</h1>
      <div className="sub">Continue your IELTS preparation journey.</div>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <div className="input-wrap">
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={`field${submitError ? " has-error" : ""}`}>
          <label htmlFor="password">Password</label>
          <div className="input-wrap">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
              <svg id="eyeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          {submitError && <div className="field-error" style={{ display: "block" }}>{submitError}</div>}
        </div>

        <div className="row-between">
          <label className="remember"><input type="checkbox" /> Remember me</label>
          <a href="#" className="forgot">Forgot password?</a>
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="switch-line" style={{ marginTop: '22px' }}>
        Don&apos;t have an account? <a href="/registration">Create one</a>
      </div>

      <div className="trust-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>Your data is protected and never shared.</span>
      </div>
    </div>
  </div>

</div>


  );
}
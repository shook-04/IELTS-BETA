"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./student-tests.css";

export interface TestSummary {
  testId: number;
  title: string;
  category: string;
  duration: number | null;
  totalMarks: number | null;
  questionCount: number;
}

const API_BASE = "http://localhost:8080/api";

export default function PracticeTestsPage() {
  const [tests, setTests] = useState<TestSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/tests`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load practice tests");
        return res.json();
      })
      .then((data: TestSummary[]) => {
        if (!cancelled) setTests(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load practice tests. Please try again later.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="content">
      <div className="page-header">
        <h1>Practice Tests</h1>
        <p>Take a practice test and get scored automatically.</p>
      </div>

      {error && <p className="test-error">{error}</p>}

      {!error && tests === null && <p>Loading practice tests…</p>}

      {!error && tests !== null && tests.length === 0 && (
        <p>No practice tests are available right now.</p>
      )}

      {!error && tests !== null && tests.length > 0 && (
        <div className="test-grid">
          {tests.map((test) => (
            <div className="test-card" key={test.testId}>
              <div className="test-top">
                <span className={`diff-tag ${test.category === "Academic" ? "medium" : "easy"}`}>
                  {test.category}
                </span>
              </div>
              <div className="test-title">{test.title}</div>
              <div className="test-meta-grid">
                <div className="test-meta-item">
                  <span className="mv">{test.duration ?? "—"}</span>
                  <span className="ml">Duration (min)</span>
                </div>
                <div className="test-meta-item">
                  <span className="mv">{test.questionCount}</span>
                  <span className="ml">Questions</span>
                </div>
                <div className="test-meta-item">
                  <span className="mv">{test.totalMarks ?? "—"}</span>
                  <span className="ml">Marks</span>
                </div>
              </div>
              <Link href={`/student/tests/${test.testId}`} className="btn-start">
                Start Test
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
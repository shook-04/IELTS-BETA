"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "../student-tests.css";

interface AnswerOption {
  optionId: number;
  optionText: string;
}

interface Question {
  questionId: number;
  questionText: string;
  skill: string;
  marks: number;
  options: AnswerOption[];
}

interface TestDetails {
  testId: number;
  title: string;
  category: string;
  duration: number | null;
  questions: Question[];
}

interface TestResult {
  attemptId: number;
  testId: number;
  testTitle: string;
  score: number;
  totalMarks: number;
  bandScore: number;
  feedback: string;
  submitTime: string;
}

const API_BASE = "http://localhost:8080/api";

export default function TakeTestPage() {
  const params = useParams<{ testId: string }>();
  const testId = params.testId;

  const [test, setTest] = useState<TestDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/tests/${testId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load test");
        return res.json();
      })
      .then((data: TestDetails) => {
        if (!cancelled) setTest(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load this test. Please go back and try again.");
      });

    return () => {
      cancelled = true;
    };
  }, [testId]);

  function selectAnswer(questionId: number, optionId: number) {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function submitTest() {
    if (!test) return;
    setSubmitting(true);
    setSubmitError(null);

    const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
      questionId: Number(questionId),
      optionId,
    }));

    try {
      const res = await fetch(`${API_BASE}/tests/${testId}/submit`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      const data: TestResult = await res.json();
      setResult(data);
    } catch {
      setSubmitError("Could not submit your test. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <div className="content">
        <p className="test-error">{error}</p>
        <Link href="/student/tests" className="btn-start">Back to Tests</Link>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="content">
        <p>Loading test…</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="content">
        <div className="page-header">
          <h1>Test Completed</h1>
          <p>{result.testTitle}</p>
        </div>
        <div className="test-card">
          <div className="test-meta-grid">
            <div className="test-meta-item">
              <span className="mv">{result.score} / {result.totalMarks}</span>
              <span className="ml">Score</span>
            </div>
            <div className="test-meta-item">
              <span className="mv">{result.bandScore}</span>
              <span className="ml">Band Score</span>
            </div>
          </div>
          <p>{result.feedback}</p>
          <p>Your result has been recorded.</p>
          <Link href="/student/tests" className="btn-start">Back to Tests</Link>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="content">
      <div className="page-header">
        <h1>{test.title}</h1>
        <p>{test.category}{test.duration ? ` · ${test.duration} min` : ""}</p>
      </div>

      {test.questions.map((question, index) => (
        <div className="test-card" key={question.questionId}>
          <div className="test-title">
            Question {index + 1}. {question.questionText}
          </div>
          <div>
            {question.options.map((option) => (
              <label key={option.optionId} style={{ display: "block", marginTop: "8px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name={`question-${question.questionId}`}
                  checked={selectedAnswers[question.questionId] === option.optionId}
                  onChange={() => selectAnswer(question.questionId, option.optionId)}
                />{" "}
                {option.optionText}
              </label>
            ))}
          </div>
        </div>
      ))}

      {submitError && <p className="test-error">{submitError}</p>}

      <p>
        {answeredCount} of {test.questions.length} questions answered.
      </p>

      <button
        className="btn-start"
        onClick={submitTest}
        disabled={submitting}
        style={{ border: "none", cursor: submitting ? "not-allowed" : "pointer" }}
      >
        {submitting ? "Submitting…" : "Submit Test"}
      </button>
    </div>
  );
}
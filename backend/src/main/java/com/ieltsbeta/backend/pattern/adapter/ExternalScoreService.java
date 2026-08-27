package com.ieltsbeta.backend.pattern.adapter;

/**
 * Stand-in for a small legacy/external scoring engine that only knows how to
 * grade in raw percentages — it has no concept of IELTS bands. This is a
 * simulated boundary, not a real external API call, as agreed in the plan.
 */
public interface ExternalScoreService {

    ExternalScorePayload gradeSubmission(int marksObtained, int totalMarks);
}
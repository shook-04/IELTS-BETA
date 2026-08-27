package com.ieltsbeta.backend.pattern.strategy;

import java.math.BigDecimal;

/**
 * Output of a {@link ScoringStrategy}: how many marks the student earned out
 * of how many were available, plus the raw correct/total question counts.
 * <p>
 * Deliberately does NOT contain a band score. Band-score conversion happens
 * in exactly one place — {@link com.ieltsbeta.backend.pattern.adapter.ExternalScoreAdapter}
 * — so there is a single authoritative scoring flow instead of two
 * competing places that could each compute a band score.
 */
public class ScoreResult {

    private final int correctCount;
    private final int totalQuestions;
    private final BigDecimal marksObtained;
    private final BigDecimal totalMarks;

    public ScoreResult(int correctCount, int totalQuestions, BigDecimal marksObtained, BigDecimal totalMarks) {
        this.correctCount = correctCount;
        this.totalQuestions = totalQuestions;
        this.marksObtained = marksObtained;
        this.totalMarks = totalMarks;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public BigDecimal getMarksObtained() {
        return marksObtained;
    }

    public BigDecimal getTotalMarks() {
        return totalMarks;
    }
}
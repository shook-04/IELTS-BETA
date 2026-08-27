package com.ieltsbeta.backend.pattern.adapter;

import com.ieltsbeta.backend.pattern.strategy.ScoreResult;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * PATTERN 5 — ADAPTER.
 * <p>
 * Converts the external/legacy percentage representation ({@link ExternalScorePayload})
 * into the application's internal band-score representation (a
 * {@link BigDecimal} between 0.0 and 9.0).
 * <p>
 * This is the ONLY place in the application that produces a band score.
 * {@link com.ieltsbeta.backend.pattern.strategy.ScoringStrategy} only ever
 * computes raw marks/correctness (see {@link ScoreResult}) — it does not
 * also compute a band score. That keeps scoring a single authoritative
 * pipeline (Strategy → marks, then Adapter → band) instead of two
 * competing/duplicate ways to arrive at a band score.
 * <p>
 * The percentage-to-band mapping below is a simplified academic
 * approximation for this project and is NOT an official IELTS conversion
 * table.
 */
@Component
public class ExternalScoreAdapter {

    private final ExternalScoreService externalScoreService;

    public ExternalScoreAdapter(ExternalScoreService externalScoreService) {
        this.externalScoreService = externalScoreService;
    }

    public BigDecimal toBandScore(ScoreResult scoreResult) {
        int marksObtained = scoreResult.getMarksObtained().intValue();
        int totalMarks = scoreResult.getTotalMarks().intValue();

        ExternalScorePayload payload = externalScoreService.gradeSubmission(marksObtained, totalMarks);

        return convertPercentageToBand(payload.getPercentageScore());
    }

    private BigDecimal convertPercentageToBand(double percentage) {
        // Simplified, documented rule: 0% -> band 4.0, 100% -> band 9.0,
        // linear in between, rounded to the nearest 0.5 (IELTS bands are
        // reported in 0.5 increments). This is an academic simplification,
        // not an official IELTS scoring conversion.
        double rawBand = 4.0 + (percentage / 100.0) * 5.0;
        double roundedToHalf = Math.round(rawBand * 2) / 2.0;
        double clamped = Math.max(0.0, Math.min(9.0, roundedToHalf));

        return BigDecimal.valueOf(clamped).setScale(1, RoundingMode.HALF_UP);
    }
}
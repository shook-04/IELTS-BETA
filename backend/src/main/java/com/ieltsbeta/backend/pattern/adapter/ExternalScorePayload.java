package com.ieltsbeta.backend.pattern.adapter;

/**
 * The representation returned by the simulated external/legacy scoring
 * engine: a plain 0–100 percentage. This is deliberately a different shape
 * from the application's internal band-score representation (BigDecimal,
 * 0.0–9.0), so that //ExternalScoreAdapter has a genuine conversion to
 * perform rather than a pass-through.
 */
public class ExternalScorePayload {

    private final double percentageScore;

    public ExternalScorePayload(double percentageScore) {
        this.percentageScore = percentageScore;
    }

    public double getPercentageScore() {
        return percentageScore;
    }
}
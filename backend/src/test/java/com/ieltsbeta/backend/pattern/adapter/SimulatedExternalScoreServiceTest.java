package com.ieltsbeta.backend.pattern.adapter;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Tests the percentage calculation performed by the simulated external/legacy
 * scoring engine that {@link ExternalScoreAdapter} adapts.
 */
class SimulatedExternalScoreServiceTest {

    private final SimulatedExternalScoreService service = new SimulatedExternalScoreService();

    @Test
    void normalCase_calculatesCorrectPercentage() {
        ExternalScorePayload payload = service.gradeSubmission(7, 10);

        assertEquals(70.0, payload.getPercentageScore(), 0.0001);
    }

    @Test
    void fullMarks_calculatesHundredPercent() {
        ExternalScorePayload payload = service.gradeSubmission(10, 10);

        assertEquals(100.0, payload.getPercentageScore(), 0.0001);
    }

    @Test
    void zeroMarksObtained_calculatesZeroPercent() {
        ExternalScorePayload payload = service.gradeSubmission(0, 10);

        assertEquals(0.0, payload.getPercentageScore(), 0.0001);
    }

    @Test
    void zeroTotalMarks_returnsZeroPercentInsteadOfDivideByZero() {
        ExternalScorePayload payload = service.gradeSubmission(0, 0);

        assertEquals(0.0, payload.getPercentageScore(), 0.0001);
    }

    @Test
    void negativeTotalMarks_returnsZeroPercent() {
        ExternalScorePayload payload = service.gradeSubmission(5, -1);

        assertEquals(0.0, payload.getPercentageScore(), 0.0001);
    }
}
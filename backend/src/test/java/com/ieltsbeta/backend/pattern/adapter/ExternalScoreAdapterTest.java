package com.ieltsbeta.backend.pattern.adapter;

import com.ieltsbeta.backend.pattern.strategy.ScoreResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * PATTERN 5 — ADAPTER.
 * <p>
 * {@link ExternalScoreService} is mocked so the percentage fed into
 * {@link ExternalScoreAdapter#toBandScore} is fully controlled, letting us
 * pin down the exact percentage-to-band conversion rule (linear 4.0–9.0,
 * rounded to nearest 0.5, clamped) independently of how the percentage
 * itself is computed.
 */
@ExtendWith(MockitoExtension.class)
class ExternalScoreAdapterTest {

    @Mock
    private ExternalScoreService externalScoreService;

    private ExternalScoreAdapter adapter;

    @BeforeEach
    void setUp() {
        adapter = new ExternalScoreAdapter(externalScoreService);
    }

    private ScoreResult scoreResult(int marksObtained, int totalMarks) {
        return new ScoreResult(0, 0, BigDecimal.valueOf(marksObtained), BigDecimal.valueOf(totalMarks));
    }

    @Test
    void zeroPercent_mapsToBandFour() {
        when(externalScoreService.gradeSubmission(0, 10)).thenReturn(new ExternalScorePayload(0.0));

        BigDecimal band = adapter.toBandScore(scoreResult(0, 10));

        assertEquals(0, new BigDecimal("4.0").compareTo(band));
    }

    @Test
    void hundredPercent_mapsToBandNine() {
        when(externalScoreService.gradeSubmission(10, 10)).thenReturn(new ExternalScorePayload(100.0));

        BigDecimal band = adapter.toBandScore(scoreResult(10, 10));

        assertEquals(0, new BigDecimal("9.0").compareTo(band));
    }

    @Test
    void fiftyPercent_mapsToBandSixPointFive() {
        // raw = 4.0 + 0.5 * 5.0 = 6.5, already on a 0.5 increment.
        when(externalScoreService.gradeSubmission(5, 10)).thenReturn(new ExternalScorePayload(50.0));

        BigDecimal band = adapter.toBandScore(scoreResult(5, 10));

        assertEquals(0, new BigDecimal("6.5").compareTo(band));
    }

    @Test
    void twentyPercent_mapsToBandFive() {
        // raw = 4.0 + 0.2 * 5.0 = 5.0
        when(externalScoreService.gradeSubmission(2, 10)).thenReturn(new ExternalScorePayload(20.0));

        BigDecimal band = adapter.toBandScore(scoreResult(2, 10));

        assertEquals(0, new BigDecimal("5.0").compareTo(band));
    }

    @Test
    void sixtyTwoPercent_roundsToNearestHalfBand() {
        // raw = 4.0 + 0.62 * 5.0 = 7.1 -> round(7.1*2)/2 = round(14.2)/2 = 14/2 = 7.0
        when(externalScoreService.gradeSubmission(62, 100)).thenReturn(new ExternalScorePayload(62.0));

        BigDecimal band = adapter.toBandScore(scoreResult(62, 100));

        assertEquals(0, new BigDecimal("7.0").compareTo(band));
    }

    @Test
    void sixtyEightPercent_roundsUpToNearestHalfBand() {
        // raw = 4.0 + 0.68 * 5.0 = 7.4 -> round(14.8)/2 = 15/2 = 7.5
        when(externalScoreService.gradeSubmission(68, 100)).thenReturn(new ExternalScorePayload(68.0));

        BigDecimal band = adapter.toBandScore(scoreResult(68, 100));

        assertEquals(0, new BigDecimal("7.5").compareTo(band));
    }

    @Test
    void moderatelyNegativePercentage_isNotClamped_reflectsLinearFormula() {
        // -40% does NOT reach the clamp floor: rawBand = 4.0 + (-40/100)*5.0
        // = 2.0, which is still >= 0.0, so no clamping occurs here. This
        // documents the actual linear formula's behavior for a negative
        // (out-of-range) input that stays above the floor.
        when(externalScoreService.gradeSubmission(0, 10)).thenReturn(new ExternalScorePayload(-40.0));

        BigDecimal band = adapter.toBandScore(scoreResult(0, 10));

        assertEquals(0, new BigDecimal("2.0").compareTo(band));
    }

    @Test
    void extremelyNegativePercentage_isClampedToZero() {
        // Defensive/boundary case: only once rawBand itself would go
        // negative (percentage <= -80) does the Math.max(0.0, ...) clamp in
        // convertPercentageToBand actually engage. rawBand = 4.0 +
        // (-100/100)*5.0 = -1.0, which the adapter must clamp to 0.0.
        when(externalScoreService.gradeSubmission(0, 10)).thenReturn(new ExternalScorePayload(-100.0));

        BigDecimal band = adapter.toBandScore(scoreResult(0, 10));

        assertEquals(0, new BigDecimal("0.0").compareTo(band));
    }

    @Test
    void percentageOverHundred_isClampedToNine() {
        when(externalScoreService.gradeSubmission(10, 10)).thenReturn(new ExternalScorePayload(150.0));

        BigDecimal band = adapter.toBandScore(scoreResult(10, 10));

        assertEquals(0, new BigDecimal("9.0").compareTo(band));
    }

    @Test
    void bandScore_isScaledToOneDecimalPlace() {
        when(externalScoreService.gradeSubmission(5, 10)).thenReturn(new ExternalScorePayload(50.0));

        BigDecimal band = adapter.toBandScore(scoreResult(5, 10));

        assertEquals(1, band.scale());
    }

    @Test
    void adapter_passesMarksObtainedAndTotalMarksToExternalService() {
        when(externalScoreService.gradeSubmission(7, 12)).thenReturn(new ExternalScorePayload(58.3));

        adapter.toBandScore(scoreResult(7, 12));

        verify(externalScoreService).gradeSubmission(eq(7), eq(12));
    }
}
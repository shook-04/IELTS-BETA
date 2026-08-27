package com.ieltsbeta.backend.pattern.factory;

import com.ieltsbeta.backend.exception.UnsupportedTestCategoryException;
import com.ieltsbeta.backend.pattern.strategy.PracticeTestScoringStrategy;
import com.ieltsbeta.backend.pattern.strategy.ScoringStrategy;
import org.springframework.stereotype.Component;

/**
 * PATTERN 2 — FACTORY METHOD.
 * <p>
 * Selects the {@link ScoringStrategy} to use based on the practice test's
 * category. Today "Academic" and "General" both use the same multiple-choice
 * strategy, but the decision point is real and used by the actual submission
 * workflow ({@code TestSubmissionFacade}) — not created only for
 * demonstration. An unrecognised category is a genuine error case, not a
 * silent fallback, which is exercised by the "unsupported category" test.
 */
@Component
public class ScoringStrategyFactory {

    private final PracticeTestScoringStrategy practiceTestScoringStrategy;

    public ScoringStrategyFactory(PracticeTestScoringStrategy practiceTestScoringStrategy) {
        this.practiceTestScoringStrategy = practiceTestScoringStrategy;
    }

    public ScoringStrategy getStrategy(String category) {
        if (category == null) {
            throw new UnsupportedTestCategoryException("Test category is missing; cannot select a scoring strategy");
        }

        return switch (category) {
            case "Academic", "General" -> practiceTestScoringStrategy;
            default -> throw new UnsupportedTestCategoryException(
                    "Unsupported test category for scoring: " + category);
        };
    }
}
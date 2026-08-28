package com.ieltsbeta.backend.pattern.factory;

import com.ieltsbeta.backend.exception.UnsupportedTestCategoryException;
import com.ieltsbeta.backend.pattern.strategy.PracticeTestScoringStrategy;
import com.ieltsbeta.backend.pattern.strategy.ScoringStrategy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * PATTERN 2 — FACTORY METHOD.
 * <p>
 * Uses the real {@link PracticeTestScoringStrategy} (no mocking needed —
 * it's a plain, stateless collaborator) to verify the factory's selection
 * logic and its error handling for unsupported/missing categories.
 */
class ScoringStrategyFactoryTest {

    private PracticeTestScoringStrategy practiceTestScoringStrategy;
    private ScoringStrategyFactory factory;

    @BeforeEach
    void setUp() {
        practiceTestScoringStrategy = new PracticeTestScoringStrategy();
        factory = new ScoringStrategyFactory(practiceTestScoringStrategy);
    }

    @Test
    void academicCategory_returnsPracticeTestScoringStrategy() {
        ScoringStrategy strategy = factory.getStrategy("Academic");

        assertSame(practiceTestScoringStrategy, strategy);
    }

    @Test
    void generalCategory_returnsPracticeTestScoringStrategy() {
        ScoringStrategy strategy = factory.getStrategy("General");

        assertSame(practiceTestScoringStrategy, strategy);
    }

    @Test
    void unsupportedCategory_throwsUnsupportedTestCategoryException() {
        UnsupportedTestCategoryException ex = assertThrows(
                UnsupportedTestCategoryException.class,
                () -> factory.getStrategy("Listening")
        );

        assertNotNullMessage(ex);
    }

    @Test
    void nullCategory_throwsUnsupportedTestCategoryException() {
        UnsupportedTestCategoryException ex = assertThrows(
                UnsupportedTestCategoryException.class,
                () -> factory.getStrategy(null)
        );

        assertNotNullMessage(ex);
    }

    @Test
    void categoryIsCaseSensitive_lowercaseIsUnsupported() {
        // The factory does not silently normalise casing — "academic"
        // (lowercase) must be rejected exactly like any other unsupported
        // category, since the real data always stores "Academic"/"General".
        assertThrows(UnsupportedTestCategoryException.class, () -> factory.getStrategy("academic"));
    }

    private void assertNotNullMessage(UnsupportedTestCategoryException ex) {
        org.junit.jupiter.api.Assertions.assertNotNull(ex.getMessage());
    }
}
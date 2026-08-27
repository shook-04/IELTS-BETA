package com.ieltsbeta.backend.pattern.observer;

import com.ieltsbeta.backend.entity.TestAttempt;
import com.ieltsbeta.backend.entity.TestResult;

/**
 * PATTERN 4 — OBSERVER.
 * <p>
 * Implementations are notified after a @link TestResult} has been
 * successfully created and saved. Spring collects every bean implementing
 * this interface and injects them as a list into
 * {@code TestSubmissionFacade}, which notifies each one at the end of the
 * submission workflow.
 */
public interface TestResultObserver {

    void onResultGenerated(TestResult testResult, TestAttempt testAttempt);
}
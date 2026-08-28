package com.ieltsbeta.backend.pattern.observer;

import com.ieltsbeta.backend.entity.PracticeTest;
import com.ieltsbeta.backend.entity.Student;
import com.ieltsbeta.backend.entity.TestAttempt;
import com.ieltsbeta.backend.entity.TestResult;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

/**
 * PATTERN 4 — OBSERVER.
 * <p>
 * {@link ResultGeneratedObserver} only logs, so the meaningful thing to
 * verify at the unit level is that it can walk the full entity graph
 * ({@code testAttempt.getStudent().getStudentId()},
 * {@code testAttempt.getTest().getTestId()}, etc.) it relies on without
 * throwing — a broken chain here would NPE the whole notification step in
 * {@code TestSubmissionFacade}. The "observers are actually notified, the
 * right number of times, with the right data" behavior is verified at the
 * Facade level (see {@code TestSubmissionFacadeTest}), since that's where
 * the subject/observer relationship is actually exercised.
 */
class ResultGeneratedObserverTest {

    private final ResultGeneratedObserver observer = new ResultGeneratedObserver();

    @Test
    void onResultGenerated_withFullyPopulatedGraph_doesNotThrow() {
        Student student = new Student();
        student.setStudentId(1L);

        PracticeTest practiceTest = new PracticeTest();
        practiceTest.setTestId(2L);

        TestAttempt attempt = new TestAttempt();
        attempt.setAttemptId(3L);
        attempt.setStudent(student);
        attempt.setTest(practiceTest);
        attempt.setStartTime(OffsetDateTime.now());
        attempt.setSubmitTime(OffsetDateTime.now());

        TestResult result = new TestResult();
        result.setResultId(4L);
        result.setAttempt(attempt);
        result.setOverallBand(new BigDecimal("6.5"));

        assertDoesNotThrow(() -> observer.onResultGenerated(result, attempt));
    }

    @Test
    void implementsTestResultObserverContract() {
        // Simple type-contract check: the Facade collects every Spring bean
        // implementing TestResultObserver into a List<TestResultObserver>,
        // so this must actually be an instance of the interface.
        org.junit.jupiter.api.Assertions.assertInstanceOf(TestResultObserver.class, observer);
    }
}
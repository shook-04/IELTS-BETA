package com.ieltsbeta.backend.pattern.observer;

import com.ieltsbeta.backend.entity.TestAttempt;
import com.ieltsbeta.backend.entity.TestResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ResultGeneratedObserver implements TestResultObserver {

    private static final Logger log = LoggerFactory.getLogger(ResultGeneratedObserver.class);

    @Override
    public void onResultGenerated(TestResult testResult, TestAttempt testAttempt) {
        log.info(
                "Test result generated: resultId={}, attemptId={}, studentId={}, testId={}, band={}",
                testResult.getResultId(),
                testAttempt.getAttemptId(),
                testAttempt.getStudent().getStudentId(),
                testAttempt.getTest().getTestId(),
                testResult.getOverallBand()
        );
    }
}
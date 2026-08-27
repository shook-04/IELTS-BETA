package com.ieltsbeta.backend.pattern.adapter;

import org.springframework.stereotype.Component;

@Component
public class SimulatedExternalScoreService implements ExternalScoreService {

    @Override
    public ExternalScorePayload gradeSubmission(int marksObtained, int totalMarks) {
        double percentage = totalMarks <= 0
                ? 0.0
                : (marksObtained * 100.0) / totalMarks;
        return new ExternalScorePayload(percentage);
    }
}
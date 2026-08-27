package com.ieltsbeta.backend.dto;

import java.util.List;

// Intentionally contains ONLY the student's selected answers.
// studentId, score, bandScore, and correctness are never accepted from the
// client — the backend derives the student from the session and computes
// everything else itself (see TestSubmissionFacade).
public class TestSubmissionDto {

    private List<SubmitAnswerDto> answers;

    public TestSubmissionDto() {
    }

    public List<SubmitAnswerDto> getAnswers() {
        return answers;
    }

    public void setAnswers(List<SubmitAnswerDto> answers) {
        this.answers = answers;
    }
}

package com.ieltsbeta.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class TestResultDto {

    private Long attemptId;
    private Long testId;
    private String testTitle;
    private BigDecimal score;
    private Integer totalMarks;
    private BigDecimal bandScore;
    private String feedback;
    private OffsetDateTime submitTime;

    public TestResultDto() {
    }

    public TestResultDto(Long attemptId, Long testId, String testTitle, BigDecimal score,
                         Integer totalMarks, BigDecimal bandScore, String feedback,
                         OffsetDateTime submitTime) {
        this.attemptId = attemptId;
        this.testId = testId;
        this.testTitle = testTitle;
        this.score = score;
        this.totalMarks = totalMarks;
        this.bandScore = bandScore;
        this.feedback = feedback;
        this.submitTime = submitTime;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public String getTestTitle() {
        return testTitle;
    }

    public void setTestTitle(String testTitle) {
        this.testTitle = testTitle;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public BigDecimal getBandScore() {
        return bandScore;
    }

    public void setBandScore(BigDecimal bandScore) {
        this.bandScore = bandScore;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public OffsetDateTime getSubmitTime() {
        return submitTime;
    }

    public void setSubmitTime(OffsetDateTime submitTime) {
        this.submitTime = submitTime;
    }
}

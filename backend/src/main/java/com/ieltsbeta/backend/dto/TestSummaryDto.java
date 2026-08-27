package com.ieltsbeta.backend.dto;

public class TestSummaryDto {

    private Long testId;
    private String title;
    private String category;
    private Integer duration;
    private Integer totalMarks;
    private int questionCount;

    public TestSummaryDto() {
    }

    public TestSummaryDto(Long testId, String title, String category, Integer duration, Integer totalMarks, int questionCount) {
        this.testId = testId;
        this.title = title;
        this.category = category;
        this.duration = duration;
        this.totalMarks = totalMarks;
        this.questionCount = questionCount;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public int getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(int questionCount) {
        this.questionCount = questionCount;
    }
}
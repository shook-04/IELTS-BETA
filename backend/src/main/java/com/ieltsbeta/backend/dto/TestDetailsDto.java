package com.ieltsbeta.backend.dto;

import java.util.List;

public class TestDetailsDto {

    private Long testId;
    private String title;
    private String category;
    private Integer duration;
    private List<QuestionDto> questions;

    public TestDetailsDto() {
    }

    public TestDetailsDto(Long testId, String title, String category, Integer duration, List<QuestionDto> questions) {
        this.testId = testId;
        this.title = title;
        this.category = category;
        this.duration = duration;
        this.questions = questions;
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

    public List<QuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDto> questions) {
        this.questions = questions;
    }
}
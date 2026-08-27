package com.ieltsbeta.backend.dto;

import java.util.List;

public class QuestionDto {

    private Long questionId;
    private String questionText;
    private String skill;
    private Integer marks;
    private List<AnswerOptionDto> options;

    public QuestionDto() {
    }

    public QuestionDto(Long questionId, String questionText, String skill, Integer marks, List<AnswerOptionDto> options) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.skill = skill;
        this.marks = marks;
        this.options = options;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public Integer getMarks() {
        return marks;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }

    public List<AnswerOptionDto> getOptions() {
        return options;
    }

    public void setOptions(List<AnswerOptionDto> options) {
        this.options = options;
    }
}

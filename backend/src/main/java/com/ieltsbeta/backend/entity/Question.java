package com.ieltsbeta.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Long questionId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "test_id", nullable = false)
    private PracticeTest test;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Column(name = "skill", nullable = false, length = 20)
    private String skill;

    @Column(name = "marks", nullable = false)
    private Integer marks;

    public Question() {
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public PracticeTest getTest() {
        return test;
    }

    public void setTest(PracticeTest test) {
        this.test = test;
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
}
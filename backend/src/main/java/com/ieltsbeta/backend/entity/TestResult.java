package com.ieltsbeta.backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "test_results")
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    @OneToOne(optional = false)
    @JoinColumn(name = "attempt_id", nullable = false, unique = true)
    private TestAttempt attempt;

    @Column(name = "overall_band", precision = 2, scale = 1)
    private BigDecimal overallBand;

    // Skill-specific fields are left NULL for this minimal multiple-choice
    // implementation, as agreed — the schema supports them for future work.
    @Column(name = "listening", precision = 2, scale = 1)
    private BigDecimal listening;

    @Column(name = "reading", precision = 2, scale = 1)
    private BigDecimal reading;

    @Column(name = "writing", precision = 2, scale = 1)
    private BigDecimal writing;

    @Column(name = "speaking", precision = 2, scale = 1)
    private BigDecimal speaking;

    @Column(name = "feedback")
    private String feedback;

    public TestResult() {
    }

    public Long getResultId() {
        return resultId;
    }

    public void setResultId(Long resultId) {
        this.resultId = resultId;
    }

    public TestAttempt getAttempt() {
        return attempt;
    }

    public void setAttempt(TestAttempt attempt) {
        this.attempt = attempt;
    }

    public BigDecimal getOverallBand() {
        return overallBand;
    }

    public void setOverallBand(BigDecimal overallBand) {
        this.overallBand = overallBand;
    }

    public BigDecimal getListening() {
        return listening;
    }

    public void setListening(BigDecimal listening) {
        this.listening = listening;
    }

    public BigDecimal getReading() {
        return reading;
    }

    public void setReading(BigDecimal reading) {
        this.reading = reading;
    }

    public BigDecimal getWriting() {
        return writing;
    }

    public void setWriting(BigDecimal writing) {
        this.writing = writing;
    }

    public BigDecimal getSpeaking() {
        return speaking;
    }

    public void setSpeaking(BigDecimal speaking) {
        this.speaking = speaking;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
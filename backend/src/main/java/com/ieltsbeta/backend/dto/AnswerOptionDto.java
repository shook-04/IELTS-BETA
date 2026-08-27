package com.ieltsbeta.backend.dto;

public class AnswerOptionDto {

    private Long optionId;
    private String optionText;

    public AnswerOptionDto() {
    }

    public AnswerOptionDto(Long optionId, String optionText) {
        this.optionId = optionId;
        this.optionText = optionText;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }
}
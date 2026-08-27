package com.ieltsbeta.backend.dto;

import java.math.BigDecimal;

public class MeResponse {

    private Long userId;
    private String email;
    private String role;
    private String firstName;
    private String lastName;

    // Present only when role == "Student"
    private BigDecimal targetBand;
    private BigDecimal currentBand;
    private Integer daysActive;

    public MeResponse() {
    }

    public MeResponse(
            Long userId,
            String email,
            String role,
            String firstName,
            String lastName,
            BigDecimal targetBand,
            BigDecimal currentBand,
            Integer daysActive
    ) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.targetBand = targetBand;
        this.currentBand = currentBand;
        this.daysActive = daysActive;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public BigDecimal getTargetBand() {
        return targetBand;
    }

    public void setTargetBand(BigDecimal targetBand) {
        this.targetBand = targetBand;
    }

    public BigDecimal getCurrentBand() {
        return currentBand;
    }

    public void setCurrentBand(BigDecimal currentBand) {
        this.currentBand = currentBand;
    }

    public Integer getDaysActive() {
        return daysActive;
    }

    public void setDaysActive(Integer daysActive) {
        this.daysActive = daysActive;
    }
}
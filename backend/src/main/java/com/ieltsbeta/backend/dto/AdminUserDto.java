package com.ieltsbeta.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class AdminUserDto {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String status;
    private OffsetDateTime createdAt;

    // Present only when role == "Student"
    private BigDecimal targetBand;
    private BigDecimal currentBand;
    private Integer daysActive;

    public AdminUserDto() {
    }

    public AdminUserDto(
            Long userId,
            String firstName,
            String lastName,
            String email,
            String role,
            String status,
            OffsetDateTime createdAt,
            BigDecimal targetBand,
            BigDecimal currentBand,
            Integer daysActive
    ) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
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
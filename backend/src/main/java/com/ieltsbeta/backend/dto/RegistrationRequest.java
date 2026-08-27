package com.ieltsbeta.backend.dto;

import java.math.BigDecimal;

public class RegistrationRequest {

    // Common fields — required for every role
    private String role;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String dateOfBirth; // ISO format "yyyy-MM-dd", parsed to LocalDate in AuthService
    private String gender;
    private String password;
    private String confirmPassword;

    // Student-only field
    private BigDecimal targetBand;

    // Teacher-only field (optional)
    private String specialization;

    public RegistrationRequest() {
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public BigDecimal getTargetBand() {
        return targetBand;
    }

    public void setTargetBand(BigDecimal targetBand) {
        this.targetBand = targetBand;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
}
package com.example.SkinCareSellProductSysterm.DTO;

import jakarta.persistence.Column;

import java.math.BigDecimal;
import java.time.LocalDate;

public class UserRequest {





    @Column(name = "password_hash", nullable = false, columnDefinition = "TEXT")
    private String passwordHash;  // TEXT NOT NULL


    // gender ENUM('Male','Female') DEFAULT NULL
    @Column(name = "gender")
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "phone_number", length = 10)
    private String phoneNumber;

    @Column(name = "profile_image", columnDefinition = "TEXT")
    private String profileImage;

    // money DECIMAL(18,2) NOT NULL DEFAULT 0
    @Column(name = "money", nullable = false, columnDefinition = "DECIMAL(18,2) DEFAULT 0")
    private BigDecimal money = BigDecimal.ZERO;



    // Getter and Setter


    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }




    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }




    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public BigDecimal getMoney() {
        return money;
    }

    public void setMoney(BigDecimal money) {
        this.money = money;
    }

}

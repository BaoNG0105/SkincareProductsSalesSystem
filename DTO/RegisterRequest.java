package com.example.SkinCareSellProductSysterm.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String passwordHash;

    @NotBlank(message = "User name is required")
    private String userName;

    // Gender vẫn để String
    @Pattern(regexp = "^(Male|Female)?$", message = "Gender must be Male, Female or empty")
    private String gender;

    private LocalDate dateOfBirth;
    private String address;
    private String phoneNumber;
    private String profileImage;

    // Getter and Setter

    public @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Password is required") String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(@NotBlank(message = "Password is required") String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public @NotBlank(message = "User name is required") String getUserName() {
        return userName;
    }

    public void setUserName(@NotBlank(message = "User name is required") String userName) {
        this.userName = userName;
    }

    public @Pattern(regexp = "^(Male|Female)?$", message = "Gender must be Male, Female or empty") String getGender() {
        return gender;
    }

    public void setGender(@Pattern(regexp = "^(Male|Female)?$", message = "Gender must be Male, Female or empty") String gender) {
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

//    @Override
//    public String toString() {
//        return "RegisterRequest{" +
//                "email='" + email + '\'' +
//                ", passwordHash='" + passwordHash + '\'' +
//                ", userName='" + userName + '\'' +
//                ", role=" + role +
//                ", gender='" + gender + '\'' +
//                ", dateOfBirth=" + dateOfBirth +
//                ", address='" + address + '\'' +
//                ", phoneNumber='" + phoneNumber + '\'' +
//                ", profileImage='" + profileImage + '\'' +
//                '}';
//    }
}

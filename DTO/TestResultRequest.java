package com.example.SkinCareSellProductSysterm.DTO;

import lombok.Data;

@Data
public class TestResultRequest {
    private Long userId;
    private Long testResultId;

    // Getter and Setter
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTestResultId() {
        return testResultId;
    }

    public void setTestResultId(Long testResultId) {
        this.testResultId = testResultId;
    }
}

package com.example.SkinCareSellProductSysterm.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SkinCareRoutineRequest {


    @NotNull(message = "SkinType ID cannot be null")
    private Long productId;

    @NotNull(message = "Step number cannot be null")
    @Min(value = 1, message = "Step number must be greater than 0")
    @Column(name = "step_number", nullable = false)
    private int stepNumber;

    @NotNull(message = "Description cannot be null")
    @Size(min = 1, message = "Description must not be empty")
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    // Getter and Setter

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getStepNumber() {
        return stepNumber;
    }

    public void setStepNumber(int stepNumber) {
        this.stepNumber = stepNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}

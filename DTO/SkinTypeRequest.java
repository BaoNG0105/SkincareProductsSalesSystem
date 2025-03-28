package com.example.SkinCareSellProductSysterm.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SkinTypeRequest {

    @NotNull(message = "Skin type cannot be null")
    @Size(max = 50, message = "Skin type must be at most 50 characters")
    @Column(name = "skin_type", nullable = false, unique = true)
    private String skinType;



    public String getSkinType() {
        return skinType;
    }

    public void setSkinType(String skinType) {
        this.skinType = skinType;
    }

}

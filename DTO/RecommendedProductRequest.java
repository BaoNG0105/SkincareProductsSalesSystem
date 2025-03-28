package com.example.SkinCareSellProductSysterm.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RecommendedProductRequest {

    @NotNull(message = "Product ID cannot be null")
    private Long productId;

    @NotNull(message = "Skin Type ID cannot be null")
    private Long skinTypeId;

    @Size(max = 255, message = "Recommendation reason must be at most 255 characters")
    private String recommendationReason;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getSkinTypeId() {
        return skinTypeId;
    }

    public void setSkinTypeId(Long skinTypeId) {
        this.skinTypeId = skinTypeId;
    }

    public String getRecommendationReason() {
        return recommendationReason;
    }

    public void setRecommendationReason(String recommendationReason) {
        this.recommendationReason = recommendationReason;
    }
}

package com.example.SkinCareSellProductSysterm.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemRequest {

    @NotNull
    private Long orderId;
    @NotNull
    private Long productId;
    @NotNull
    private int quantity;
    @NotNull
    private BigDecimal unitPrice;
    @NotNull
    private BigDecimal discountAmount;

    // Getter and Setter

    public @NotNull Long getOrderId() {
        return orderId;
    }

    public void setOrderId(@NotNull Long orderId) {
        this.orderId = orderId;
    }

    public @NotNull Long getProductId() {
        return productId;
    }

    public void setProductId(@NotNull Long productId) {
        this.productId = productId;
    }

    public @NotNull int getQuantity() {
        return quantity;
    }

    public void setQuantity(@NotNull int quantity) {
        this.quantity = quantity;
    }

    public @NotNull BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(@NotNull BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public @NotNull BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(@NotNull BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }
}

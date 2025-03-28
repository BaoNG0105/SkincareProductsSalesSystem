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


}

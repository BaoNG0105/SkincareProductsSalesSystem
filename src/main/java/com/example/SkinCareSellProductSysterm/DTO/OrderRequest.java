package com.example.SkinCareSellProductSysterm.DTO;


import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class OrderRequest {

    @NotNull
    private Long userId;
    private BigDecimal totalPrice;

}

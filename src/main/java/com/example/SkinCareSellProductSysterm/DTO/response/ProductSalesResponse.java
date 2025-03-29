package com.example.SkinCareSellProductSysterm.DTO.response;

public class ProductSalesResponse {
    private long productId;
    private int quantitySold;

    public ProductSalesResponse(long productId, int quantitySold) {
        this.productId = productId;
        this.quantitySold = quantitySold;
    }

    // Getter and Setter
    public long getProductId() {
        return productId;
    }

    public int getQuantitySold() {
        return quantitySold;
    }
}
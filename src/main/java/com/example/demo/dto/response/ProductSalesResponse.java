package com.example.demo.dto.response;

public class ProductSalesResponse {
    private long productId;
    private int quantitySold;

    public ProductSalesResponse(long productId, int quantitySold) {
        this.productId = productId;
        this.quantitySold = quantitySold;
    }

    public long getProductId() {
        return productId;
    }

    public int getQuantitySold() {
        return quantitySold;
    }
}

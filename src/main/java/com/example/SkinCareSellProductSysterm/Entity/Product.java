package com.example.SkinCareSellProductSysterm.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long productId;


    @NotBlank(message = "Product name cannot be blank")
    private String productName;


    @NotBlank(message = "Description name cannot be blank")
    private String description;


    @NotBlank(message = "Category cannot be blank")
    private String category;


    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be a positive number")
    private double price;


    @NotNull(message = "Stock quantity cannot be null")
    @Min(value = 0, message = "Stock quantity must be at least 0")
    private int stockQuantity;


    @NotNull(message = "Image cannot be null")
    private String image;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private boolean status = true;


    @PrePersist
    protected void onCreate(){
        this.createAt = LocalDateTime.now();
        this.updateAt = null;
    }

    @PreUpdate
    protected void onUpdate(){
        this.updateAt = LocalDateTime.now();
    }


    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<RatingFeedback> ratingFeedbacks;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecommendedProduct> recommendedProducts;

    // Nối bảng Product với bảng OrderItem
    @OneToMany(mappedBy = "product")
    @JsonIgnore
    List<OrderItem> orderItems = new ArrayList<>();

    public long getProductId() {
        return productId;
    }

    public void setProductId(long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public LocalDateTime getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDateTime createAt) {
        this.createAt = createAt;
    }

    public LocalDateTime getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(LocalDateTime updateAt) {
        this.updateAt = updateAt;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

}


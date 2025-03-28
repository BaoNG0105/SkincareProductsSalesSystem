package com.example.SkinCareSellProductSysterm.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "skin_types")
public class SkinType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skin_type_id")
    private Long skinTypeId;

    @NotNull(message = "Skin type cannot be null")
    @Size(max = 50, message = "Skin type must be at most 50 characters")
    @Column(name = "skin_type", nullable = false, unique = true)
    private String skinType;

    private boolean isDeleted = false;

    @OneToMany(mappedBy = "skinType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SkinCareRoutine> skinCareRoutines;
    @OneToMany(mappedBy = "skinType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecommendedProduct> recommendedProducts;

    // Mối quan hệ 1-N với SkinTest (nhiều bài test có thể trả về cùng 1 loại da)


    // Nếu muốn ánh xạ cả bên test_results (final_skin_type_id), có thể thêm:
    @OneToMany(mappedBy = "finalSkinType", fetch = FetchType.LAZY)
    private List<TestResults> testResults;

    public Long getSkinTypeId() {
        return skinTypeId;
    }

    public void setSkinTypeId(Long skinTypeId) {
        this.skinTypeId = skinTypeId;
    }

    public String getSkinType() {
        return skinType;
    }

    public void setSkinType(String skinType) {
        this.skinType = skinType;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }
}

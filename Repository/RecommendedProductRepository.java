package com.example.SkinCareSellProductSysterm.Repository;

import com.example.SkinCareSellProductSysterm.Entity.RecommendedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendedProductRepository extends JpaRepository<RecommendedProduct, Long> {

    List<RecommendedProduct> findAllByProduct_ProductIdAndIsDeletedFalse(long product);
    List<RecommendedProduct> findAllBySkinType_SkinTypeIdAndIsDeletedFalse(long skinType);

    List<RecommendedProduct> findByIsDeletedFalse();

    Optional<RecommendedProduct> findByRecommendationIdAndIsDeletedFalse(long answerId);

}
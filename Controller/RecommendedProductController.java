package com.example.SkinCareSellProductSysterm.Controller;

import com.example.SkinCareSellProductSysterm.DTO.RecommendedProductRequest;
import com.example.SkinCareSellProductSysterm.Entity.RecommendedProduct;
import com.example.SkinCareSellProductSysterm.Service.RecommendedProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/recommended-products")
public class RecommendedProductController {

    @Autowired
    private RecommendedProductService recommendedProductService;

    // Create a new RecommendedProduct
    @PostMapping
    public ResponseEntity<RecommendedProduct> createRecommendedProduct(@Valid @RequestBody RecommendedProductRequest recommendedProductRequest) {
        RecommendedProduct recommendedProduct = recommendedProductService.createRecommendedProduct(recommendedProductRequest);
        return ResponseEntity.ok(recommendedProduct);
    }

    // Retrieve all RecommendedProducts that are not deleted
    @GetMapping
    public ResponseEntity<List<RecommendedProduct>> getAllRecommendedProducts() {
        List<RecommendedProduct> recommendedProducts = recommendedProductService.getAllRecommendedProducts();
        return ResponseEntity.ok(recommendedProducts);
    }

    // Retrieve a RecommendedProduct by its ID
    @GetMapping("/{id}")
    public ResponseEntity<RecommendedProduct> getRecommendedProductById(@PathVariable Long id) {
        RecommendedProduct recommendedProduct = recommendedProductService.getRecommendedProductById(id)
                .orElseThrow(() -> new RuntimeException("RecommendedProduct not found with id " + id));
        return ResponseEntity.ok(recommendedProduct);
    }

    // Retrieve RecommendedProducts by both Product ID and SkinType ID
    @GetMapping("/filter")
    public ResponseEntity<List<RecommendedProduct>> getRecommendedProductsByProductIdAndSkinTypeId(
            @RequestParam Long productId,
            @RequestParam Long skinTypeId) {
        List<RecommendedProduct> recommendedProducts = recommendedProductService.getRecommendedProductsByProductIdAndSkinTypeId(productId, skinTypeId);
        return ResponseEntity.ok(recommendedProducts);
    }

    // Soft delete a RecommendedProduct by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecommendedProduct(@PathVariable Long id) {
        recommendedProductService.deleteRecommendedProduct(id);
        return ResponseEntity.ok("RecommendedProduct with ID " + id + " has been deleted.");
    }
    @PutMapping("/{id}")
    public ResponseEntity<RecommendedProduct> updateRecommendedProduct(
            @PathVariable Long id,
            @Valid @RequestBody RecommendedProductRequest recommendedProductRequest) {
        RecommendedProduct updatedRecommendedProduct = recommendedProductService.updateRecommendedProduct(id, recommendedProductRequest);
        return ResponseEntity.ok(updatedRecommendedProduct);
    }
}

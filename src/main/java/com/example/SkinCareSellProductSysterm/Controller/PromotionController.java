package com.example.SkinCareSellProductSysterm.Controller;

import com.example.SkinCareSellProductSysterm.DTO.PromotionRequest;
import com.example.SkinCareSellProductSysterm.Entity.Promotion;
import com.example.SkinCareSellProductSysterm.Service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // Thêm port của frontend vào đây")
@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @PostMapping

    public ResponseEntity<Promotion> createPromotion(@Valid @RequestBody PromotionRequest promotionRequest) {
        return ResponseEntity.ok(promotionService.createPromotion(promotionRequest));
    }

    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable long id) {
        return ResponseEntity.ok(promotionService.getPromotionById(id));
    }

    @DeleteMapping("/{id}")

    public ResponseEntity<String> deletePromotion(@PathVariable long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.ok("Deleted promotion with ID: " + id);
    }

    @PutMapping("/{id}")

    public ResponseEntity<Promotion> updatePromotion(@PathVariable long id, @Valid @RequestBody PromotionRequest promotionRequest) {
        return ResponseEntity.ok(promotionService.updatePromotion(id, promotionRequest));
    }

    @GetMapping("/code")
    public ResponseEntity<Promotion> getPromotionByCode(@RequestParam String code){
        return ResponseEntity.ok(promotionService.getAllPromotionsByCode(code.toUpperCase()));
    }
}
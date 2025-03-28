package com.example.SkinCareSellProductSysterm.Controller;

import com.example.SkinCareSellProductSysterm.DTO.RatingFeedbackRequest;
import com.example.SkinCareSellProductSysterm.Entity.RatingFeedback;
import com.example.SkinCareSellProductSysterm.Service.RatingFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ratings-feedback")
public class RatingFeedbackController {

    @Autowired
    private RatingFeedbackService ratingFeedbackService;

    // Create a new RatingFeedback
    @PostMapping
    public ResponseEntity<RatingFeedback> createRatingFeedback(@RequestBody RatingFeedbackRequest request) {
        RatingFeedback ratingFeedback = ratingFeedbackService.createRatingFeedback(request);
        return ResponseEntity.ok(ratingFeedback);
    }

    // Get RatingFeedback by ID
    @GetMapping("/{id}")
    public ResponseEntity<RatingFeedback> getRatingFeedbackById(@PathVariable Long id) {
        Optional<RatingFeedback> ratingFeedback = ratingFeedbackService.getRatingFeedbackById(id);
        return ratingFeedback.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get RatingFeedback by User ID and Product ID
    @GetMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<List<RatingFeedback>> getRatingFeedbackByUserIdAndProductId(@PathVariable Long userId, @PathVariable Long productId) {
        List<RatingFeedback> ratingFeedback = ratingFeedbackService.getRatingFeedbackByProductIdAndUserId(productId, userId);
        return ResponseEntity.ok(ratingFeedback);
    }

    // Get all RatingFeedbacks
    @GetMapping
    public ResponseEntity<List<RatingFeedback>> getAllRatingFeedbacks() {
        return ResponseEntity.ok(ratingFeedbackService.getAllRatingFeedbacks());
    }



    // Update RatingFeedback
    @PutMapping("/{id}")
    public ResponseEntity<RatingFeedback> updateRatingFeedback(@PathVariable Long id, @RequestBody RatingFeedbackRequest request) {
        RatingFeedback updatedFeedback = ratingFeedbackService.updateRatingFeedback(id, request);
        return ResponseEntity.ok(updatedFeedback);
    }

    // Soft delete RatingFeedback
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRatingFeedback(@PathVariable Long id) {
        ratingFeedbackService.deleteRatingFeedback(id);
        return ResponseEntity.noContent().build();
    }
}

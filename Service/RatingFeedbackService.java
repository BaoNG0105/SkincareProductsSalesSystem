package com.example.SkinCareSellProductSysterm.Service;

import com.example.SkinCareSellProductSysterm.DTO.RatingFeedbackRequest;
import com.example.SkinCareSellProductSysterm.Entity.Product;
import com.example.SkinCareSellProductSysterm.Entity.RatingFeedback;
import com.example.SkinCareSellProductSysterm.Entity.User;
import com.example.SkinCareSellProductSysterm.Repository.ProductRepository;
import com.example.SkinCareSellProductSysterm.Repository.RatingFeedbackRepository;
import com.example.SkinCareSellProductSysterm.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RatingFeedbackService {

    @Autowired
    private RatingFeedbackRepository ratingFeedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Create a new RatingFeedback
    public RatingFeedback createRatingFeedback(RatingFeedbackRequest request) {
        User customer = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id " + request.getUserId()));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id " + request.getProductId()));

        RatingFeedback ratingFeedback = new RatingFeedback();
        ratingFeedback.setCustomer(customer);
        ratingFeedback.setProduct(product);
        ratingFeedback.setRating(request.getRating());
        ratingFeedback.setComment(request.getComment());

        return ratingFeedbackRepository.save(ratingFeedback);
    }

    // Retrieve a RatingFeedback by its id (only if not deleted)
    public Optional<RatingFeedback> getRatingFeedbackById(Long id) {
        return ratingFeedbackRepository.findByIdAndIsDeletedFalse(id);
    }

    // Retrieve all RatingFeedbacks (only active ones)
    public List<RatingFeedback> getAllRatingFeedbacks() {
        return ratingFeedbackRepository.findByIsDeletedFalse();
    }

//    // Retrieve all RatingFeedbacks associated with a given Product id
//    public List<RatingFeedback> getRatingFeedbacksByProductId(Long productId) {
//        return ratingFeedbackRepository.findAllByProduct_ProductIdAndIsDeletedFalse(productId);
//    }

//    // Retrieve all RatingFeedbacks associated with a given User id
//    public List<RatingFeedback> getRatingFeedbacksByUserId(Long userId) {
//        return ratingFeedbackRepository.findAllByCustomer_IdAndIsDeletedFalse(userId);
//    }

    // Soft delete a RatingFeedback
    public void deleteRatingFeedback(Long id) {
        RatingFeedback existing = ratingFeedbackRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("RatingFeedback not found with id " + id));
        existing.setDeleted(true);
        ratingFeedbackRepository.save(existing);
    }

    // Update an existing RatingFeedback
    public RatingFeedback updateRatingFeedback(Long id, RatingFeedbackRequest request) {
        RatingFeedback existing = ratingFeedbackRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("RatingFeedback not found with id " + id));

        existing.setRating(request.getRating());
        existing.setComment(request.getComment());

        return ratingFeedbackRepository.save(existing);
    }

    public List<RatingFeedback> getRatingFeedbackByProductIdAndUserId(Long productId, Long userId) {

        List<RatingFeedback> ratingFeedbacks = ratingFeedbackRepository.findAllByProduct_ProductIdAndIsDeletedFalse(productId);

        return ratingFeedbacks.stream()
                .filter(s -> s.getCustomer().getId().equals(userId))
                .toList();

    }

}

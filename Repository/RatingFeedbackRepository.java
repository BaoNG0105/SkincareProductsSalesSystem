package com.example.SkinCareSellProductSysterm.Repository;

import com.example.SkinCareSellProductSysterm.Entity.RatingFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingFeedbackRepository extends JpaRepository<RatingFeedback, Long> {

    List<RatingFeedback> findAllByProduct_ProductIdAndIsDeletedFalse(long productId);


    List<RatingFeedback> findByIsDeletedFalse();

    Optional<RatingFeedback> findByIdAndIsDeletedFalse(long feedbackId);
}


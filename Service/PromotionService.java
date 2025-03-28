package com.example.SkinCareSellProductSysterm.Service;

import com.example.SkinCareSellProductSysterm.DTO.PromotionRequest;
import com.example.SkinCareSellProductSysterm.Entity.Promotion;
import com.example.SkinCareSellProductSysterm.Repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;

    public Promotion createPromotion(PromotionRequest promotionRequest) {
        Promotion promotion = new Promotion();
        promotion.setCode(promotionRequest.getCode());
        promotion.setDescription(promotionRequest.getDescription());
        promotion.setDiscountPercentage(promotionRequest.getDiscountPercentage());
        promotion.setStartDate(promotionRequest.getStartDate());
        promotion.setEndDate(promotionRequest.getEndDate());
        promotion.setMinimumOrderValue(promotionRequest.getMinimumOrderValue());
        return promotionRepository.save(promotion);
    }

    public List<Promotion> getAllPromotions() {
        return promotionRepository.findByAvailableTrue();
    }

    public Promotion deletePromotion(long id) {
        Optional<Promotion> promotionOpt = promotionRepository.findByPromotionIdAndAvailableTrue(id);
        if (promotionOpt.isEmpty()) {
            throw new RuntimeException("Promotion not found with ID: " + id);
        }
        Promotion promotion = promotionOpt.get();
        promotion.setAvailable(false);
        return promotionRepository.save(promotion);
    }

    public Promotion updatePromotion(long id, PromotionRequest promotionRequest) {
        Promotion promotion = promotionRepository.findByPromotionIdAndAvailableTrue(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with ID: " + id));

        promotion.setCode(promotionRequest.getCode());
        promotion.setDescription(promotionRequest.getDescription());
        promotion.setDiscountPercentage(promotionRequest.getDiscountPercentage());
        promotion.setStartDate(promotionRequest.getStartDate());
        promotion.setEndDate(promotionRequest.getEndDate());
        promotion.setMinimumOrderValue(promotionRequest.getMinimumOrderValue());

        return promotionRepository.save(promotion);
    }

    public Promotion getPromotionById(long promotionId) {
        return promotionRepository.findByPromotionIdAndAvailableTrue(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
    }

    public Promotion getAllPromotionsByCode(String code) {
        Promotion promotion = promotionRepository.findByCodeAndAvailableTrue(code)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        LocalDateTime currentDateTime = LocalDateTime.now();
        if (!currentDateTime.isBefore(promotion.getStartDate()) && !currentDateTime.isAfter(promotion.getEndDate())) {
            return promotion;
        } else {
            return null;
        }
    }
}

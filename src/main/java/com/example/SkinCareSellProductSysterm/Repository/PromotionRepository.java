package com.example.SkinCareSellProductSysterm.Repository;


import com.example.SkinCareSellProductSysterm.Entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByAvailableTrue();
    Optional<Promotion> findByPromotionIdAndAvailableTrue(Long id);
    Optional<Promotion> findByCodeAndAvailableTrue(String code);

}


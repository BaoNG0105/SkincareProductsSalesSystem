package com.example.SkinCareSellProductSysterm.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {
    List<FAQ> findByIsDeletedFalse();
    Optional<FAQ> findByFaqIdAndIsDeletedFalse(long id);
    List<FAQ> findByProduct_ProductIdAndIsDeletedFalse(long productId);
}

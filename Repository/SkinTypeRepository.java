package com.example.SkinCareSellProductSysterm.Repository;

import com.example.SkinCareSellProductSysterm.Entity.SkinType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkinTypeRepository extends JpaRepository<SkinType, Long> {
    List<SkinType> findByIsDeletedFalse();
    Optional<SkinType> findBySkinTypeIdAndIsDeletedFalse(long id);
}

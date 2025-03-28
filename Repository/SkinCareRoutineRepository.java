package com.example.SkinCareSellProductSysterm.Repository;


import com.example.SkinCareSellProductSysterm.Entity.SkinCareRoutine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface SkinCareRoutineRepository extends JpaRepository<SkinCareRoutine, Long> {
    List<SkinCareRoutine> findByIsDeletedFalse();
    Optional<SkinCareRoutine> findByRoutineIdAndIsDeletedFalse(long id);
    List<SkinCareRoutine> findBySkinType_SkinTypeIdAndIsDeletedFalse(long skinTypeId);
}


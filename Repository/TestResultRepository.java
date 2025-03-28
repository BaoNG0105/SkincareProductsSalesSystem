package com.example.SkinCareSellProductSysterm.Repository;

import com.example.SkinCareSellProductSysterm.Entity.TestResults;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestResultRepository extends JpaRepository<TestResults, Long> {
    List<TestResults> findByIsDeletedFalse();

    // Lấy blog theo ID nếu không bị xóa
    Optional<TestResults> findByResultIdAndIsDeletedFalse(Long id);

    List<TestResults> findByUser_IdAndIsDeletedFalse(Long userId);
}

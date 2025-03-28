package com.example.SkinCareSellProductSysterm.Repository;

import com.example.SkinCareSellProductSysterm.Entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    // Lấy tất cả blog có isDeleted = false
    List<Blog> findByIsDeletedFalse();

    // Lấy blog theo ID nếu không bị xóa
    Optional<Blog> findByIdAndIsDeletedFalse(Long id);

    // Lấy tất cả blog của một user theo userId nếu không bị xóa
    List<Blog> findByAuthor_IdAndIsDeletedFalse(Long userId);
}


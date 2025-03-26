package com.example.SkinCareSellProductSysterm.Repository;


import com.example.SkinCareSellProductSysterm.Entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findAllByIsDeletedFalse();
    List<OrderItem> findByOrderOrderIdAndIsDeletedFalse(Long orderId);
    Optional<OrderItem> findByOrderItemIdAndIsDeletedFalse(Long orderItemId);

}

package com.example.SkinCareSellProductSysterm.Repository;

import com.example.SkinCareSellProductSysterm.Entity.Order;
import com.example.SkinCareSellProductSysterm.Utils.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByIsDeletedFalse();
    List<Order> findByCustomer_IdAndIsDeletedFalse(Long customerId);
    Optional<Order> findByOrderIdAndIsDeletedFalse(Long orderId);
    List<Order> findByOrderStatusAndIsDeletedFalse(OrderStatus orderStatus);
}

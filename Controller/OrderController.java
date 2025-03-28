package com.example.SkinCareSellProductSysterm.Controller;

import com.example.SkinCareSellProductSysterm.DTO.OrderRequest;
import com.example.SkinCareSellProductSysterm.Entity.Order;
import com.example.SkinCareSellProductSysterm.Service.OrderService;
import com.example.SkinCareSellProductSysterm.Utils.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping

    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest) {
        Order order = orderService.createOrder(orderRequest);
        return ResponseEntity.ok(order);
    }


    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{customerId}/status")
    public ResponseEntity<List<Order>> getOrdersByCustomerIdAndStatus(@PathVariable Long customerId, @RequestParam String status) {
        OrderStatus orderStatus;
        try {
            orderStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Trả về lỗi nếu status sai
        }
        List<Order> orders = orderService.getOrdersByCustomerIdAndStatus(orderStatus, customerId);

        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase()); // Chuyển thành in hoa
            return ResponseEntity.ok(orderService.getOrdersByStatus(orderStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Trả về lỗi nếu status sai
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase()); // Chuyển thành in hoa
            Order updatedOrder = orderService.updateOrderStatus(orderStatus, orderId);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Trả về lỗi nếu status sai
        }
    }

    @PutMapping("{orderId}/price")
    public ResponseEntity<Order> updatePriceOrder(@PathVariable Long orderId, @RequestParam BigDecimal price){
        return ResponseEntity.ok(orderService.updatePriceOrder(orderId, price));
    }

    @DeleteMapping("/{orderId}")

    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
//
//
//    // Retrieve RecommendedProducts by both Product ID and SkinType ID
//    @GetMapping("/filter")
//    public ResponseEntity<List<Order>> getRecommendedProductsByProductIdAndSkinTypeId(
//            @RequestParam Long userId,
//            @RequestParam Long cancellationPolicyId) {
//        List<Order> orders = orderService.getOrdersByUserIdAndCancellationPolicyId(userId, cancellationPolicyId);
//        return ResponseEntity.ok(orders);
//    }
//
//    // Soft delete a RecommendedProduct by its ID
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
//        orderService.deleteOrder(id);
//        return ResponseEntity.ok("RecommendedProduct with ID " + id + " has been deleted.");
//    }
//
//
//    // Update hết tất cả thông tin của đơn hàng đóa
//    @PutMapping("/{id}")
//    public ResponseEntity<Order> updateOrder(
//            @PathVariable Long id,
//            @Valid @RequestBody OrderRequest orderRequest) {
//        Order updatedOrder = orderService.updateOrder(id, orderRequest);
//        return ResponseEntity.ok(updatedOrder);
//    }
//
//    // Update trạng thái của đơn hàng đóa
//    @PatchMapping("/{id}/update-status")
//    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
//        Order order = orderService.updateOrderStatus(status, id);
//        return ResponseEntity.ok(order);
//    }
}

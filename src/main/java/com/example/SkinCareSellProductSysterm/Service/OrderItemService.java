package com.example.SkinCareSellProductSysterm.Service;

import com.example.SkinCareSellProductSysterm.DTO.OrderItemRequest;
import com.example.SkinCareSellProductSysterm.Entity.Order;
import com.example.SkinCareSellProductSysterm.Entity.OrderItem;
import com.example.SkinCareSellProductSysterm.Entity.Product;
import com.example.SkinCareSellProductSysterm.Repository.OrderItemRepository;
import com.example.SkinCareSellProductSysterm.Repository.OrderRepository;
import com.example.SkinCareSellProductSysterm.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // Tạo mới OrderItem
    public OrderItem createOrderItem(OrderItemRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with id = " + request.getOrderId()));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id = " + request.getProductId()));

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(request.getQuantity());
        orderItem.setUnitPrice(request.getUnitPrice());
        orderItem.setDiscountAmount(request.getDiscountAmount());
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);

        // Cập nhật totalPrice trong Order
        updateOrderTotalPrice(order);

        return savedOrderItem;
    }

    // Lấy danh sách tất cả OrderItem
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAllByIsDeletedFalse();
    }

    // Lấy OrderItem theo ID
    public OrderItem getOrderItemById(Long id) {
        OrderItem orderItem = orderItemRepository.findByOrderItemIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found with id = " + id));
        return orderItem;
    }

    // Cập nhật OrderItem
    public OrderItem updateOrderItem(Long id, OrderItemRequest request) {
        OrderItem orderItem = orderItemRepository.findByOrderItemIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found with id = " + id));

        if (request.getOrderId() != null) {
            Order order = orderRepository.findByOrderIdAndIsDeletedFalse(request.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found with id = " + request.getOrderId()));
            orderItem.setOrder(order);
        }
        if (request.getProductId() != null) {
            Product product = productRepository.findByProductIdAndStatusTrue(request.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id = " + request.getProductId()));
            orderItem.setProduct(product);
        }
        orderItem.setQuantity(request.getQuantity());
        orderItem.setUnitPrice(request.getUnitPrice());
        orderItem.setDiscountAmount(request.getDiscountAmount());
        OrderItem updatedOrderItem = orderItemRepository.save(orderItem);

        // Cập nhật totalPrice trong Order
        updateOrderTotalPrice(orderItem.getOrder());

        return updatedOrderItem;
    }


    // Xóa OrderItem
    public OrderItem deleteOrderItem(Long id) {
        OrderItem orderItem = orderItemRepository.findByOrderItemIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id = " + id));
        orderItem.setDeleted(true);

        orderItemRepository.save(orderItem);

        // Cập nhật totalPrice trong Order
        updateOrderTotalPrice(orderItem.getOrder());

        return orderItem;
    }
    public List<OrderItem> getOrderItemByOrderId(Long orderId) {

        List<OrderItem> orderItems = orderItemRepository.findByOrderOrderIdAndIsDeletedFalse(orderId);
        return orderItems;
    }

    public List<OrderItem> getOrderItemByProductId(Long productId) {

        List<OrderItem> orderItems = orderItemRepository.findByProductProductIdAndIsDeletedFalse(productId);
        return orderItems;
    }

    private void updateOrderTotalPrice(Order order) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderOrderIdAndIsDeletedFalse(order.getOrderId());
        BigDecimal totalPrice = orderItems.stream()
                .map(item -> item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())).subtract(item.getDiscountAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalPrice(totalPrice);
        orderRepository.save(order);


    }



    // Ch
}
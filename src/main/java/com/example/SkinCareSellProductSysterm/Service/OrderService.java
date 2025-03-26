package com.example.SkinCareSellProductSysterm.Service;

import com.example.SkinCareSellProductSysterm.DTO.OrderRequest;
import com.example.SkinCareSellProductSysterm.Entity.*;
import com.example.SkinCareSellProductSysterm.Repository.OrderRepository;
import com.example.SkinCareSellProductSysterm.Repository.UserRepository;
import com.example.SkinCareSellProductSysterm.Utils.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;


    public List<Order> getOrdersByCustomerIdAndStatus(OrderStatus orderStatus, Long customerId) {
        List<Order> orders = orderRepository.findByCustomer_IdAndIsDeletedFalse(customerId);
        return orders.stream()
                .filter(s -> s.getOrderStatus().equals(orderStatus))
                .toList();
    }

    // Lấy tất cả đơn hàng chưa bị xóa
    public List<Order> getAllOrders() {
        return orderRepository.findAllByIsDeletedFalse();
    }

    // Lấy đơn hàng theo ID
    public Order getOrderById(Long orderId) {
        return orderRepository.findByOrderIdAndIsDeletedFalse(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }




    // Lấy đơn hàng theo ID khách hàng
    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomer_IdAndIsDeletedFalse(customerId);
    }


    // Lấy đơn hàng theo trạng thái
    public List<Order> getOrdersByStatus(OrderStatus orderStatus) {
        return orderRepository.findByOrderStatusAndIsDeletedFalse(orderStatus);
    }


//    public List<Order> getOrdersByUserIdAndCancellationPolicyId(Long userId, Long cancellationPolicyId) {
//
//        List<Order> orders = orderRepository.findByCustomer_IdAndIsDeletedFalse(userId);
//
//        return orders.stream()
//                .filter(s -> s.getCancellationPolicy().getPolicyId().equals(cancellationPolicyId))
//                .toList();
//
//    }

    //    // Tạo mới đơn hàng
    //    public Order createOrder(OrderRequest orderRequest) {
    //        User customer = userRepository.findById(orderRequest.getCustomerId())
    //                .orElseThrow(() -> new RuntimeException("Customer not found"));
    //
    ////        CancellationPolicy policy = null;
    ////        if (orderRequest.getCancellationPolicyId() != null) {
    ////            policy = cancellationPolicyRepository.findById(orderRequest.getCancellationPolicyId())
    ////                    .orElseThrow(() -> new RuntimeException("Cancellation Policy not found"));
    ////        }
    //
    //        Order order = Order.builder()
    //                .customer(customer)
    //                .totalPrice(orderRequest.getTotalPrice())
    //                // .cancellationPolicy(policy)
    //                .discountAmount(orderRequest.getDiscountAmount() != null ? orderRequest.getDiscountAmount() : BigDecimal.ZERO)
    //                .build();
    //
    //        return orderRepository.save(order);
    //    }


    // Tạo mới đơn hàng, mua bán trừ số lượng sản phẩm
//    @Autowired
//    ModelMapper modelMapper;
//    public String createOrder(OrderRequest orderRequest) throws Exception {
//
//        BigDecimal totalPrice = BigDecimal.ZERO;
//        List<OrderItem> orderItems = new ArrayList<>();
//
//        Order order = modelMapper.map(orderRequest, Order.class);
//        order.setOrderItems(orderItems);
//        order.setCustomer(accountUtils.getUser());
//
//        for (OrderItemRequest orderItemRequest : orderRequest.getItems()) {
//
//            OrderItem orderItem = new OrderItem();
//            Product product = productRepository.findById(orderItemRequest.getProductId())
//                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + orderItemRequest.getProductId()));
//
//            // Check Quantity from Product
//            if (product.getStockQuantity() >= orderItemRequest.getQuantity()) {
//
//                orderItem.setProduct(product);
//                orderItem.setQuantity(orderItemRequest.getQuantity());
//                orderItem.setUnitPrice(BigDecimal.valueOf(product.getPrice()).multiply(BigDecimal.valueOf(orderItemRequest.getQuantity())));
//                orderItem.setDiscountAmount(orderItemRequest.getDiscountAmount());
//                orderItem.setOrder(order);
//                orderItems.add(orderItem);
//
//                // Product phải trừ Quantity của sản phẩm đó
//                product.setStockQuantity(product.getStockQuantity() - orderItem.getQuantity());
//                productRepository.save(product); // Lưu số lượng sản phẩm mới đó lại
//
//                totalPrice = totalPrice.add(orderItem.getUnitPrice());
//            }else{
//                throw new RuntimeException("Insufficient product quantity. Please try again.");
//            }
//        }
//
//        order.setTotalPrice(totalPrice);
//        Order newOrder = orderRepository.save(order);
//        return  createURLPayment(newOrder);
//    }

    public Order createOrder(OrderRequest orderRequest) {
        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .customer(user)
                .totalPrice(orderRequest.getTotalPrice())
                .orderStatus(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .isDeleted(false)
                .build();

        return orderRepository.save(order);
    }



    public String createURLPayment(Order order) throws Exception{
        // Định dạng ngày giờ
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        LocalDateTime createDate = LocalDateTime.now();
        String formattedCreateDate = createDate.format(formatter);

        // Tạo mã đơn hàng ngẫu nhiên (6 ký tự đầu từ UUID)
        String orderId = UUID.randomUUID().toString().substring(0, 6);


        String TMN_CODE = "BBBUL2B6"; // Lưu ý
        String SECRET_KEY = "KSHFXBNJ7KE0OPKZEM9COMEYQRUXCI0X"; // Lưu ý
        String VNP_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

        String returnURL = "http://localhost:8080?orderId=" + order.getOrderId(); // Chú ý url quay lại khi đã thanh toán thành công đơn hàng
        // Đoạn code sau giúp cho FE biết được là của đơn hàng nào

        String currCode = "VND"; // Mệnh giá tiền
        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", TMN_CODE);
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_CurrCode", currCode);
        vnpParams.put("vnp_TxnRef", orderId);
        vnpParams.put("vnp_OrderInfo", "Thanh toán cho mã GD: " + orderId);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Amount", (order.getTotalPrice().intValue()) + "00"); // Vì kiểu dữ liệu BigDecimal ==> int
        vnpParams.put("vnp_ReturnUrl", returnURL);
        vnpParams.put("vnp_CreateDate", formattedCreateDate);
        vnpParams.put("vnp_IpAddr", "167.99.74.201");


        // Mã hóa bảo mật giao dịch
        StringBuilder signDataBuilder = new StringBuilder();
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            signDataBuilder.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
            signDataBuilder.append("=");
            signDataBuilder.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
            signDataBuilder.append("&");
        }

        signDataBuilder.deleteCharAt(signDataBuilder.length() - 1); // Remove last '&'

        String signData = signDataBuilder.toString();
        String signed = generateHMAC(SECRET_KEY, signData);

        vnpParams.put("vnp_SecureHash", signed);

        StringBuilder urlBuilder = new StringBuilder(VNP_URL);
        urlBuilder.append("?");

        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            urlBuilder.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
            urlBuilder.append("=");
            urlBuilder.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
            urlBuilder.append("&");
        }

        urlBuilder.deleteCharAt(urlBuilder.length() - 1); // Remove last '&'
        return urlBuilder.toString();
    }

    private String generateHMAC(String secretKey, String signData) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac hmacSha512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmacSha512.init(keySpec);

        byte[] hmacBytes = hmacSha512.doFinal(signData.getBytes(StandardCharsets.UTF_8));

        StringBuilder result = new StringBuilder();
        for (byte b : hmacBytes) {
            result.append(String.format("%02x", b));
        }

        return result.toString();
    }


    // Cập nhật lại trạng thái cho đơn hàng
    public Order updateOrderStatus(OrderStatus orderStatus, Long orderId) {
        Order order = orderRepository.findByOrderIdAndIsDeletedFalse(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(orderStatus);
        order.setUpdatedAt(LocalDateTime.now()); // Nếu muốn update lại thời gian
        return orderRepository.save(order);
    }


    // Cập nhật đơn hàng
    public Order updateOrder(Long orderId, OrderRequest orderRequest) {
        Order order = orderRepository.findByOrderIdAndIsDeletedFalse(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (orderRequest.getTotalPrice() != null) {
            order.setTotalPrice(orderRequest.getTotalPrice());
        }

        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }
    public Order updatePriceOrder(Long orderId, BigDecimal price){
        Order order = orderRepository.findByOrderIdAndIsDeletedFalse(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setTotalPrice(price);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    // Xóa đơn hàng (chuyển isDeleted thành true)
    public Order deleteOrder(Long orderId) {
        Order order = orderRepository.findByOrderIdAndIsDeletedFalse(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setDeleted(true);
        return orderRepository.save(order);
    }




//    // Lấy Order Của Account User đó
//    public List<Order> getOrdersByUser() {
//        User user = accountUtils.getUser();
//        return orderRepository.findAllByCustomer_Id(user.getId());
//    }
}

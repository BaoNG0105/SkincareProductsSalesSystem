import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import {
  getOrderIdAndStatusByUserId,
  updateOrderItemsByOrderId,
  deleteOrderItemsByOrderItemId,
  updateOrderStatusByOrderId,
  updateOrderPriceByOrderId,
} from "../../services/api.order";
import {
  updateProductQuantity,
  getProductById,
} from "../../services/api.product";
import { getUserById } from "../../services/api.user";
import { updateUserById } from "../../services/api.user";
import { getPromotionByCode } from "../../services/api.promotion";
import { getPaymentByOrderId } from "../../services/api.payment";

function CartPage() {
  const [orders, setOrders] = useState([]);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: "",
  });
  const [appliedPromotion, setAppliedPromotion] = useState(null);

  useEffect(() => {
    //Hàm lấy order
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      try {
        //Lấy orderId và status
        const orderData = await getOrderIdAndStatusByUserId(userId);
        if (orderData && orderData.length > 0) {
          // Lọc ra các order có orderItems chưa bị xóa (deleted: false)
          const filteredOrders = orderData.map((order) => ({
            ...order,
            orderItems: order.orderItems.filter((item) => !item.deleted),
            // Tính lại tổng giá chỉ với các item chưa bị xóa
            totalPrice: order.orderItems
              .filter((item) => !item.deleted)
              .reduce(
                (total, item) => total + item.quantity * item.product.price,
                0
              ),
          }));

          // Kiểm tra xem còn item nào không
          const hasItems = filteredOrders.some(
            (order) => order.orderItems.length > 0
          );

          setOrders(filteredOrders);
          setIsCartEmpty(!hasItems);
        } else {
          setIsCartEmpty(true);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  //Hàm lấy thông tin user
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      try {
        const userData = await getUserById(userId);
        setUserInfo(userData);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  //Hàm update quantity
  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // Fetch current order data to check stock quantity
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const orderData = await getOrderIdAndStatusByUserId(userId);

      // Find the current product's stock quantity
      const currentProduct = orderData
        .flatMap((order) => order.orderItems)
        .find(
          (orderItem) => orderItem.product.productId === item.product.productId
        )?.product;

      if (!currentProduct) {
        toast.error("Product not found");
        return;
      }

      // Check if requested quantity exceeds stock
      if (newQuantity > currentProduct.stockQuantity) {
        toast.warning(
          `Only ${currentProduct.stockQuantity} items available in stock`
        );
        return;
      }

      // Proceed with update if stock is available
      await updateOrderItemsByOrderId(item.orderItemId, {
        orderId: item.orderId,
        productId: item.product.productId,
        quantity: newQuantity,
        unitPrice: item.product.price,
        discountAmount: 0,
      });

      //cập nhật lại order
      setOrders(
        orders.map((order) => ({
          ...order,
          orderItems: order.orderItems.map((orderItem) => {
            if (orderItem.orderItemId === item.orderItemId) {
              return {
                ...orderItem,
                quantity: newQuantity,
                totalPrice: newQuantity * item.product.price,
              };
            }
            return orderItem;
          }),
          totalPrice: order.orderItems.reduce((total, orderItem) => {
            if (orderItem.orderItemId === item.orderItemId) {
              return total + newQuantity * item.product.price;
            }
            return total + orderItem.quantity * orderItem.product.price;
          }, 0),
        }))
      );
    } catch (error) {
      toast.error("Failed to update quantity");
      console.error("Error updating quantity:", error);
    }
  };

  //Hàm xóa item
  const handleDeleteItem = async (item) => {
    try {
      // Gọi API để xóa order item
      await deleteOrderItemsByOrderItemId(item.orderItemId);

      // Lấy token và userId
      const token = localStorage.getItem("token");
      if (!token) return;
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // Fetch lại danh sách orders sau khi xóa
      const orderData = await getOrderIdAndStatusByUserId(userId);
      if (orderData && orderData.length > 0) {
        // Lọc ra các order có orderItems chưa bị xóa (deleted: false)
        const filteredOrders = orderData.map((order) => ({
          ...order,
          orderItems: order.orderItems.filter((item) => !item.deleted),
          totalPrice: order.orderItems
            .filter((item) => !item.deleted)
            .reduce(
              (total, item) => total + item.quantity * item.product.price,
              0
            ),
        }));

        // Kiểm tra xem còn item nào không
        const hasItems = filteredOrders.some(
          (order) => order.orderItems.length > 0
        );

        setOrders(filteredOrders);
        setIsCartEmpty(!hasItems);
      } else {
        setIsCartEmpty(true);
      }

      toast.success("Item removed from cart successfully");
    } catch (error) {
      toast.error("Failed to remove item from cart");
      console.error("Error removing item:", error);
    }
  };

  //Hàm cập nhật thông tin checkout
  const handleEditCheckout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // Kiểm tra stockQuantity của product trước khi xử lý checkout
      for (const order of orders) {
        for (const item of order.orderItems) {
          const currentProduct = await getProductById(item.product.productId);

          if (!currentProduct) {
            toast.error(`Product ${item.product.productName} not found`);
            return;
          }
          if (item.quantity > currentProduct.stockQuantity) {
            toast.error(
              `Not enough stock for ${item.product.productName}. Available: ${currentProduct.stockQuantity}`
            );
            return;
          }
        }
      }

      // 1. Lấy thông tin user hiện tại
      const currentUser = await getUserById(userId);

      // 2. Cập nhật thông tin user với dữ liệu mới kết hợp dữ liệu cũ
      const updatedUserData = {
        gender: currentUser.gender,
        dateOfBirth: formData.dateOfBirth || currentUser.dateOfBirth,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        profileImage: currentUser.profileImage,
        money: currentUser.money,
      };

      // 3. Cập nhật số lượng tồn kho của các sản phẩm
      for (const order of orders) {
        for (const item of order.orderItems) {
          try {
            await updateProductQuantity(item.product.productId, {
              quantity: item.quantity,
            });
          } catch (error) {
            console.error(
              `Failed to update stock for product ${item.product.productId}:`,
              error
            );
            throw error;
          }
        }
      }

      // 4. Cập nhật thông tin user
      const userResponse = await updateUserById(userId, updatedUserData);

      // 5. Cập nhật trạng thái đơn hàng
      const orderUpdatePromises = orders.map((order) =>
        updateOrderStatusByOrderId(order.orderId, "PROCESSING")
      );

      await Promise.all(orderUpdatePromises);

      if (userResponse) {
        setUserInfo(userResponse);
        setIsCheckoutModalOpen(false);

        // Chỉ xử lý thanh toán online
        if (paymentMethod === "online") {
          // Lấy URL thanh toán cho đơn hàng đầu tiên
          const paymentResponse = await getPaymentByOrderId(orders[0].orderId);
          if (paymentResponse) {
            // Truy cập trực tiếp vào response text (URL)
            window.location.href = paymentResponse;
          } else {
            toast.error("Payment URL not found");
          }
        } else {
          // Nếu là COD thì chỉ hiển thị thông báo thành công
          toast.success("Order placed successfully!");
        }
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast.error(error.message || "Failed to process checkout");
    }
  };

  //Hàm cập nhật thông tin user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm áp dụng promotion code
  const handlePromotionCode = async () => {
    try {
      // Khôi phục giá gốc cho order trước khi áp dụng promotion mới
      const restoredOrders = orders.map((order) => ({
        ...order,
        totalPrice: order.originalPrice || order.totalPrice, // Khôi phục giá gốc nếu có
        discountAmount: 0,
      }));

      setOrders(restoredOrders);

      const promotion = await getPromotionByCode(promotionCode);

      if (!promotion) {
        toast.error("Invalid promotion code");
        return;
      }

      // Tính toán giá mới với promotion
      const updatedOrders = await Promise.all(
        restoredOrders.map(async (order) => {
          const originalPrice = order.totalPrice;
          const discountAmount =
            (originalPrice * promotion.discountPercentage) / 100;
          const newTotalPrice = originalPrice - discountAmount;

          // Gọi hàm cập nhật giá trong database
          await updateOrderPriceByOrderId(order.orderId, newTotalPrice);

          // Trả về order đã cập nhật
          return {
            ...order,
            originalPrice: originalPrice, // Lưu lại giá gốc
            totalPrice: newTotalPrice, // Cập nhật giá mới
            discountAmount: discountAmount, // Cập nhật số tiền giảm giá
          };
        })
      );

      setOrders(updatedOrders);
      setAppliedPromotion(promotion); // Lưu thông tin promotion đang áp dụng
      toast.success(
        `Applied ${promotion.discountPercentage}% discount successfully!`
      );
      setPromotionCode(""); // Xóa mã promotion sau khi áp dụng thành công
    } catch (error) {
      toast.error("Failed to apply promotion code");
      console.error("Error applying promotion:", error);
    }
  };

  // Hàm remove promotion
  const handleRemovePromotion = async () => {
    try {
      // Khôi phục giá gốc cho tất cả orders
      const restoredOrders = await Promise.all(
        orders.map(async (order) => {
          // Cập nhật lại giá gốc trong database
          await updateOrderPriceByOrderId(order.orderId, order.originalPrice);

          // Trả về order với giá gốc
          return {
            ...order,
            totalPrice: order.originalPrice,
            originalPrice: null,
            discountAmount: 0,
          };
        })
      );

      setOrders(restoredOrders);
      setAppliedPromotion(null); // Xóa promotion đang áp dụng
      toast.success("Removed promotion code successfully!");
    } catch (error) {
      toast.error("Failed to remove promotion code");
      console.error("Error removing promotion:", error);
    }
  };

  //Checkout modal
  const checkoutModal = isCheckoutModalOpen && (
    <div className="fixed inset-0 bg-pink-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl text-center text-pink-600 font-semibold mb-4">
          Checkout Information
        </h2>
        <form onSubmit={handleEditCheckout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              readOnly
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">
                {orders
                  .reduce(
                    (total, order) =>
                      total + (order.originalPrice || order.totalPrice),
                    0
                  )
                  .toLocaleString()}
                VND
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-pink-600">
                {orders
                  .reduce((total, order) => total + order.totalPrice, 0)
                  .toLocaleString()}
                VND
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="cod" className="text-pink-600">
                  Cash on Delivery (COD)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="online"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="online" className="text-pink-600">
                  Online Payment
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsCheckoutModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!paymentMethod}
              className={`px-4 py-2 text-white rounded-md ${
                paymentMethod
                  ? "bg-pink-500 hover:bg-pink-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  //Giao diện cart
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-center font-bold text-pink-600 mb-8">
          MY CART
        </h1>

        {isCartEmpty ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <img
              src="https://res.cloudinary.com/dygipvoal/image/upload/v1742286511/en211bux0cmue2ydku7t.png"
              alt="Empty Cart"
              className="mx-auto w-48 mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Looks like you have not added anything to your cart yet
            </p>
            <Link
              to="/category"
              className="bg-pink-500 text-white px-6 py-3 rounded-full 
                hover:bg-pink-600 transition duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                {orders.map((order) =>
                  order.orderItems.map((item) => (
                    <div
                      key={item.orderItemId}
                      className="flex items-center border-b border-gray-200 pb-4 mb-4"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.productName}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 ml-4">
                        <h3 className="text-lg font-medium text-gray-800">
                          {item.product.productName}
                        </h3>
                        <div className="flex items-center mt-2">
                          <button
                            className="w-8 h-8 border border-gray-300 rounded-l-lg hover:bg-gray-200"
                            onClick={() =>
                              handleUpdateQuantity(item, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1;
                              handleUpdateQuantity(item, newQuantity);
                            }}
                            className="w-16 h-8 text-center border-y border-gray-300 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          />
                          <button
                            className="w-8 h-8 border border-gray-300 rounded-r-lg hover:bg-gray-200"
                            onClick={() =>
                              handleUpdateQuantity(item, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-pink-600">
                          {item.unitPrice.toLocaleString()} VND
                        </p>
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="text-gray-500 hover:text-red-500 mt-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg text-center font-semibold mb-4">
                  Order Summary
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promotion Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promotionCode}
                      onChange={(e) => setPromotionCode(e.target.value)}
                      placeholder="Enter your coupon code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                    />
                    <button
                      type="button"
                      onClick={handlePromotionCode}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                      OK
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  {appliedPromotion && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-green-700 font-medium mb-1">
                            Applied Promotion: {appliedPromotion.code}
                          </div>
                          <div className="text-sm text-green-600">
                            {appliedPromotion.description}
                          </div>
                        </div>
                        <button
                          onClick={handleRemovePromotion}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">
                        {orders
                          .reduce(
                            (total, order) =>
                              total + (order.originalPrice || order.totalPrice),
                            0
                          )
                          .toLocaleString()}{" "}
                        VND
                      </span>
                    </div>

                    {appliedPromotion && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          Discount ({appliedPromotion.discountPercentage}%)
                        </span>
                        <span>
                          -
                          {orders
                            .reduce(
                              (total, order) =>
                                total + (order.discountAmount || 0),
                              0
                            )
                            .toLocaleString()}{" "}
                          VND
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <div className="text-right">
                        {appliedPromotion && (
                          <span className="text-sm text-gray-500 line-through block">
                            {orders
                              .reduce(
                                (total, order) =>
                                  total +
                                  (order.originalPrice || order.totalPrice),
                                0
                              )
                              .toLocaleString()}{" "}
                            VND
                          </span>
                        )}
                        <span className="text-pink-600">
                          {orders
                            .reduce(
                              (total, order) => total + order.totalPrice,
                              0
                            )
                            .toLocaleString()}{" "}
                          VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFormData({
                      userName: userInfo?.userName || "",
                      phoneNumber: userInfo?.phoneNumber || "",
                      address: userInfo?.address || "",
                    });
                    setIsCheckoutModalOpen(true);
                  }}
                  className="w-full mt-6 bg-pink-500 text-white py-3 rounded-full hover:bg-pink-600 transition duration-300"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {checkoutModal}
    </div>
  );
}

export default CartPage;

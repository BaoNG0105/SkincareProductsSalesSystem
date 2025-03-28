import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import {
  getOrderIdAndStatusByUserId,
  updateOrderStatusByOrderId,
  updateOrderPriceByOrderId,
} from "../../services/api.order";
import {
  updateProductQuantity,
  getProductById,
} from "../../services/api.product";
import { getUserById, updateUserById } from "../../services/api.user";
import { getPromotionByCode } from "../../services/api.promotion";
import { getPaymentByOrderId } from "../../services/api.payment";

function CheckoutPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: "",
  });
  const [appliedPromotion, setAppliedPromotion] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to checkout");
        navigate("/login");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      try {
        // Fetch orders
        const orderData = await getOrderIdAndStatusByUserId(userId);
        if (orderData && orderData.length > 0) {
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
          setOrders(filteredOrders);
        }

        // Fetch user info
        const userData = await getUserById(userId);
        setUserInfo(userData);
        setFormData({
          phoneNumber: userData?.phoneNumber || "",
          address: userData?.address || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load checkout information");
      }
    };

    fetchData();
  }, [navigate]);

  // Hàm xử lý promotion code
  const handlePromotionCode = async () => {
    try {
      // Khôi phục giá gốc
      const restoredOrders = orders.map((order) => ({
        ...order,
        totalPrice: order.originalPrice || order.totalPrice,
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

          await updateOrderPriceByOrderId(order.orderId, newTotalPrice);

          return {
            ...order,
            originalPrice: originalPrice,
            totalPrice: newTotalPrice,
            discountAmount: discountAmount,
          };
        })
      );

      setOrders(updatedOrders);
      setAppliedPromotion(promotion);
      toast.success(
        `Applied ${promotion.discountPercentage}% discount successfully!`
      );
      setPromotionCode("");
    } catch (error) {
      toast.error("Failed to apply promotion code");
      console.error("Error applying promotion:", error);
    }
  };

  // Hàm remove promotion
  const handleRemovePromotion = async () => {
    try {
      const restoredOrders = await Promise.all(
        orders.map(async (order) => {
          await updateOrderPriceByOrderId(order.orderId, order.originalPrice);
          return {
            ...order,
            totalPrice: order.originalPrice,
            originalPrice: null,
            discountAmount: 0,
          };
        })
      );

      setOrders(restoredOrders);
      setAppliedPromotion(null);
      toast.success("Removed promotion code successfully!");
    } catch (error) {
      toast.error("Failed to remove promotion code");
      console.error("Error removing promotion:", error);
    }
  };

  // Hàm xử lý checkout
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // Kiểm tra stock
      for (const order of orders) {
        for (const item of order.orderItems) {
          const currentProduct = await getProductById(item.product.productId);
          if (!currentProduct) {
            toast.error(`Product ${item.product.productName} not found`);
            return;
          }
          if (item.quantity > currentProduct.stockQuantity) {
            toast.error(`Not enough stock for ${item.product.productName}`);
            return;
          }
        }
      }

      // Cập nhật thông tin user
      const currentUser = await getUserById(userId);
      const updatedUserData = {
        gender: currentUser.gender,
        dateOfBirth: currentUser.dateOfBirth,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        profileImage: currentUser.profileImage,
        money: currentUser.money,
      };

      // Cập nhật stock
      for (const order of orders) {
        for (const item of order.orderItems) {
          await updateProductQuantity(item.product.productId, {
            quantity: item.quantity,
          });
        }
      }

      // Cập nhật user và order status
      await updateUserById(userId, updatedUserData);
      await Promise.all(
        orders.map((order) =>
          updateOrderStatusByOrderId(order.orderId, "PROCESSING")
        )
      );

      if (paymentMethod === "online") {
        const paymentResponse = await getPaymentByOrderId(orders[0].orderId);
        if (paymentResponse) {
          window.location.href = paymentResponse;
        } else {
          toast.error("Payment URL not found");
        }
      } else {
        toast.success("Order placed successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast.error(error.message || "Failed to process checkout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-center font-bold text-pink-600 mb-8">
          Checkout
        </h1>

        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleCheckout}
            className="bg-white rounded-lg shadow-md p-6"
          >
            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userInfo?.userName || ""}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Promotion code section */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promotionCode}
                    onChange={(e) => setPromotionCode(e.target.value)}
                    placeholder="Enter your coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handlePromotionCode}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Applied promotion */}
              {appliedPromotion && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-green-700 font-medium">
                        Applied Promotion: {appliedPromotion.code}
                      </div>
                      <div className="text-sm text-green-600">
                        {appliedPromotion.description}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromotion}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Payment method */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label htmlFor="cod">Cash on Delivery (COD)</label>
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
                    <label htmlFor="online">Online Payment</label>
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
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
                    <span className="text-pink-600">
                      {orders
                        .reduce((total, order) => total + order.totalPrice, 0)
                        .toLocaleString()}{" "}
                      VND
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                disabled={!paymentMethod}
                className={`px-6 py-2 rounded-md text-white ${
                  paymentMethod
                    ? "bg-pink-500 hover:bg-pink-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

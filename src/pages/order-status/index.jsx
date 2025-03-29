import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getOrderByUserId,
  updateOrderStatusByOrderId,
} from "../../services/api.order";
import { updateProductQuantity } from "../../services/api.product";
import { toast } from "react-toastify";
import {
  FaClock,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaBox,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
} from "react-icons/fa";
import { Modal, Rate, Input, Radio, Space } from 'antd';
import { createRating } from "../../services/api.rating";


function OrderStatusPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    "PROCESSING",
    "SHIPPING",
    "DELIVERED",
    "CANCELLED"
  );
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});
  const { TextArea } = Input;
  const [cancelReason, setCancelReason] = useState('');

  const cancelReasons = [
    "Changed my mind about the products",
    "Found better price elsewhere",
    "Ordered by mistake"
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to continue");
          navigate("/login");
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        // Fetch all orders for the user
        const orders = await getOrderByUserId(userId);
        setAllOrders(orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Filter orders based on status
  const getOrdersByStatus = (status) => {
    return allOrders.filter((order) => order.orderStatus === status);
  };

  const handleOpenCancelModal = (orderId) => {
    setCurrentOrderId(orderId);
    setIsCancelModalOpen(true);
  };

  const handleConfirmReceived = async (orderId) => {
    try {
      await updateOrderStatusByOrderId(orderId, "DELIVERED");
      toast.success("Order confirmed successfully");
      // Refresh lại trang hoặc cập nhật state
      window.location.reload();
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("Cannot confirm order");
    }
  };

  //Hàm cancel order
  const handleConfirmCancel = async () => {
    try {
      // 1. Gọi API để update status thành CANCELLED
      const response = await updateOrderStatusByOrderId(currentOrderId, "CANCELLED");

      if (response) {
        // 2. Hoàn lại số lượng cho các sản phẩm trong order
        for (const orderItem of response.orderItems) {
          try {
            // Thêm dấu - vào quantity để tăng stockQuantity
            await updateProductQuantity(orderItem.product.productId, {
              quantity: -orderItem.quantity
            });
            console.log(`Successfully restored stock for product ${orderItem.product.productId}`);
          } catch (error) {
            console.error(`Failed to restore stock for product ${orderItem.product.productId}:`, error);
            throw error;
          }
        }

        toast.success("Successfully canceled order");
        setIsCancelModalOpen(false);
        // Refresh lại trang hoặc cập nhật state
        window.location.reload();
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Cannot cancel order");
    }
  };

  const handleOpenFeedbackModal = (order) => {
    setSelectedOrder(order);
    // Initialize feedback state for each product
    const initialFeedbacks = {};
    order.orderItems.forEach(item => {
      initialFeedbacks[item.product.productId] = {
        rating: 0,
        comment: ''
      };
    });
    setFeedbacks(initialFeedbacks);
    setIsFeedbackModalOpen(true);
  };

  //Hàm submit feedback
  const handleSubmitFeedback = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // Submit feedback for each product
      const feedbackPromises = Object.entries(feedbacks).map(([productId, feedback]) => {
        if (feedback.rating > 0) { // Only submit if rating was given
          return createRating({
            userId,
            productId,
            rating: feedback.rating,
            comment: feedback.comment
          });
        }
        return Promise.resolve();
      });

      await Promise.all(feedbackPromises);
      toast.success("Thank you for your feedback!");
      setIsFeedbackModalOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  // Replace the existing cancelModal with this new one
  const cancelModal = (
    <Modal
      title="Cancel Order"
      open={isCancelModalOpen}
      onOk={handleConfirmCancel}
      onCancel={() => setIsCancelModalOpen(false)}
      okText="Confirm"
      cancelText="Close"
      okButtonProps={{ 
        style: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
        disabled: !cancelReason 
      }}
    >
      <p className="text-gray-600 mb-4">Please select a reason for cancellation:</p>
      <Radio.Group 
        onChange={(e) => setCancelReason(e.target.value)}
        value={cancelReason}
      >
        <Space direction="vertical">
          {cancelReasons.map((reason) => (
            <Radio key={reason} value={reason}>
              {reason}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </Modal>
  );

  // Add this feedback modal component
  const feedbackModal = (
    <Modal
      title="Rate Your Experience"
      open={isFeedbackModalOpen}
      onOk={handleSubmitFeedback}
      onCancel={() => setIsFeedbackModalOpen(false)}
      width={600}
    >
      {selectedOrder?.orderItems.map((item) => (
        <div key={item.orderItemId} className="mb-6 pb-4 border-b">
          <div className="flex items-center gap-4 mb-3">
            <img
              src={item.product.image}
              alt={item.product.productName}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h4 className="font-medium">{item.product.productName}</h4>
              <Rate
                value={feedbacks[item.product.productId]?.rating || 0}
                onChange={(value) => {
                  setFeedbacks(prev => ({
                    ...prev,
                    [item.product.productId]: {
                      ...prev[item.product.productId],
                      rating: value
                    }
                  }));
                }}
              />
            </div>
          </div>
          <TextArea
            placeholder="Share your thoughts about this product..."
            value={feedbacks[item.product.productId]?.comment || ''}
            onChange={(e) => {
              setFeedbacks(prev => ({
                ...prev,
                [item.product.productId]: {
                  ...prev[item.product.productId],
                  comment: e.target.value
                }
              }));
            }}
            rows={3}
          />
        </div>
      ))}
    </Modal>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-pink-600">My Orders</h1>
          <p className="text-gray-600 mt-2">Track your order status</p>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="grid grid-cols-4 divide-x divide-pink-100">
            {/* Processing Tab */}
            <button
              onClick={() => setActiveTab("PROCESSING")}
              className={`flex flex-col items-center p-6 transition-colors
                ${
                  activeTab === "PROCESSING"
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-600 hover:bg-pink-50"
                }`}
            >
              <FaClock className="text-2xl mb-2" />
              <span className="font-medium">Processing</span>
              <span className="text-sm mt-1">
                {getOrdersByStatus("PROCESSING").length} orders
              </span>
            </button>

            {/* Confirmed Tab */}
            <button
              onClick={() => setActiveTab("SHIPPING")}
              className={`flex flex-col items-center p-6 transition-colors
                ${
                  activeTab === "SHIPPING"
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-600 hover:bg-pink-50"
                }`}
            >
              <FaShippingFast className="text-2xl mb-2" />
              <span className="font-medium">In Delivery</span>
              <span className="text-sm mt-1">
                {getOrdersByStatus("SHIPPING").length} orders
              </span>
            </button>

            {/* Delivered Tab */}
            <button
              onClick={() => setActiveTab("DELIVERED")}
              className={`flex flex-col items-center p-6 transition-colors
                ${
                  activeTab === "DELIVERED"
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-600 hover:bg-pink-50"
                }`}
            >
              <FaCheckCircle className="text-2xl mb-2" />
              <span className="font-medium">Delivered</span>
              <span className="text-sm mt-1">
                {getOrdersByStatus("DELIVERED").length} orders
              </span>
            </button>

            {/* Cancelled Tab */}
            <button
              onClick={() => setActiveTab("CANCELLED")}
              className={`flex flex-col items-center p-6 transition-colors
                ${
                  activeTab === "CANCELLED"
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-600 hover:bg-pink-50"
                }`}
            >
              <FaTimesCircle className="text-2xl mb-2" />
              <span className="font-medium">Cancelled</span>
              <span className="text-sm mt-1">
                {getOrdersByStatus("CANCELLED").length} orders
              </span>
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {getOrdersByStatus(activeTab).length > 0 ? (
            getOrdersByStatus(activeTab).map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 border-b border-pink-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <FaBox className="text-pink-600" />
                      <span className="font-medium text-gray-800">
                        Order #{order.orderId}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <FaDollarSign className="mr-2" />
                        {order.totalPrice.toLocaleString()} ₫
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  {order.orderItems
                    ?.filter((item) => !item.deleted)
                    ?.map((item) => (
                      <div
                        key={item.orderItemId}
                      className="flex items-center space-x-4"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.productName}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.product.productName}
                        </h3>
                        <p className="text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-pink-600 font-medium">
                          {item.unitPrice.toLocaleString()} ₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{order.customer.address}</span>
                  </div>
                  {activeTab !== "CANCELLED" ? (
                    <button
                      onClick={() => {
                        switch (activeTab) {
                          case "PROCESSING":
                            handleOpenCancelModal(order.orderId);
                            break;
                          case "SHIPPING":
                            handleConfirmReceived(order.orderId);
                            break;
                          case "DELIVERED":
                            handleOpenFeedbackModal(order);
                            break;
                          default:
                            break;
                        }
                      }}
                      className="px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
                    >
                      {activeTab === "PROCESSING" && "Cancel Order"}
                      {activeTab === "SHIPPING" && "Confirm Received"}
                      {activeTab === "DELIVERED" && "Rate & Feedback"}
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(
                          `/product-detail/${order.orderItems[0].product.productId}`
                        )
                      }
                      className="px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
                    >
                      Buy again
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found in this status</p>
            </div>
          )}
        </div>
      </div>
      {cancelModal}
      {feedbackModal}
    </div>
  );
}

export default OrderStatusPage;

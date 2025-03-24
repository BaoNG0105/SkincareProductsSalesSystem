import { useState, useEffect } from "react";
import {
  getOrderByStatus,
  updateOrderStatusByOrderId,
} from "../../../services/api.order";
import { updateProductQuantity } from "../../../services/api.product";
import { FiCheck, FiX } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrderByStatus("processing");
      if (response) {
        const formattedOrders = response.map((order) => ({
          key: order.orderId.toString(),
          name: order.customer?.userName || "N/A",
          totalPrice: order.totalPrice,
          date: new Date(order.createdAt).toLocaleDateString(),
          status: order.status,
          address: order.customer?.address || "N/A",
          avatar: order.customer?.avatar || "default_avatar_url",
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      // Gọi API để update status thành shipping
      const response = await updateOrderStatusByOrderId(orderId, "shipping");

      if (response) {
        // Refresh lại danh sách orders
        await fetchOrders();
        toast.success("Order status updated to shipping successfully");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleRefuseOrder = async (orderId) => {
    // Hiện confirm alert trước khi refuse
    const isConfirmed = window.confirm(
      "Are you sure you want to refuse this order?"
    );

    if (isConfirmed) {
      try {
        // Tìm order cần hủy để lấy thông tin orderItems
        // const orderToRefuse = orders.find(order => order.key === orderId);
        
        // Gọi API để update status thành cancelled
        const response = await updateOrderStatusByOrderId(orderId, "cancelled");

        if (response) {
          // Hoàn lại số lượng cho các sản phẩm trong order
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

          // Refresh lại danh sách orders
          await fetchOrders();
          toast.success("Order has been refused successfully");
        }
      } catch (error) {
        console.error("Error refusing order:", error);
        toast.error("Failed to refuse order");
      }
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <HiOutlineShoppingBag className="text-3xl text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Processing Orders
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.key}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {order.totalPrice} VND
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{order.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAcceptOrder(order.key)}
                        className="text-green-600 hover:text-green-900 transition-colors flex items-center gap-1"
                        title="Accept Order"
                      >
                        <FiCheck className="w-5 h-5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleRefuseOrder(order.key)}
                        className="text-red-600 hover:text-red-900 transition-colors flex items-center gap-1"
                        title="Refuse Order"
                      >
                        <FiX className="w-5 h-5" />
                        <span>Refuse</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;

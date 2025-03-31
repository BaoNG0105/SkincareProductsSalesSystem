import { useState, useEffect } from "react";
import {
  getOrderByStatus,
  updateOrderStatusByOrderId,
} from "../../../services/api.order";
import { updateProductQuantity } from "../../../services/api.product";
import { FiCheck, FiX } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { toast } from "react-toastify";
import { Table, Button, Modal } from "antd";

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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
    Modal.confirm({
      title: 'Are you sure you want to refuse this order?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          // Gọi API để update status thành cancelled
          const response = await updateOrderStatusByOrderId(orderId, "cancelled");

          if (response) {
            // Hoàn lại số lượng cho các sản phẩm trong order
            for (const orderItem of response.orderItems) {
              try {
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
      },
    });
  };

  // Define columns for the Table
  const columns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price} VND`,
      sorter: (a, b) => a.totalPrice - b.totalPrice
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date)
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-3">
          <Button
            type="primary"
            className="bg-green-600 hover:bg-green-700"
            icon={<FiCheck />}
            onClick={() => handleAcceptOrder(record.key)}
          >
            Accept
          </Button>
          <Button
            danger
            icon={<FiX />}
            onClick={() => handleRefuseOrder(record.key)}
          >
            Refuse
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <HiOutlineShoppingBag className="text-3xl text-indigo-600" />
          <h1 className="text-2xl font-bold">Processing Orders</h1>
        </div>
      </div>

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="key"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`
        }}
      />
    </div>
  );
}

export default OrderPage;

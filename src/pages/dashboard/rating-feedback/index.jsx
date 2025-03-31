import { useEffect, useState } from "react";
import { getAllRatings } from "../../../services/api.rating";
import { FaStar } from "react-icons/fa";
import { HiOutlineStar } from "react-icons/hi2";
import { format } from "date-fns";
import { Table } from "antd";

const RatingFeedbackDashboardPage = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getAllRatings();
        setRatings(data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <div className="flex items-center">
          <img
            src={record.customer.profileImage}
            alt={record.customer.userName}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <span>{record.customer.userName}</span>
        </div>
      ),
      sorter: (a, b) => a.customer.userName.localeCompare(b.customer.userName),
    },
    {
      title: "Product",
      key: "product",
      render: (_, record) => (
        <div className="flex items-center">
          <img
            src={record.product.image}
            alt={record.product.productName}
            className="w-10 h-10 rounded object-cover mr-3"
          />
          <span>{record.product.productName}</span>
        </div>
      ),
      sorter: (a, b) =>
        a.product.productName.localeCompare(b.product.productName),
    },
    {
      title: "Rating",
      key: "rating",
      render: (_, record) => (
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`w-4 h-4 ${
                index < record.rating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.product.price),
      sorter: (a, b) => a.product.price - b.product.price,
    },
    {
      title: "Date",
      key: "date",
      render: (_, record) => format(new Date(record.createdAt), "dd/MM/yyyy"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <HiOutlineStar className="text-3xl text-indigo-600" />
          <h1 className="text-2xl font-bold">Rating Feedback Management</h1>
        </div>
      </div>

      <Table
        dataSource={ratings}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} ratings`,
        }}
      />
    </div>
  );
};

export default RatingFeedbackDashboardPage;

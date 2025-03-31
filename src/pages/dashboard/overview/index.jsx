import { useEffect, useState } from "react";
import { Table } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { getProductSales } from "../../../services/api.sales";
import { getProductById } from "../../../services/api.product";
import { getUsers } from "../../../services/api.user";
import { getOrderByStatus } from "../../../services/api.order";
import { getAllRatings } from "../../../services/api.rating";

function OverviewDashboardPage() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [ratingStats, setRatingStats] = useState([]);

  // Fetch user cho bảng thống kê người dùng
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const users = await getUsers();

        const staffCount = users.filter((user) => user.role === "Staff").length;
        const managerCount = users.filter(
          (user) => user.role === "Manager"
        ).length;
        const customerCount = users.filter(
          (user) => user.role === "Customer"
        ).length;

        setUserStats([
          { name: "Staff", value: staffCount },
          { name: "Manager", value: managerCount },
          { name: "Customer", value: customerCount },
        ]);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, []);

  // Fetch order cho bảng thống kê đơn hàng
  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const statuses = ["PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED"];
        const orderData = await Promise.all(
          statuses.map(async (status) => {
            const orders = await getOrderByStatus(status);
            return {
              name: status.charAt(0) + status.slice(1).toLowerCase(),
              value: orders.length,
            };
          })
        );
        setOrderStats(orderData);
      } catch (error) {
        console.error("Error fetching order stats:", error);
      }
    };

    fetchOrderStats();
  }, []);

  // Fetch rating cho bảng thống kê đánh giá
  useEffect(() => {
    const fetchRatingStats = async () => {
      try {
        const ratings = await getAllRatings();
        const ratingCounts = Array(5).fill(0); // Array for ratings 1-5

        // Count ratings for each star level
        ratings.forEach(rating => {
          if (rating.rating >= 1 && rating.rating <= 5) {
            ratingCounts[rating.rating - 1]++;
          }
        });

        // Format data for the chart
        const ratingData = ratingCounts.map((count, index) => ({
          name: `${index + 1} Star`,
          value: count
        }));

        setRatingStats(ratingData);
      } catch (error) {
        console.error("Error fetching rating stats:", error);
      }
    };

    fetchRatingStats();
  }, []);

    // Fetch data cho bảng sản phẩm bán ra
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const productSales = await getProductSales();
  
          // Fetch product details cho từng sale bằng Promise.all
          const salesWithDetails = await Promise.all(
            productSales.map(async (sale) => {
              const productDetail = await getProductById(sale.productId);
              return {
                key: sale.productId,
                productId: sale.productId,
                productName: productDetail
                  ? productDetail.productName
                  : `Product ${sale.productId}`,
                quantitySold: sale.quantitySold,
              };
            })
          );
  
          // Sắp xếp theo số lượng bán giảm dần
          salesWithDetails.sort((a, b) => b.quantitySold - a.quantitySold);
          setSalesData(salesWithDetails);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

  //Tạo table cho Product Sales Statistics
  const columns = [
    {
      title: "ID Product",
      dataIndex: "productId",
      key: "productId",
      width: "20%",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: "50%",
    },
    {
      title: "Quantity Sold",
      dataIndex: "quantitySold",
      key: "quantitySold",
      width: "30%",
      sorter: (a, b) => a.quantitySold - b.quantitySold,
    },
  ];

  return (
    <div className="p-6">
      {/* User Statistics Chart */}
      <div className="mb-8">
        <h2 className="text-2xl text-center font-bold mb-4">User Statistics</h2>
        <div className="flex justify-center">
          <BarChart
            width={600}
            height={300}
            data={userStats}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Quantity" label={{ position: "top" }}>
              {userStats.map((entry, index) => {
                const colors = {
                  Staff: "#FF6B6B", // Đỏ nhạt
                  Manager: "#4ECDC4", // Xanh ngọc
                  Customer: "#45B7D1", // Xanh dương
                };
                return <Cell key={`cell-${index}`} fill={colors[entry.name]} />;
              })}
            </Bar>
          </BarChart>
        </div>
      </div>

      {/* Order Statistics Chart */}
      <div className="mb-8">
        <h2 className="text-2xl text-center font-bold mb-4">
          Order Statistics
        </h2>
        <div className="flex justify-center">
          <BarChart
            width={600}
            height={300}
            data={orderStats}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              name="Number of Orders"
              label={{ position: "top" }}
            >
              {orderStats.map((entry, index) => {
                const colors = {
                  Processing: "#FFB347", // Cam
                  Shipping: "#87CEEB", // Xanh dương nhạt
                  Delivered: "#90EE90", // Xanh lá
                  Cancelled: "#FF6B6B", // Đỏ nhạt
                };
                return <Cell key={`cell-${index}`} fill={colors[entry.name]} />;
              })}
            </Bar>
          </BarChart>
        </div>
      </div>

      {/* Rating Statistics Chart */}
      <div className="mb-8">
        <h2 className="text-2xl text-center font-bold mb-4">Rating Statistics</h2>
        <div className="flex justify-center">
          <BarChart
            width={600}
            height={300}
            data={ratingStats}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 30]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Number of Ratings" label={{ position: "top" }}>
              {ratingStats.map((entry, index) => {
                const colors = [
                  "#FF6B6B",  // 1 star - Đỏ
                  "#FFB347",  // 2 star - Cam
                  "#FFDE5A",  // 3 star - Vàng
                  "#98FB98",  // 4 star - Xanh lá nhạt
                  "#32CD32"   // 5 star - Xanh lá đậm
                ];
                return <Cell key={`cell-${index}`} fill={colors[index]} />;
              })}
            </Bar>
          </BarChart>
        </div>
      </div>

      {/* Product Sales Table */}
      <h2 className="text-2xl text-center font-bold mb-4">
        Product Sales Statistics
      </h2>
      <Table
        columns={columns}
        dataSource={salesData}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} products`,
        }}
      />
    </div>
  );
}

export default OverviewDashboardPage;

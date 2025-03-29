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

function OverviewPage() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState([]);

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

export default OverviewPage;

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi2";
import api from "../../../config/axios";
import { deleteUserByUserId } from "../../../services/api.user";
import { toast } from "react-toastify";
import { Table, Modal, Button } from 'antd';

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapStatus = (status) => {
    return status ? "Active" : "Inactive";
  };

  const mapGender = (gender) => {
    return gender === "Male" ? "Male" : "Female";
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      console.log("Raw API Response:", response.data);
      if (response.data) {
        const customerData = response.data.filter(
          (user) => user.role === "Customer"
        );
        const mappedCustomers = customerData.map((customer) => ({
          ...customer,
          key: customer.id.toString(),
          status: mapStatus(customer.status),
          gender: mapGender(customer.gender),
        }));
        console.log("Mapped Customers:", mappedCustomers);
        setCustomers(mappedCustomers);
      }
    } catch (err) {
      console.error("Error loading customer list:", err);
      setError("Unable to load customer list");
      toast.error("Unable to load customer list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this customer?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await deleteUserByUserId(id);
          if (response) {
            setCustomers((prevCustomers) =>
              prevCustomers.filter((customer) => customer.id !== id)
            );
            toast.success("Delete customer successfully");
          }
        } catch (err) {
          console.error("Error deleting customer:", err);
          toast.error("Cannot delete customer");
        }
      },
    });
  };

  const formatDate = (date) => {
    if (!date) return "Not updated";
    try {
      return new Date(date).toLocaleDateString("en-US");
    } catch (error) {
      console.error("Error parsing date:", error);
      return date;
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'userName',
      key: 'userName',
      render: (userName) => userName || 'Not updated'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date) => formatDate(date)
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-semibold
            ${status === "Active" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
            }`}
        >
          {status}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<FaTrash />}
          onClick={() => {
            if (record.role === "Manager") {
              toast.warning("Cannot delete Manager account");
              return;
            }
            handleDelete(record.id);
          }}
          danger
        />
      ),
    }
  ];

  if (loading) return <div className="flex justify-center items-center py-8">Loading...</div>;
  if (error) return <div className="flex justify-center items-center py-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <HiOutlineUserGroup className="text-3xl text-indigo-600" />
          <h1 className="text-2xl font-bold">Customer Management</h1>
        </div>
      </div>

      <Table
        dataSource={customers}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`
        }}
      />
    </div>
  );
}

export default CustomerPage;

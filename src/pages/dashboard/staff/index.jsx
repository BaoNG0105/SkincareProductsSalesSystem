/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getUsers,
  deleteUserByUserId,
  createStaff,
} from "../../../services/api.user";
import { Table, Modal, Button, Form, Input, Select, DatePicker } from 'antd';
import { HiOutlineUsers } from "react-icons/hi2";

function StaffDashboardPage() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStaffs();
  }, []);

  const mapStatus = (status) => {
    return status ? "Active" : "Inactive";
  };

  const mapGender = (gender) => {
    return gender === "Male" ? "Male" : "Female";
  };

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      if (response) {
        const staffData = response.filter((user) => user.role === "Staff");
        const mappedStaffs = staffData.map((staff) => ({
          ...staff,
          key: staff.id.toString(),
          status: mapStatus(staff.status),
          gender: mapGender(staff.gender),
        }));
        setStaffs(mappedStaffs);
      }
    } catch (err) {
      console.error("Error loading staff list:", err);
      setError("Unable to load staff list");
      toast.error("Unable to load staff list");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this staff?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await deleteUserByUserId(userId);
          if (response) {
            setStaffs((prevStaffs) =>
              prevStaffs.filter((staff) => staff.id !== userId)
            );
            toast.success("Delete staff successfully");
          }
        } catch (err) {
          console.error("Error when deleting staff:", err);
          toast.error("Cannot delete staff");
        }
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        passwordHash: "123456",
        dateOfBirth: values.dateOfBirth.toISOString(),
      };
      
      const response = await createStaff(submitData);
      if (response) {
        toast.success("Staff created successfully");
        setIsModalOpen(false);
        form.resetFields();
        fetchStaffs();
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      toast.error("Failed to create staff");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not updated";
    try {
      return new Date(date).toLocaleDateString("en-US");
    } catch (error) {
      console.error("Error when formatting date:", error);
      return date;
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'userName',
      key: 'userName',
      render: (userName, record) => (
        <div className="flex items-center">
          <img
            src={record.profileImage || 'default-avatar-url'}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <span>{userName || 'Not updated'}</span>
        </div>
      )
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
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <span className={`font-semibold ${role === "Manager" ? "text-blue-600" : "text-green-600"}`}>
          {role}
        </span>
      )
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
        <span className={`px-2 py-1 rounded-full text-sm font-semibold
          ${status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
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
          <HiOutlineUsers className="text-3xl text-indigo-600" />
          <h1 className="text-2xl font-bold">Staff Management</h1>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          type="primary"
          icon={<FaPlus />}
        >
          Add New Staff
        </Button>
      </div>

      <Table
        dataSource={staffs}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} staffs`
        }}
      />

      <Modal
        title="Add New Staff"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            gender: "Male",
          }}
        >
          <Form.Item
            name="userName"
            label="Full Name"
            rules={[{ required: true, message: 'Please input full name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender!' }]}
          >
            <Select>
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: true, message: 'Please select date of birth!' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="profileImage"
            label="Profile Image URL"
          >
            <Input />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button type="default" onClick={() => setIsModalOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default StaffDashboardPage;

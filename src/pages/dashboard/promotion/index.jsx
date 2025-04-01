import { useEffect, useState } from 'react';
import { getPromotion, postPromotion, updatePromotion, deletePromotion } from '../../../services/api.promotion';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { HiOutlineTag } from 'react-icons/hi2';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { Modal, Form, Input, InputNumber, DatePicker, Switch, Button, Table } from 'antd';
import dayjs from 'dayjs';

const PromotionDashboardPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Lấy danh sách promotion điều kiện available = true
  const fetchPromotions = async () => {
    try {
      const data = await getPromotion();
      const filteredPromotions = data.filter(
        (promotion) => promotion.available === true
      );
      setPromotions(filteredPromotions);
    } catch (error) {
      console.log('Error fetching promotions:', error);
      toast.error('Failed to load promotions');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal create/edit promotion
  const handleOpenModal = (promotion = null) => {
    setSelectedPromotion(promotion);
    if (promotion) {
      form.setFieldsValue({
        ...promotion,
        startDate: dayjs(promotion.startDate),
        endDate: dayjs(promotion.endDate),
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Xử lý submit create/edit promotion
  const handleSubmit = async (values) => {
    try {
      const submitData = {
        code: values.code,
        description: values.description,
        discountPercentage: values.discountPercentage,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        minimumOrderValue: values.minimumOrderValue,
        available: values.available
      };

      if (selectedPromotion) {
        await updatePromotion(selectedPromotion.promotionId, submitData);
        toast.success('Promotion updated successfully');
      } else {
        await postPromotion(submitData);
        toast.success('Promotion created successfully');
      }
      await fetchPromotions();
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error('Operation failed');
    }
  };

  // Xử lý delete promotion
  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this promotion?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deletePromotion(id);
          toast.success('Promotion deleted successfully');
          await fetchPromotions();
        } catch (error) {
          console.log(error);
          toast.error('Delete failed');
        }
      },
    });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  // Tạo cột của bảng
  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Discount',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: (value) => `${value}%`,
      sorter: (a, b) => a.discountPercentage - b.discountPercentage
    },
    {
      title: 'Period',
      key: 'period',
      render: (_, record) => (
        `${format(new Date(record.startDate), 'dd/MM/yyyy')} - ${format(new Date(record.endDate), 'dd/MM/yyyy')}`
      )
    },
    {
      title: 'Min. Order',
      dataIndex: 'minimumOrderValue',
      key: 'minimumOrderValue',
      render: (value) => `$${value}`,
      sorter: (a, b) => a.minimumOrderValue - b.minimumOrderValue
    },
    {
      title: 'Status',
      dataIndex: 'available',
      key: 'available',
      render: (available) => (
        <span className={`px-3 py-1 rounded-full text-sm ${
          available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {available ? 'Active' : 'Inactive'}
        </span>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false }
      ],
      onFilter: (value, record) => record.available === value
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button
            icon={<FaEdit />}
            onClick={() => handleOpenModal(record)}
            style={{ marginRight: '8px' }}
          />
          <Button
            icon={<FaTrash />}
            onClick={() => handleDelete(record.promotionId)}
            danger
          />
        </span>
      ),
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <HiOutlineTag className="text-3xl text-indigo-600" />
          <h1 className="text-2xl font-bold">Promotion Management</h1>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          type="primary"
          icon={<FaPlus />}
        >
          Add Promotion
        </Button>
      </div>

      <Table
        dataSource={promotions}
        columns={columns}
        rowKey="promotionId"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} promotions`
        }}
      />

      <Modal
        title={selectedPromotion ? 'Edit Promotion' : 'Create Promotion'}
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
            available: true,
            discountPercentage: 0,
            minimumOrderValue: 0,
          }}
        >
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Please input promotion code!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="discountPercentage"
            label="Discount Percentage"
            rules={[{ required: true, message: 'Please input discount percentage!' }]}
          >
            <InputNumber
              min={0}
              max={100}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[
              { required: true, message: 'Please select start date!' },
              {
                validator: (_, value) => {
                  if (value && value.isBefore(dayjs(), 'day')) {
                    return Promise.reject('Start date cannot be before today');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <DatePicker 
              className="w-full" 
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            rules={[
              { required: true, message: 'Please select end date!' },
              {
                validator: (_, value) => {
                  const startDate = form.getFieldValue('startDate');
                  if (startDate && value && value.isBefore(startDate)) {
                    return Promise.reject('End date must be after start date');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <DatePicker 
              className="w-full"
              disabledDate={(current) => {
                const startDate = form.getFieldValue('startDate');
                return (current && current < dayjs().startOf('day')) || 
                       (startDate && current && current < startDate);
              }}
            />
          </Form.Item>

          <Form.Item
            name="minimumOrderValue"
            label="Minimum Order Value"
            rules={[{ required: true, message: 'Please input minimum order value!' }]}
          >
            <InputNumber
              min={0}
              formatter={value => `$ ${value}`}
              parser={value => value.replace('$ ', '')}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="available"
            label="Available"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button type="default" onClick={() => setIsModalOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {selectedPromotion ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionDashboardPage;

import { Button, Modal, Table, Form, Input, Avatar, message } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { PlusOutlined, ShoppingOutlined } from "@ant-design/icons";
import {
  getProduct,
  postProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/api.product";

function ProductDashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProduct();

      const formattedProducts = data.map((product) => ({
        key: product.productId,
        productId: product.productId,
        productName: product.productName,
        quantity: product.stockQuantity,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        status: product.status,
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (product) => {
    try {
      if (
        !product.productName ||
        !product.price ||
        !product.category ||
        !product.quantity
      ) {
        message.error("Please fill in all required fields");
        return;
      }

      if (product.price < 0 || product.quantity < 0) {
        message.error("Price and quantity cannot be negative");
        return;
      }

      const submitData = {
        productName: product.productName.trim(),
        description: product.description?.trim() || "",
        category: product.category.trim(),
        price: parseFloat(product.price),
        stockQuantity: parseInt(product.quantity),
        image: product.image?.trim() || "",
        status: true,
        faqs: [],
      };

      await postProduct(submitData);
      message.success("Product added successfully");
      setIsOpen(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      message.error("Failed to add product");
    }
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      productName: record.productName,
      price: record.price,
      description: record.description,
      category: record.category,
      quantity: record.quantity,
      image: record.image,
    });
    setIsOpen(true);
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      if (
        !updatedProduct.productName ||
        !updatedProduct.price ||
        !updatedProduct.category ||
        !updatedProduct.quantity
      ) {
        message.error("Please fill in all required fields");
        return;
      }

      if (updatedProduct.price < 0 || updatedProduct.quantity < 0) {
        message.error("Price and quantity cannot be negative");
        return;
      }

      const submitData = {
        productName: updatedProduct.productName.trim(),
        description: updatedProduct.description?.trim() || "",
        category: updatedProduct.category.trim(),
        price: parseFloat(updatedProduct.price),
        stockQuantity: parseInt(updatedProduct.quantity),
        image: updatedProduct.image?.trim() || "",
      };

      const response = await updateProduct(
        updatedProduct.productId,
        submitData
      );

      if (response) {
        message.success("Product updated successfully");
        setIsOpen(false);
        setEditingProduct(null);
        form.resetFields();
        fetchProducts();
      } else {
        message.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Failed to update product");
    }
  };

  const handleDelete = async (productId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await deleteProduct(productId);
          if (response) {
            message.success("Product deleted successfully");
            fetchProducts();
          } else {
            message.error("Failed to delete product");
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          message.error("Failed to delete product");
        }
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => <Avatar src={text} size={64} />,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString("vi-VN")} VND`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: Array.from(new Set(products.map((p) => p.category))).map(
        (category) => ({
          text: category,
          value: category,
        })
      ),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button icon={<FaEdit />} onClick={() => handleEdit(record)} />
          <Button
            icon={<FaTrash />}
            onClick={() => handleDelete(record.productId)}
            danger
          />
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <ShoppingOutlined className="text-3xl text-indigo-600" />
          <h1 className="text-2xl font-bold">Product Management</h1>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            form.resetFields();
            setIsOpen(true);
          }}
          type="primary"
          icon={<PlusOutlined />}
        >
          Add Product
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        loading={loading}
        rowKey="productId"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} products`,
        }}
      />

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
          setEditingProduct(null);
          form.resetFields();
        }}
        okText="Save"
        cancelText="Cancel"
        maskClosable={false}
        destroyOnClose={true}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              const productData = {
                ...values,
                productId: editingProduct?.productId,
              };

              if (editingProduct) {
                handleUpdate(productData);
              } else {
                handleAdd(productData);
              }
            })
            .catch((info) => {
              console.log("Validation Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingProduct || {}}
        >
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: "Please enter product name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please enter price!" },
              {
                validator: (_, value) => {
                  const numValue = Number(value);
                  if (isNaN(numValue)) {
                    return Promise.reject("Please enter a valid number!");
                  }
                  if (numValue < 0) {
                    return Promise.reject(
                      "Price must be greater than or equal to 0!"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" min={0} step="any" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter category!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              { required: true, message: "Please enter quantity!" },
              {
                validator: (_, value) => {
                  if (value >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Quantity must be greater than or equal to 0!"
                  );
                },
              },
            ]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item label="Image URL" name="image">
            <Input placeholder="Enter image URL" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProductDashboardPage;

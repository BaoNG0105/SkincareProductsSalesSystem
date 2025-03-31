import api from "../config/axios";
import { toast } from "react-toastify";

// API get all orders
export const getAllOrders = async () => {
  try {
    const response = await api.get("/order");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// API get orderId and status by userId
export const getOrderIdAndStatusByUserId = async (customerId) => {
  try {
    const response = await api.get(`order/${customerId}/status`, {
      params: { status: "PENDING" },
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// API get order by userId
export const getOrderByUserId = async (customerId) => {
  try {
    const response = await api.get(`order/customer/${customerId}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// API create orderId (if orderId is not exist)
export const addOrderId = async (submitData) => {
  try {
    const response = await api.post("order", submitData);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// API get order-items by orderId
export const getOrderItemsByOrderId = async (orderId) => {
  try {
    const response = await api.get(`order-items/order/${orderId}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// API add order-items to add product to cart
export const addOrderItems = async (submitData) => {
  try {
    const response = await api.post("order-items", submitData);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// API update order-items by orderId & productId
export const updateOrderItemsByOrderId = async (id, submitData) => {
  try {
    const response = await api.put(`order-items/${id}`, submitData);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// API delete order-items by orderItemId
export const deleteOrderItemsByOrderItemId = async (id) => {
  try {
    const response = await api.delete(`order-items/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// API update orderStatus by OrderId
export const updateOrderStatusByOrderId = async (orderId, status) => {
  try {
    const response = await api.put(`order/${orderId}/status?status=${status}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// API update orderPrice by OrderId
export const updateOrderPriceByOrderId = async (orderId, price) => {
  try {
    const response = await api.put(`order/${orderId}/price?price=${price}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API get order by status
export const getOrderByStatus = async (status) => {
  try {
    const response = await api.get(`order/status/${status}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

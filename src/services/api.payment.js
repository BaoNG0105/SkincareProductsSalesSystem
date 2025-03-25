import api from "../config/axios";
import { toast } from "react-toastify";

// API get payment by orderId
export const getPaymentByOrderId = async (orderId) => {
  try {
    const response = await api.get("order/create-url", {
      params: {
        orderId: orderId,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

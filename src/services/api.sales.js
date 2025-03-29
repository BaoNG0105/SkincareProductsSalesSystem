import api from "../config/axios";
import { toast } from "react-toastify";

//API get product-sales
export const getProductSales = async () => {
    try {
        const response = await api.get("order/api/orders/product-sales");
        return response.data;
    } catch (error) {
        toast.error(error.response.data);
    }
}
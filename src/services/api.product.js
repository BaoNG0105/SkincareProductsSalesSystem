import api from "../config/axios";
import { toast } from "react-toastify";

//API get all product
export const getProduct = async () => {
  try {
    const response = await api.get("products");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API get product by id
export const getProductById = async (id) => {
  try {
    const response = await api.get(`products/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API get related products
export const getRelatedProducts = async (category, id) => {
  try {
    const response = await api.get(`products`);
    const allProducts = response.data;
    // Filter products by category and exclude the current product
    const relatedProducts = allProducts.filter(
      (product) => product.category === category && product.id !== id
    );
    // Shuffle the array to get random products
    const shuffledProducts = relatedProducts.sort(() => 0.5 - Math.random());
    // Return only 3 random products
    return shuffledProducts.slice(0, 3);
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API post product
export const postProduct = async (submitData) => {
  try {
    const response = await api.post("products", submitData);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API update product
export const updateProduct = async (id, submitData) => {
  try {
    const response = await api.put(`products/${id}`, submitData);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API delete product
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`products/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API update product quantity
export const updateProductQuantity = async (id, submitData) => {
  try {
    const response = await api.put(`products/${id}/stock-quantity?quantity=${submitData.quantity}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
    throw error;
  }
};

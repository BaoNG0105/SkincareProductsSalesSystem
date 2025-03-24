import api from "../config/axios";
import { toast } from "react-toastify";

//API get all promotion
export const getPromotion = async () => {
  try {
    const response = await api.get("promotions");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API get promotion by id
export const getPromotionById = async (id) => {
  try {
    const response = await api.get(`promotions/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API get promotion by code
export const getPromotionByCode = async (code) => {
  try {
    const response = await api.get(`promotions/code`, {
      params: { code: code } 
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API post promotion
export const postPromotion = async (submitData) => {
  try {
    const response = await api.post("promotions", submitData);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API update promotion
export const updatePromotion = async (id, submitData) => {
  try {
    const response = await api.put(`promotions/${id}`, submitData);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

//API delete promotion
export const deletePromotion = async (id) => {
  try {
    const response = await api.delete(`promotions/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

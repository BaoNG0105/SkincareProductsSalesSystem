import api from "../config/axios";
import { toast } from "react-toastify";

//API create rating
export const createRating = async (ratingData) => {
    try {
        const response = await api.post("/ratings-feedback", ratingData);
        return response.data;
    } catch (error) {
        console.error("Error creating rating:", error);
        toast.error("Failed to create rating");
        throw error;
    }
}

//API get all rating
export const getAllRatings = async () => {
    try {
        const response = await api.get("/ratings-feedback");
        return response.data;
    } catch (error) {
        console.error("Error getting all rating:", error);
        toast.error("Failed to get all rating");
        throw error;
    }
}


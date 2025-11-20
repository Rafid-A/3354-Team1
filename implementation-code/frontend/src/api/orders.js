import { data } from "react-router-dom";
import apiClient from "./axios";

export const getAllUserOrders = async () => {
  const res = await apiClient.get(`/orders`);
  return res.data;
};

export const getAllVendorOrders = async () => {
  const res = await apiClient.get("/orders/vendor");
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await apiClient.get(`/orders/${orderId}`);
  return res.data;
};

export const updateStatus = async (itemId, newStatus) => {
  const res = await apiClient.patch(`/orders/update-status/${itemId}`, {
    shippingStatus: newStatus,
  });
  return res.data;
};

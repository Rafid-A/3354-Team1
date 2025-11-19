import apiClient from "./axios";

export const getAllUserOrders = async () => {
  const res = await apiClient.get(`/orders`);
  return res.data;
};

export const getAllVendorOrders = async () => {};

export const getOrderById = async (orderId) => {
  const res = await apiClient.get(`/orders/${orderId}`);
  return res.data;
};

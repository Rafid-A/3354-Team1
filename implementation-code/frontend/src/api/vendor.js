import apiClient from "./axios";

export const getVendorById = async (vendorId) => {
  const res = await apiClient.get(`/vendors/${vendorId}`);
  return res.data;
};

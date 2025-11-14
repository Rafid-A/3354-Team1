import apiClient from "./axios";

export const getAllProducts = async () => {
  const res = await apiClient.get(`/products`);
  return res.data;
};

export const getAllCategories = async () => {
  const res = await apiClient.get(`/categories`);
  return res.data;
};

export const getAllBrands = async () => {
  const res = await apiClient.get(`/brands`);
  return res.data;
};

export const getProductById = async (productId) => {
  const res = await apiClient.get(`/products/${productId}`);
  return res.data;
};

export const getVendorProducts = async (vendorId) => {
  const res = await apiClient.get(`/vendors/${vendorId}/products`);
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await apiClient.post(`/products`, formData);
  return res.data;
};

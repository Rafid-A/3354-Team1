import apiClient from "./axios";

export const checkoutSession = async (body) => {
  const res = await apiClient.post("/checkout/create-checkout-session", body);
  return res.data;
};

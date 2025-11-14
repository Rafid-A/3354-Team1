import apiClient from "./axios";

export const signup = async (name, email, password) => {
  const res = await apiClient.post(`/auth/signup`, {
    name,
    email,
    password,
  });
  return res.data;
};

export const login = async (email, password) => {
  const res = await apiClient.post(`/auth/login`, { email, password });
  return res.data;
};

export const getUserProfile = async () => {
  const res = await apiClient.get(`/auth/profile`);
  return res.data;
};

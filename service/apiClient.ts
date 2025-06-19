import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

const ApiClient = () => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const session = await getSession();

      if (session?.user?.access_token) {
        config.headers.set(
          "Authorization",
          `Bearer ${session.user.access_token}`
        );
      } else {
        await signOut({ callbackUrl: "/login" });
        throw new axios.Cancel("No token available, user signed out.");
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => ({
      ...response,
      success: true,
      message: "Request successful",
      request: response.data,
    }),
    async (error) => {
      if (error?.response?.status === 401) {
        await signOut({ callbackUrl: "/login" });
        return Promise.reject({
          success: false,
          message: "Unauthorized: Session expired",
          request: error.response?.data || null,
          ...error.response,
        });
      }

      return Promise.reject({
        success: false,
        message: error.message || "Request failed",
        request: error.response?.data || null,
        ...error.response,
      });
    }
  );

  return api;
};

export const api = ApiClient();

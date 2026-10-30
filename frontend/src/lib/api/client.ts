import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080",

  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const storedAuth =
        localStorage.getItem("insurance-auth");

      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);

          const token =
            parsed?.state?.accessToken;

          if (token) {
            config.headers.Authorization =
              `Bearer ${token}`;
          }
        } catch {
          // Ignore invalid persisted auth state.
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("insurance-auth");

      const pathname =
        window.location.pathname;

      const publicRoutes = [
        "/auth/login",
        "/auth/signup",
        "/auth/forgot-password",
        "/auth/reset-password",
      ];

      const isPublicRoute =
        publicRoutes.some((route) =>
          pathname.startsWith(route)
        );

      if (!isPublicRoute) {
        window.location.href =
          `/auth/login?redirect=${encodeURIComponent(
            pathname
          )}`;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

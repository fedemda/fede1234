import axios from "axios";

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && error.response.data?.message === "Token expirado, inicie sesión nuevamente") {
      console.warn("⚠️ Token expirado, cerrando sesión...");
      sessionStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);


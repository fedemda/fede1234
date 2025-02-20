import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("📩 Token enviado con la solicitud:", token);
    } else {
      console.log("❌ No hay token disponible en sessionStorage");
    }

    return config;
  },
  (error) => Promise.reject(error)
);


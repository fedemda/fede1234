import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token agregado a la solicitud:", token);
    } else {
      console.log("No hay token disponible en localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

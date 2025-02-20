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

// Manejar errores en las respuestas
axios.interceptors.response.use(
  response => response,
  error => {
    console.log("❌ Error en respuesta API:", error.response?.status, error.response?.data);

    // Verificar si el token expiró antes de borrar sesión
    if (error.response?.status === 401) {
      console.warn("⚠️ Error 401 detectado. NO eliminando sesión automáticamente.");
    }

    return Promise.reject(error);
  }
);

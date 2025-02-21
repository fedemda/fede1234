import "./LoginRegister.css";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

// Configurar SweetAlert2 para React
const MySwal = withReactContent(Swal);

// Obtener la URL del backend desde la variable de entorno, con valor por defecto
const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function LoginRegister({ onLogin }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showLogin, setShowLogin] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(false);

  // Hook para navegación
  const navigate = useNavigate();

  console.log("API_URL:", API_URL);

  // Alternar entre formularios de Login y Registro
  const toggleForm = () => {
    setShowLogin(!showLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showLogin) {
        const response = await axios.post(`${API_URL}/login`, {
          email: formData.email,
          password: formData.password,
        });
      
        console.log("🔑 Token recibido del backend:", response.data.token);
      
        if (!response.data.token) {
          throw new Error("Token inválido o no recibido");
        }
      
        // Guardar el token en localStorage y sessionStorage
        localStorage.setItem("token", response.data.token);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userName", response.data.name);
      
        // Llamar al callback onLogin para actualizar el estado en App
        onLogin(response.data.name, response.data.token);
      
        // Mostrar alert de éxito y luego redirigir al dashboard
        await MySwal.fire({
          title: "Éxito",
          text: "Inicio de sesión exitoso",
          icon: "success",
        });
      
        // Redirigir al dashboard usando navigate
        navigate("/dashboard");
      
      
      } else {
        const response = await axios.post(`${API_URL}/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        MySwal.fire({
          title: "Éxito",
          text: response.data.message,
          icon: "success",
        });

        setFormData({ name: "", email: "", password: "" });
        setShowLogin(true);
      }
    } catch (error) {
      console.error("⚠️ Error en autenticación:", error);
      MySwal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error en la solicitud. Por favor, intenta de nuevo.",
        icon: "error",
      });
    }
  };

  return (
    <div className="form-container">
      <img src={logo} alt="Logo" />
      <h1>{showLogin ? "Iniciar Sesión" : "Registrarse"}</h1>
      <form onSubmit={handleSubmit}>
        {/* Campo de nombre solo para registro */}
        {!showLogin && (
          <input
            type="text"
            name="name"
            placeholder="Ingresa tu nombre"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Ingresa tu correo"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Ingresa tu contraseña"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{showLogin ? "Iniciar Sesión" : "Registrarse"}</button>
      </form>
      {showToggleButton && (
        <button className="toggle" onClick={toggleForm}>
          {showLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia Sesión"}
        </button>
      )}
    </div>
  );
}

export default LoginRegister;

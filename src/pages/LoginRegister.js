import "./LoginRegister.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import logo from "../assets/logo.png";

const MySwal = withReactContent(Swal);
const API_URL = process.env.REACT_APP_BACKEND_URL;

function LoginRegister({ onLogin }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const userName = localStorage.getItem("userName");
      if (userName && typeof onLogin === "function") {
        onLogin(userName);
      }
    }
  }, [onLogin]);

  const toggleForm = () => {
    setShowLogin(!showLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      MySwal.fire({
        title: "Error",
        text: "Por favor, ingresa un correo electrónico válido.",
        icon: "error",
      });
      return;
    }
    if (!validatePassword(formData.password)) {
      MySwal.fire({
        title: "Error",
        text: "La contraseña debe tener al menos 6 caracteres.",
        icon: "error",
      });
      return;
    }
    setIsLoading(true);
    try {
      const endpoint = showLogin ? "login" : "register";
      const response = await axios.post(`${API_URL}/${endpoint}`, formData);
      if (showLogin) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.name);
        MySwal.fire({
          title: "Éxito",
          text: response.data.message,
          icon: "success",
        }).then(() => {
          if (typeof onLogin === "function") {
            onLogin(response.data.name);
          }
        });
      } else {
        MySwal.fire({
          title: "Éxito",
          text: response.data.message,
          icon: "success",
        });
        setFormData({ name: "", email: "", password: "" });
        setShowLogin(true);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      MySwal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error en la solicitud. Por favor, intenta de nuevo.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <img src={logo} alt="Logo" />
      <h1>{showLogin ? "Iniciar Sesión" : "Registrarse"}</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Cargando..." : showLogin ? "Iniciar Sesión" : "Registrarse"}
        </button>
      </form>
      <button className="toggle" onClick={toggleForm}>
        {showLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia Sesión"}
      </button>
    </div>
  );
}

export default LoginRegister;

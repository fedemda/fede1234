import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";
import Sidebar from "./components/dashboard/Sidebar";
import "./axiosConfig";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Verifica el estado de inicio de sesión al cargar la aplicación
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedName = sessionStorage.getItem("userName");

    console.log("🔍 Verificando sesión...");
    console.log("Token en sessionStorage:", token);
    console.log("Usuario en sessionStorage:", storedName);

    if (token && storedName) {
      setIsLoggedIn(true);
      setUserName(storedName);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  // Manejar inicio de sesión
  const handleLogin = (name, token) => {
    console.log("✅ Guardando sesión:", { name, token });

    if (!token) {
      console.error("⚠️ No se recibió un token válido. No se iniciará sesión.");
      return;
    }

    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userName", name);

    setUserName(name);
    setIsLoggedIn(true);
  };

  // Manejar cierre de sesión
  const handleLogout = () => {
    console.log("❌ Cierre de sesión manual");
    sessionStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <LoginRegister onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <div style={{ display: "flex", height: "100vh", width: "66.11vw" }}>
                <Sidebar userName={userName} onLogout={handleLogout} />
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    backgroundColor: "#f4f4f4",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "95%",
                      maxWidth: "1800px",
                      textAlign: "center",
                      position: "relative",
                      top: "-28px",
                    }}
                  >
                    <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginTop: "0" }}>
                      Sistema de Gestión Institucional
                    </h1>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;


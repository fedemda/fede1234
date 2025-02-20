import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";
import Sidebar from "./components/dashboard/Sidebar";
import "./axiosConfig";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // 🔹 Función para verificar sesión
  const checkSession = useCallback(() => {
    console.log("🔍 Verificando estado de sesión...");

    const token = sessionStorage.getItem("token");
    const storedName = sessionStorage.getItem("userName");

    console.log("📩 Token en sessionStorage:", token);
    console.log("👤 Usuario en sessionStorage:", storedName);

    if (token && storedName) {
      console.log("✅ Sesión detectada, verificando si hay cambios...");
      
      setIsLoggedIn((prevState) => prevState !== true ? true : prevState);
      setUserName((prevName) => prevName !== storedName ? storedName : prevName);
    } else {
      console.warn("⚠️ No hay sesión activa.");
      
      setIsLoggedIn((prevState) => prevState !== false ? false : prevState);
      setUserName("");
    }
  }, []);

  // 🔹 useEffect para verificar sesión solo una vez
  useEffect(() => {
    checkSession();
  }, [checkSession]); // 🔹 Se ejecuta SOLO una vez al inicio

  const handleLogin = (name, token) => {
    console.log("✅ Iniciando sesión con usuario:", name);
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userName", name);
    setUserName(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log("🚪 Cerrando sesión...");
    sessionStorage.clear();
    setUserName("");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? <LoginRegister onLogin={handleLogin} /> : <Navigate to="/dashboard" />
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
                  <div style={{ width: "95%", maxWidth: "1800px", textAlign: "center", position: "relative", top: "-28px" }}>
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



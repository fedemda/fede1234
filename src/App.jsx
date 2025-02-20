import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";
import Sidebar from "./components/dashboard/Sidebar";
import "./axiosConfig";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); 
  const [userName, setUserName] = useState("");
  const hasCheckedSession = useRef(false); // ⬅️ Control para evitar múltiples ejecuciones

  useEffect(() => {
    if (hasCheckedSession.current) return; // ⬅️ Si ya se ejecutó, no volver a hacerlo
    hasCheckedSession.current = true;

    console.log("🔍 Verificando estado de sesión...");
    
    const token = sessionStorage.getItem("token");
    const storedName = sessionStorage.getItem("userName");

    console.log("📩 Token en sessionStorage:", token);
    console.log("👤 Usuario en sessionStorage:", storedName);

    if (token && storedName) {
      console.log("✅ Sesión detectada, estableciendo estado...");
      setIsLoggedIn(true);
      setUserName(storedName);
    } else {
      console.warn("⚠️ No hay sesión activa.");
      setIsLoggedIn(false);
    }
  }, []); // ⬅️ useEffect sin dependencias, solo se ejecutará una vez

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
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) {
    return <h1 style={{ textAlign: "center", marginTop: "20%" }}>Cargando...</h1>;
  }

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





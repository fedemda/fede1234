import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister";
import Sidebar from "./components/dashboard/Sidebar";
import "./axiosConfig";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si está logueado
  const [userName, setUserName] = useState(""); // Estado para el nombre del usuario

  // Verifica el estado de inicio de sesión al cargar la aplicación
 useEffect(() => {
  const token = sessionStorage.getItem("token"); 
  const storedName = sessionStorage.getItem("userName"); 
  if (token && storedName) {
    setIsLoggedIn(true);
    setUserName(storedName);
  }
}, []);

const handleLogin = (name) => {
  sessionStorage.setItem("userName", name);
  setUserName(name);
  setIsLoggedIn(true);
};

const handleLogout = () => {
  sessionStorage.clear();
  setIsLoggedIn(false);
};


  return (
    <Router>
      <Routes>
        {/* Ruta para Login/Registro */}
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
        {/* Ruta para el Dashboard */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                  width: "66.11vw",
                }}
              >
                {/* Sidebar */}
                <Sidebar userName={userName} onLogout={handleLogout} />

                {/* Contenedor principal */}
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
                    <h1
                      style={{
                        fontSize: "3rem",
                        fontWeight: "bold",
                        marginTop: "0",
                      }}
                    >
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

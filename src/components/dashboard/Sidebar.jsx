import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import axios from "axios";
import FormularioCarrera from "../forms/FormularioCarrera";
import BuscarCarrera from "../forms/BuscarCarrera";
import NuevaMateria from "../forms/NuevaMateria";
import BuscarMateria from "../forms/BuscarMateria";
import NuevoEstudiante from "../forms/NuevoEstudiante";
import BuscarEstudiante from "../forms/BuscarEstudiante";
import Calificaciones from "../forms/Calificaciones";

// ✅ URL del backend según el entorno (local o producción)
const API_URL =
  process.env.NODE_ENV === "production"
  ? "https://fede456.onrender.com" // 🔍 Aquí debe estar la URL real del backend
    : "http://localhost:5000";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Cargando...");
  const [userRole, setUserRole] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  // Alternar barra lateral
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveMenu(null);
      setActiveSubMenu(null);
    }
  };

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // ✅ Obtener información del usuario autenticado
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log("🔍 Verificando usuario en Sidebar...");
        const token = sessionStorage.getItem("token");

        if (!token) {
          console.warn("⚠️ No hay token, redirigiendo...");
          return;
        }

        const response = await axios.post(
          `${API_URL}/getUserInfo`, // Usa la URL correcta según el entorno
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.name) {
          const formattedName =
            response.data.name.charAt(0).toUpperCase() +
            response.data.name.slice(1).toLowerCase();
          setUserName(formattedName);
        } else {
          setUserName("Usuario desconocido");
        }

        setUserRole(response.data.rol_id);
        sessionStorage.setItem("userRole", response.data.rol_id);
      } catch (error) {
        console.error("❌ Error al obtener usuario:", error.response?.data || error);
        setUserName("Error al cargar usuario");
      }
    };

    fetchUserInfo();
  }, []);

  // ✅ Cerrar sesión
  const handleLogout = () => {
    console.log("🚪 Cerrando sesión...");
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button onClick={toggleSidebar} className="menu-button">
            <span className="material-symbols-outlined">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
          <span className="admin-text">{userName}</span>
        </div>

        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => toggleMenu("carreras")}>
            <span className="material-symbols-outlined">edit</span>
            <span>Carreras</span>
          </div>
          {activeMenu === "carreras" && (
            <div className="submenu">
              {userRole !== 2 && (
                <div className="submenu-item" onClick={() => setActiveSubMenu("nuevaCarrera")}>
                  <span className="material-symbols-outlined">add</span> Nueva Carrera
                </div>
              )}
              <div className="submenu-item" onClick={() => setActiveSubMenu("buscarCarrera")}>
                <span className="material-symbols-outlined">search</span> Buscar Carrera
              </div>
            </div>
          )}

          {/* Materias */}
          <div className="menu-item" onClick={() => toggleMenu("materias")}>
            <span className="material-symbols-outlined">book</span>
            <span>Materias</span>
          </div>
          {activeMenu === "materias" && (
            <div className="submenu">
              {userRole !== 2 && (
                <div className="submenu-item" onClick={() => setActiveSubMenu("nuevaMateria")}>
                  <span className="material-symbols-outlined">add</span> Nueva Materia
                </div>
              )}
              <div className="submenu-item" onClick={() => setActiveSubMenu("buscarMateria")}>
                <span className="material-symbols-outlined">search</span> Buscar Materia
              </div>
            </div>
          )}

          {/* Estudiantes */}
          <div className="menu-item" onClick={() => toggleMenu("estudiantes")}>
            <span className="material-symbols-outlined">group</span>
            <span>Estudiantes</span>
          </div>
          {activeMenu === "estudiantes" && (
            <div className="submenu">
              <div className="submenu-item" onClick={() => setActiveSubMenu("nuevoEstudiante")}>
                <span className="material-symbols-outlined">add</span> Nuevo Estudiante
              </div>
              <div className="submenu-item" onClick={() => setActiveSubMenu("buscarEstudiante")}>
                <span className="material-symbols-outlined">search</span> Buscar Estudiante
              </div>
              <div className="submenu-item" onClick={() => setActiveSubMenu("calificacionesEstudiante")}>
                <span className="material-symbols-outlined">check_circle</span> Calificaciones
              </div>
            </div>
          )}

          {/* Cerrar Sesión */}
          <div className="menu-item logout" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "20px", backgroundColor: "#f4f4f4" }}>
        {activeSubMenu === "nuevaCarrera" && <FormularioCarrera />}
        {activeSubMenu === "buscarCarrera" && <BuscarCarrera />}
        {activeSubMenu === "nuevaMateria" && <NuevaMateria />}
        {activeSubMenu === "buscarMateria" && <BuscarMateria />}
        {activeSubMenu === "nuevoEstudiante" && <NuevoEstudiante />}
        {activeSubMenu === "buscarEstudiante" && <BuscarEstudiante />}
        {activeSubMenu === "calificacionesEstudiante" && <Calificaciones />}
      </main>
    </div>
  );
};

export default Sidebar;

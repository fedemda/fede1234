import React, { useState } from "react";
import "./FormularioCarrera.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Configurar SweetAlert2 para React
const MySwal = withReactContent(Swal);

// Definir la URL del backend según el entorno
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://fede456.onrender.com" // 🚀 Reemplaza con la URL real de tu backend en Render
    : "http://localhost:5000";

const FormularioCarrera = ({ onClose = () => {} }) => {
  // Estados para los campos del formulario
  const [resolucion, setResolucion] = useState("");
  const [duracion, setDuracion] = useState("");
  const [horas, setHoras] = useState("");
  const [cohorte, setCohorte] = useState("");
  const [categoria, setCategoria] = useState("");
  const [subcategoria, setSubcategoria] = useState("");

  // Función para reiniciar el formulario
  const resetForm = () => {
    setResolucion("");
    setDuracion("");
    setHoras("");
    setCohorte("");
    setCategoria("");
    setSubcategoria("");
  };

  // Manejar cambio en el campo Resolución
  const handleResolucionChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9/]*$/;
    if (regex.test(value)) {
      setResolucion(value);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ resolucion, cohorte, duracion, horas, categoria, subcategoria });

    if (!resolucion || !cohorte || !duracion || !horas || !categoria || !subcategoria) {
      MySwal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios.",
        icon: "error",
      });
      return;
    }

    if (duracion <= 0 || horas <= 0) {
      MySwal.fire({
        title: "Error",
        text: "La duración y carga horaria deben ser valores positivos.",
        icon: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado. Por favor, inicia sesión de nuevo.");
      }

      const response = await fetch(`${API_URL}/carreras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resolucion,
          cohorte,
          duracion,
          horas,
          categoria: categoria === "tecnicaturas" ? "Tecnicatura" : "Profesorado",
          subcategoria,
        }),
      });

      if (response.ok) {
        MySwal.fire({
          title: "Éxito",
          text: "Carrera guardada correctamente.",
          icon: "success",
        });
        resetForm();
        if (typeof onClose === "function") {
          onClose();
        }
      } else {
        const data = await response.json();
        MySwal.fire({
          title: "Error",
          text: data.message || "Ocurrió un error al guardar.",
          icon: "error",
        });
      }
    } catch (error) {
      MySwal.fire({
        title: "Error",
        text: error.message || "Error al conectar con el servidor.",
        icon: "error",
      });
    }
  };

  return (
    <div className="formulario-carrera-container">
      <h2>Nueva Carrera</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group-horizontal form-group-selects">
          <div className="form-group">
            <label className="label-categoria">Tecnicatura/Profesorado</label>
            <select
              value={categoria}
              onChange={(e) => {
                setCategoria(e.target.value);
                setSubcategoria("");
              }}
            >
              <option value="">Seleccione</option>
              <option value="tecnicaturas">Tecnicatura</option>
              <option value="profesorados">Profesorado</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label-subcategoria">Seleccione una Carrera</label>
            <select
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              disabled={!categoria}
            >
              <option value="">Seleccione una Carrera</option>
              {categoria === "tecnicaturas" && (
                <>
                  <option value="Tec. Sup. en Industria Textil">
                    Tec. Sup. en Industria Textil
                  </option>
                  <option value="Tec. Sup. en Analisis de Sistemas">
                    Tec. Sup. en Analisis de Sistemas
                  </option>
                  <option value="Tec. Sup. en Enfermería">
                    Tec. Sup. en Enfermería
                  </option>
                </>
              )}
              {categoria === "profesorados" && (
                <>
                  <option value="Prof. de Educación Primaria">
                    Prof. de Educación Primaria
                  </option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="form-group-horizontal">
          <div className="form-group">
            <label className="label-resolucion">Resolución</label>
            <input
              type="text"
              value={resolucion}
              onChange={handleResolucionChange}
              placeholder="Ej: 1234/56"
            />
          </div>
          <div className="form-group">
            <label className="label-cohorte">Cohorte</label>
            <input
              type="number"
              value={cohorte}
              onChange={(e) => setCohorte(e.target.value)}
              placeholder="Ej: 2025"
            />
          </div>
        </div>

        <div className="form-group-horizontal">
          <div className="form-group">
            <label className="label-duracion">Duración (años)</label>
            <input
              type="number"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              placeholder="Ingrese la duración"
            />
          </div>
          <div className="form-group">
            <label className="label-carga-horaria">Carga Horaria (horas)</label>
            <input
              type="number"
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
              placeholder="Ingrese las horas"
            />
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            Guardar
          </button>
          <button type="button" className="btn-secondary" onClick={resetForm}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioCarrera;

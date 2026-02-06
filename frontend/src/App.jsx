import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Cronograma from "./components/Cronograma";
import CrearActividad from "./components/CrearActividad";
import CrearUsuario from "./components/CrearUsuario"; // ✅ NUEVO
import {
  obtenerActividades,
  crearActividad,
  eliminarActividad
} from "./services/actividadService";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [actividades, setActividades] = useState([]);

  // 📥 Cargar actividades
  useEffect(() => {
    if (!token) return;

    obtenerActividades()
      .then(setActividades)
      .catch(console.error);
  }, [token]);

  // 🔐 LOGIN
  if (!token) {
    return (
      <Login
        onLogin={(newToken) => {
          localStorage.setItem("token", newToken);
          setToken(newToken);
          setRole(localStorage.getItem("role"));
        }}
      />
    );
  }

  // ➕ CREAR ACTIVIDAD
  const handleCrearActividad = async (data) => {
    try {
      const res = await crearActividad(data);
      setActividades((prev) => [...prev, res.actividad]);
    } catch (err) {
      alert(err.response?.data?.message || "Error al crear la actividad");
      console.error(err);
    }
  };

  // ❌ ELIMINAR ACTIVIDAD (solo admin)
  const handleEliminarActividad = async (id) => {
    try {
      await eliminarActividad(id);
      setActividades((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert("Error al eliminar la actividad");
      console.error(err);
    }
  };

  // 🖥️ APP
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Calendario de Actividades</h1>

      <p>
        Rol: <strong>{role}</strong>
      </p>

      <button
        onClick={() => {
          localStorage.clear();
          setToken(null);
          setRole(null);
        }}
        style={{ marginBottom: "1rem" }}
      >
        Cerrar sesión
      </button>

      {/* 👤 MÓDULO USUARIOS (SOLO ADMIN) */}
      {role === "admin" && (
        <>
          <hr />
          <CrearUsuario />
        </>
      )}

      {/* ➕ CREAR ACTIVIDAD */}
      <CrearActividad onCrear={handleCrearActividad} />

      {/* 🗓️ CRONOGRAMA */}
      <Cronograma
        actividades={actividades}
        role={role}
        onEliminar={handleEliminarActividad}
      />
    </div>
  );
}

export default App;






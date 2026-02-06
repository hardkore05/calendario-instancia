import { useEffect, useState } from "react";
import { obtenerInstancias } from "../services/instanciaService";

export default function CrearActividad({ onCrear }) {
  const [titulo, setTitulo] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [tipo, setTipo] = useState("actividad");
  const [instancia, setInstancia] = useState("");
  const [instancias, setInstancias] = useState([]);

  // 📥 cargar instancias
  useEffect(() => {
    obtenerInstancias()
      .then(setInstancias)
      .catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inicio || !fin) {
      alert("Debes seleccionar inicio y fin");
      return;
    }

    if (!instancia) {
      alert("Debes seleccionar una instancia");
      return;
    }

    // ✅ CONVERSIÓN CORRECTA A ISO (CLAVE)
    const inicioISO = new Date(inicio).toISOString();
    const finISO = new Date(fin).toISOString();

    onCrear({
      titulo: tipo === "no_disponible" ? "No disponible" : titulo,
      inicio: inicioISO,
      fin: finISO,
      tipo,
      instancia
    });

    // limpiar
    setTitulo("");
    setInicio("");
    setFin("");
    setTipo("actividad");
    setInstancia("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <h3>Nueva actividad</h3>

      {tipo !== "no_disponible" && (
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      )}

      <label>Instancia</label>
      <select
        value={instancia}
        onChange={(e) => setInstancia(e.target.value)}
        required
      >
        <option value="">-- Seleccione una instancia --</option>
        {instancias.map((i) => (
          <option key={i._id} value={i._id}>
            {i.nombre}
          </option>
        ))}
      </select>

      <label>Inicio</label>
      <input
        type="datetime-local"
        value={inicio}
        onChange={(e) => setInicio(e.target.value)}
        required
      />

      <label>Fin</label>
      <input
        type="datetime-local"
        value={fin}
        onChange={(e) => setFin(e.target.value)}
        required
      />

      <label>Tipo</label>
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="actividad">Actividad</option>
        <option value="no_disponible">No disponible</option>
      </select>

      <button type="submit">Crear</button>
    </form>
  );
}




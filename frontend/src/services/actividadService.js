const API_URL = import.meta.env.VITE_API_URL || "";

/* =========================
   OBTENER ACTIVIDADES
========================= */
export async function obtenerActividades() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/actividades`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Error al obtener actividades");
  }

  return res.json();
}

/* =========================
   CREAR ACTIVIDAD
========================= */
export async function crearActividad(data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/actividades`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al crear actividad");
  }

  return res.json();
}

/* =========================
   ELIMINAR ACTIVIDAD (ADMIN)
========================= */
export async function eliminarActividad(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/actividades/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al eliminar actividad");
  }

  return res.json();
}



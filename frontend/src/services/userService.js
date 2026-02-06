const API_URL = import.meta.env.VITE_API_URL || "";

/* =========================
   CREAR USUARIO (ADMIN)
========================= */
export async function crearUsuario(data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al crear usuario");
  }

  return res.json();
}

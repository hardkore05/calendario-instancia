const API_URL = "/api/auth";

export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  // 🔥 DEVOLVER TODO, NO SOLO EL TOKEN
  return data;
}






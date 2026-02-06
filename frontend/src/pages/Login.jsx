import { useState } from "react";
import { login } from "../services/authService";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);

      // ✅ Guardar datos correctamente
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Calendario de Actividades</h2>
        <p>Iniciar sesión</p>

        {error && <div style={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8"
  },
  card: {
    width: "320px",
    padding: "2rem",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,.1)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  input: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem"
  },
  button: {
    padding: "0.75rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer"
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "0.5rem",
    borderRadius: "4px",
    fontSize: "0.9rem"
  }
};

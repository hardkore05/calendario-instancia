import { useState } from "react";
import { crearUsuario } from "../services/userService";

export default function CrearUsuario() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await crearUsuario({ nombre, email, password, role });
      alert("Usuario creado correctamente");

      setNombre("");
      setEmail("");
      setPassword("");
      setRole("user");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h3>Crear usuario</h3>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">Usuario</option>
        <option value="admin">Administrador</option>
      </select>

      <button type="submit">Crear usuario</button>
    </form>
  );
}

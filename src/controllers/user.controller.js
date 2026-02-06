const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* =========================
   POST /api/users
   SOLO ADMIN
========================= */
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: "Nombre, email y contraseña son obligatorios"
      });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({
        message: "El correo ya está registrado"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const usuario = await User.create({
      nombre,
      email,
      password: hashedPassword,
      role: "user" // 🔒 SIEMPRE user
    });

    res.status(201).json({
      message: "Usuario creado correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    console.error("ERROR crearUsuario:", error);
    res.status(500).json({
      message: "Error al crear usuario"
    });
  }
};

module.exports = {
  crearUsuario
};

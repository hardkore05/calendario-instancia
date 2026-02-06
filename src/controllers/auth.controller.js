const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ======================
   REGISTRO
====================== */
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(",")
      : [];

    const role = adminEmails.includes(email) ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

/* ======================
   LOGIN
====================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    console.log("JWT_SECRET 👉", process.env.JWT_SECRET);

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      role: user.role
    });

  } catch (error) {
    console.error("🔥 ERROR REAL LOGIN 👉", error);
    res.status(500).json({ 
      message: "Error en login",
      error: error.message 
    });
  }
};

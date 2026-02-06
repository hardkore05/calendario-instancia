const mongoose = require("mongoose");
const Actividad = require("../models/Actividad");

/* =========================
   GET /api/actividades
========================= */
const obtenerActividades = async (req, res) => {
  try {
    let filtro = {};

    // 👤 Usuario normal → solo sus actividades
    if (req.user.role === "user") {
      filtro.user = req.user.id;
    }

    const actividades = await Actividad.find(filtro)
      .populate("instancia", "nombre")
      .populate("user", "nombre email")
      .sort({ inicio: 1 });

    res.json(actividades);
  } catch (error) {
    console.error("ERROR obtenerActividades:", error);
    res.status(500).json({ message: "Error al obtener actividades" });
  }
};

/* =========================
   POST /api/actividades
========================= */
const crearActividad = async (req, res) => {
  try {
    const { titulo, instancia, inicio, fin, tipo = "actividad" } = req.body;

    if (!inicio || !fin) {
      return res.status(400).json({
        message: "Inicio y fin son obligatorios"
      });
    }

    if (new Date(inicio) >= new Date(fin)) {
      return res.status(400).json({
        message: "La fecha de fin debe ser mayor a la de inicio"
      });
    }

    if (instancia && !mongoose.Types.ObjectId.isValid(instancia)) {
      return res.status(400).json({
        message: "Instancia inválida"
      });
    }

    const userId = req.user.id;

    // 🔒 Validar cruce SOLO por usuario
    const cruce = await Actividad.findOne({
      user: userId,
      inicio: { $lt: fin },
      fin: { $gt: inicio }
    });

    if (cruce) {
      return res.status(400).json({
        message: "El usuario ya tiene una actividad en ese horario"
      });
    }

    const actividad = await Actividad.create({
      titulo,
      inicio,
      fin,
      tipo,
      user: userId,
      instancia: instancia || null
    });

    res.status(201).json({
      message: "Actividad creada correctamente",
      actividad
    });
  } catch (error) {
    console.error("ERROR crearActividad:", error);
    res.status(500).json({ message: "Error al crear actividad" });
  }
};

/* =========================
   GET /api/actividades?from=&to=
========================= */
const obtenerActividadesPorRango = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        message: "Debe enviar from y to"
      });
    }

    const inicio = new Date(from);
    const fin = new Date(to);

    let filtro = {
      inicio: { $lt: fin },
      fin: { $gt: inicio }
    };

    if (req.user.role === "user") {
      filtro.user = req.user.id;
    }

    const actividades = await Actividad.find(filtro)
      .populate("instancia", "nombre")
      .populate("user", "nombre email")
      .sort({ inicio: 1 });

    res.json(actividades);
  } catch (error) {
    console.error("ERROR obtenerActividadesPorRango:", error);
    res.status(500).json({
      message: "Error al obtener actividades por rango"
    });
  }
};

/* =========================
   DELETE /api/actividades/:id
   SOLO ADMIN
========================= */
const eliminarActividad = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "No autorizado"
      });
    }

    const actividad = await Actividad.findById(req.params.id);

    if (!actividad) {
      return res.status(404).json({
        message: "Actividad no encontrada"
      });
    }

    await actividad.deleteOne();

    res.json({
      message: "Actividad eliminada correctamente"
    });
  } catch (error) {
    console.error("ERROR eliminarActividad:", error);
    res.status(500).json({
      message: "Error al eliminar actividad"
    });
  }
};

module.exports = {
  obtenerActividades,
  crearActividad,
  obtenerActividadesPorRango,
  eliminarActividad
};

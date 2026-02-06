const mongoose = require("mongoose");
const Instancia = require("../models/Instancia");

/* =========================
   POST /api/instancias (ADMIN)
========================= */
const crearInstancia = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const existe = await Instancia.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ message: "La instancia ya existe" });
    }

    const instancia = await Instancia.create({ nombre });

    res.status(201).json({
      message: "Instancia creada correctamente",
      instancia
    });
  } catch (error) {
    console.error("ERROR crearInstancia:", error);
    res.status(500).json({ message: "Error al crear instancia" });
  }
};

/* =========================
   GET /api/instancias (TODOS)
========================= */
const getInstancias = async (req, res) => {
  try {
    const instancias = await Instancia.find().sort({ nombre: 1 });
    res.json(instancias);
  } catch (error) {
    console.error("ERROR getInstancias:", error);
    res.status(500).json({ message: "Error al obtener instancias" });
  }
};

/* =========================
   PUT /api/instancias/:id (ADMIN)
========================= */
const actualizarInstancia = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const instancia = await Instancia.findByIdAndUpdate(
      id,
      { nombre },
      { new: true }
    );

    if (!instancia) {
      return res.status(404).json({ message: "Instancia no encontrada" });
    }

    res.json({
      message: "Instancia actualizada",
      instancia
    });
  } catch (error) {
    console.error("ERROR actualizarInstancia:", error);
    res.status(500).json({ message: "Error al actualizar instancia" });
  }
};

/* =========================
   DELETE /api/instancias/:id (ADMIN)
========================= */
const eliminarInstancia = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const instancia = await Instancia.findByIdAndDelete(id);

    if (!instancia) {
      return res.status(404).json({ message: "Instancia no encontrada" });
    }

    res.json({ message: "Instancia eliminada correctamente" });
  } catch (error) {
    console.error("ERROR eliminarInstancia:", error);
    res.status(500).json({ message: "Error al eliminar instancia" });
  }
};

module.exports = {
  crearInstancia,
  getInstancias,
  actualizarInstancia,
  eliminarInstancia
};







const mongoose = require("mongoose");

const actividadSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  instancia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instancia",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  inicio: {
    type: Date,
    required: true
  },
  fin: {
    type: Date,
    required: true
  },
  tipo: {
    type: String,
    enum: ["actividad", "no_disponible"],
    default: "actividad"
  }
}, { timestamps: true });

module.exports = mongoose.model("Actividad", actividadSchema);

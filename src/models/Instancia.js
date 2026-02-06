const mongoose = require("mongoose");

const InstanciaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Instancia", InstanciaSchema);


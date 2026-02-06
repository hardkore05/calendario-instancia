const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  obtenerActividades,
  crearActividad,
  obtenerActividadesPorRango,
  eliminarActividad // 👈 IMPORTANTE
} = require("../controllers/actividad.controller");

router.get("/", auth, obtenerActividades);
router.get("/rango", auth, obtenerActividadesPorRango);
router.post("/", auth, crearActividad);

// ❌➡️✅ ESTA RUTA FALTABA
router.delete("/:id", auth, eliminarActividad);

module.exports = router;




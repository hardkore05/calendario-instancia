const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const {
  crearInstancia,
  getInstancias,
  actualizarInstancia,
  eliminarInstancia
} = require("../controllers/instancia.controller");

router.get("/", auth, getInstancias);
router.post("/", auth, admin, crearInstancia);
router.put("/:id", auth, admin, actualizarInstancia);
router.delete("/:id", auth, admin, eliminarInstancia);

module.exports = router;





const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const { crearUsuario } = require("../controllers/user.controller");

router.post("/", auth, admin, crearUsuario);

module.exports = router;

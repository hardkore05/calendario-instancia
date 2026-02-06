const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { reporteSemanalExcel } = require("../controllers/reporte.controller");

router.get("/semanal", auth, reporteSemanalExcel);

module.exports = router;

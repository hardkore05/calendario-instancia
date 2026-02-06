const express = require("express");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/privado", auth, (req, res) => {
  res.json({
    message: "Acceso permitido",
    user: req.user
  });
});

module.exports = router;

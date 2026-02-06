module.exports = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Acceso denegado: solo administradores"
      });
    }
    next();
  } catch (error) {
    console.error("ERROR admin middleware:", error);
    res.status(500).json({ message: "Error de autorización" });
  }
};


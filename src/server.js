require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Rutas
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const instanciasRoutes = require("./routes/instancias.routes");
const actividadesRoutes = require("./routes/actividades.routes");
const reportesRoutes = require("./routes/reportes.routes");
const usersRoutes = require("./routes/users.routes"); // ✅ FALTABA

// Conectar MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// =======================
// RUTAS API
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/instancias", instanciasRoutes);
app.use("/api/actividades", actividadesRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/users", usersRoutes); // ✅ FALTABA

// =======================
// FRONTEND (React)
// =======================
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all SPA
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "Ruta API no encontrada" });
  }

  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html")
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});




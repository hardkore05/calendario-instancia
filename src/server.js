require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// =======================
// IMPORTAR RUTAS
// =======================
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const instanciasRoutes = require("./routes/instancias.routes");
const actividadesRoutes = require("./routes/actividades.routes");
const reportesRoutes = require("./routes/reportes.routes");
const usersRoutes = require("./routes/users.routes");

// =======================
// DB
// =======================
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// RUTAS API (PRIMERO SIEMPRE)
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/instancias", instanciasRoutes);
app.use("/api/actividades", actividadesRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/users", usersRoutes);

// =======================
// FRONTEND BUILD (Vite)
// =======================
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// =======================
// CATCH-ALL SPA (CORRECTO)
// ❌ NO app.get("*")
// ✅ Regex que excluye /api
// =======================
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});

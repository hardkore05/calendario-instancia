const ExcelJS = require("exceljs");
const Actividad = require("../models/Actividad");

const reporteSemanalExcel = async (req, res) => {
  try {
    // 🔐 Solo admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        message: "Debe enviar from y to"
      });
    }

    const inicio = new Date(from);
    const fin = new Date(to);

    // 🔍 Buscar actividades + no disponible
    const actividades = await Actividad.find({
      inicio: { $lt: fin },
      fin: { $gt: inicio }
    })
      .populate("user", "nombre email")
      .populate("instancia", "nombre")
      .sort({ inicio: 1 });

    // 📘 Crear Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reporte Semanal");

    sheet.columns = [
      { header: "Usuario", key: "usuario", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Instancia", key: "instancia", width: 30 },
      { header: "Actividad", key: "titulo", width: 30 },
      { header: "Inicio", key: "inicio", width: 20 },
      { header: "Fin", key: "fin", width: 20 },
      { header: "Horas", key: "horas", width: 10 }
    ];

    let resumen = {};

    actividades.forEach(act => {
      const horas =
        (new Date(act.fin) - new Date(act.inicio)) / (1000 * 60 * 60);

      const nombreUsuario = act.user?.nombre || "Sin usuario";

      sheet.addRow({
        usuario: nombreUsuario,
        email: act.user?.email || "",
        instancia: act.instancia?.nombre || "NO DISPONIBLE",
        titulo: act.tipo === "no_disponible"
          ? "No disponible"
          : act.titulo,
        inicio: act.inicio,
        fin: act.fin,
        horas: horas.toFixed(2)
      });

      // 📊 Resumen (NO sumar "No disponible")
      if (act.tipo !== "no_disponible") {
        if (!resumen[nombreUsuario]) {
          resumen[nombreUsuario] = 0;
        }
        resumen[nombreUsuario] += horas;
      }
    });

    // ➕ Hoja resumen
    const resumenSheet = workbook.addWorksheet("Resumen");

    resumenSheet.columns = [
      { header: "Usuario", key: "usuario", width: 30 },
      { header: "Total Horas", key: "horas", width: 15 }
    ];

    Object.entries(resumen).forEach(([usuario, horas]) => {
      resumenSheet.addRow({
        usuario,
        horas: horas.toFixed(2)
      });
    });

    // 📥 DESCARGA
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=reporte_semanal.xlsx"
    );
    res.setHeader("Content-Length", buffer.length);

    res.send(buffer);

  } catch (error) {
    console.error("ERROR reporteSemanalExcel:", error);
    res.status(500).json({
      message: "Error al generar reporte"
    });
  }
};

module.exports = { reporteSemanalExcel };

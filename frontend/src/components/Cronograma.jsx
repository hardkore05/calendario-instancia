import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { useState } from "react";
import { descargarReporteSemanal } from "../services/reporteService"; // 🔹 AGREGADO

export default function Cronograma({
  actividades = [],
  role,
  onEliminar
}) {

  // 🔹 AGREGADO: estados para fechas del reporte
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const eventos = actividades.map((a) => ({
    id: a._id,
    title: a.instancia
      ? `${a.titulo}\n${a.instancia.nombre}\nCreado por: ${a.user?.nombre || ""}` // ✅ AGREGADO
      : `${a.titulo}\nCreado por: ${a.user?.nombre || ""}`,                       // ✅ AGREGADO
    start: new Date(a.inicio),
    end: new Date(a.fin),
    backgroundColor:
      a.tipo === "no_disponible" ? "#9ca3af" : "#2563eb",
    borderColor:
      a.tipo === "no_disponible" ? "#6b7280" : "#1e40af",
    extendedProps: {
      instancia: a.instancia?.nombre || "",
      tipo: a.tipo,
      creadoPor: a.user?.nombre || "" // ✅ AGREGADO
    }
  }));

  const handleEventClick = (info) => {
    if (role !== "admin") return;

    const confirmar = confirm(
      `¿Eliminar esta actividad?\n\n${info.event.title.replace(
        "\n",
        " - "
      )}`
    );

    if (confirmar && onEliminar) {
      onEliminar(info.event.id);
    }
  };

  // 🔹 AGREGADO: función para generar el reporte
  const generarReporte = async () => {
    if (!from || !to) {
      alert("Selecciona la fecha de inicio y fin");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const blob = await descargarReporteSemanal(from, to, token);

      const url = window.URL.createObjectURL(
        new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte_semanal_${from}_a_${to}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
      alert("Error generando el reporte");
    }
  };

  return (
    <div style={{ minHeight: "90vh" }}>

      {/* 🔹 AGREGADO: bloque del botón (solo admin) */}
      {role === "admin" && (
        <div
          style={{
            marginBottom: "12px",
            padding: "12px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            background: "#f9fafb"
          }}
        >
          <strong>Reporte semanal</strong>

          <div style={{ marginTop: "8px" }}>
            <label>Desde: </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />

            <label style={{ marginLeft: "8px" }}>Hasta: </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />

            <button
              onClick={generarReporte}
              style={{
                marginLeft: "12px",
                padding: "6px 10px",
                cursor: "pointer"
              }}
            >
              📊 Generar reporte
            </button>
          </div>
        </div>
      )}

      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        locale={esLocale}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay,dayGridMonth"
        }}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }}
        events={eventos}
        eventClick={handleEventClick}
        height="auto"
      />
    </div>
  );
}

import axios from "axios";

const API_URL = "/api/reportes";

export const descargarReporteSemanal = async (from, to, token) => {
  const response = await axios.get(
    `${API_URL}/semanal?from=${from}&to=${to}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
import axios from "axios";

const API = "https://28acddb0-4176-4c8d-a9c1-5f02469537c5-00-3uhts3cqimrk5.riker.replit.dev/api";

export const obtenerInstancias = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/instancias`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};




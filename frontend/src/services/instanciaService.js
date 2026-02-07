import axios from "axios";

const API = "/api/instancias";

export const obtenerInstancias = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};




import axios from "axios";
import { ITareaBacklog } from "../types/ITareaBacklog";
import { API_URL } from "../utils/constantes";

// Función para actualizar el objeto global del json server
export const putTareaList = async (proyectos: ITareaBacklog[]) => {
  try {
    // Hacemos una petición PUT a la API enviando la lista de proyectos dentro de la estructura adecuada
    const response = await axios.put(API_URL, {
        Tareas: proyectos, // Colocamos los proyectos bajo "Backlog.Tareas"
    });

    return response.data; // Devolvemos la respuesta de la API
  } catch (error) {
    console.error("Algo salió mal en putProyectList", error); // Capturamos y mostramos errores en la consola
  }
};

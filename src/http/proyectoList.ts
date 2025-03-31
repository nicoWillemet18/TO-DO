import axios from "axios"; // Importamos axios para hacer solicitudes HTTP
import { IProyecto, IProyectoList } from "../types/Iinterfaces"; // Importamos las interfaces tipadas
import { API_URL } from "../utils/constantes"; // Importamos la URL base de la API

// Función para actualizar el objeto global del json server
export const putProyectList = async (proyectos: IProyecto[]) => {
  try {
    // Hacemos una petición PUT a la API enviando la lista de proyectos
    const response = await axios.put<IProyectoList>(API_URL, {
      proyectos: proyectos, // Enviamos los proyectos en el body de la solicitud
    });

    return response.data; // Devolvemos la respuesta de la API
  } catch (error) {
    console.error("Algo salió mal en putProyectList", error); // Capturamos y mostramos errores en la consola
  }
};
import axios from "axios"; // Importamos axios para realizar peticiones HTTP
import { IProyecto } from "../types/Iinterfaces"; // Importamos la interfaz IProyecto
import { API_URL } from "../utils/constantes"; // Importamos la URL base de la API
import { putProyectList } from "../http/proyectoList"; // Importamos la función para actualizar la lista de proyectos

// 🔹 Función para obtener todos los proyectos
export const getProyectosController = async (): Promise<
  IProyecto[] | undefined
> => {
  try {
    // Hacemos una petición GET a la API para obtener los proyectos
    const response = await axios.get<{ proyectos: IProyecto[] }>(API_URL);
    return response.data.proyectos; // Retornamos la lista de proyectos
  } catch (error) {
    console.log("Problemas en getProyectosController", error); // Manejamos errores
  }
};

// 🔹 Función para crear un nuevo proyecto
export const createProyectoController = async (proyectoNuevo: IProyecto) => {
  try {
    // Obtenemos la lista de proyectos actuales
    const proyectosBd = await getProyectosController();

    if (proyectosBd) {
      // Si existen proyectos, agregamos el nuevo a la lista y actualizamos
      await putProyectList([...proyectosBd, proyectoNuevo]);
    } else {
      // Si no existen proyectos, creamos la lista con el nuevo proyecto
      await putProyectList([proyectoNuevo]);
    }

    return proyectoNuevo; // Retornamos el proyecto creado
  } catch (error) {
    console.log("Error en createProyectoController", error);
  }
};

// 🔹 Función para actualizar un proyecto existente
export const updateProyectoController = async (
  proyectoActualizado: IProyecto
) => {
  try {
    // Obtenemos la lista de proyectos actuales
    const proyectosBd = await getProyectosController();

    if (proyectosBd) {
      // Mapeamos los proyectos y reemplazamos el que coincida con el ID del actualizado
      const result = proyectosBd.map((proyectBd) =>
        proyectBd.id === proyectoActualizado.id
          ? { ...proyectBd, ...proyectoActualizado } // Actualizamos los datos del proyecto
          : proyectBd
      );

      await putProyectList(result); // Guardamos la nueva lista de proyectos
    }
    return proyectoActualizado; // Retornamos el proyecto actualizado
  } catch (error) {
    console.log("Error en updateProyectoController", error);
  }
};

// 🔹 Función para eliminar un proyecto por su ID
export const deleteProyectoController = async (idProyectoAEliminar: string) => {
  try {
    // Obtenemos la lista de proyectos actuales
    const proyectosBd = await getProyectosController();

    if (proyectosBd) {
      // Filtramos la lista eliminando el proyecto con el ID dado
      const result = proyectosBd.filter(
        (proyectBd) => proyectBd.id !== idProyectoAEliminar
      );

      await putProyectList(result); // Guardamos la nueva lista sin el proyecto eliminado
    }
  } catch (error) {
    console.log("Error en deleteProyectoController", error);
  }
};
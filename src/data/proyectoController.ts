import axios from "axios"; // Importamos axios para realizar peticiones HTTP
import { IProyecto } from "../types/Iinterfaces"; // Importamos la interfaz IProyecto
import { API_URL } from "../utils/constantes"; // Importamos la URL base de la API
import { putProyectList } from "../http/proyectoList"; // Importamos la función para actualizar la lista de proyectos

// 🔹 Función para obtener todas las tareas del Backlog
export const getTareasController = async (): Promise<IProyecto[] | undefined> => {
  try {
    // Hacemos una petición GET a la API para obtener las tareas
    const response = await axios.get<{ Tareas: IProyecto[] }>(API_URL);
    return response.data.Tareas; // Retornamos la lista de tareas
  } catch (error) {
    console.log("Problemas en getTareasController", error); // Manejamos errores
  }
};

// 🔹 Función para crear una nueva tarea en el Backlog
export const createTareaController = async (tareaNueva: IProyecto) => {
  try {
    // Obtenemos la lista de tareas actuales
    const tareasBd = await getTareasController();

    if (tareasBd) {
      // Si existen tareas, agregamos la nueva a la lista y actualizamos
      await putProyectList([...tareasBd, tareaNueva]);
    } else {
      // Si no existen tareas, creamos la lista con la nueva tarea
      await putProyectList([tareaNueva]);
    }

    return tareaNueva; // Retornamos la tarea creada
  } catch (error) {
    console.log("Error en createTareaController", error);
  }
};

// 🔹 Función para actualizar una tarea existente
export const updateTareaController = async (tareaActualizada: IProyecto) => {
  try {
    // Obtenemos la lista de tareas actuales
    const tareasBd = await getTareasController();

    if (tareasBd) {
      // Mapeamos las tareas y reemplazamos la que coincida con el ID de la tarea actualizada
      const result = tareasBd.map((tareaBd) =>
        tareaBd.id === tareaActualizada.id
          ? { ...tareaBd, ...tareaActualizada } // Actualizamos los datos de la tarea
          : tareaBd
      );

      await putProyectList(result); // Guardamos la nueva lista de tareas
    }
    return tareaActualizada; // Retornamos la tarea actualizada
  } catch (error) {
    console.log("Error en updateTareaController", error);
  }
};

// 🔹 Función para eliminar una tarea por su ID
export const deleteTareaController = async (idTareaAEliminar: string) => {
  try {
    // Obtenemos la lista de tareas actuales
    const tareasBd = await getTareasController();

    if (tareasBd) {
      // Filtramos la lista eliminando la tarea con el ID dado
      const result = tareasBd.filter((tareaBd) => tareaBd.id !== idTareaAEliminar);

      await putProyectList(result); // Guardamos la nueva lista sin la tarea eliminada
    }
  } catch (error) {
    console.log("Error en deleteTareaController", error);
  }
};

import axios from "axios";
import { ITareaBacklog } from "../types/ITareaBacklog";
import { API_URL } from "../utils/constantes";
import { putTareaList } from "../http/tareaList";

// 🔹 Función para obtener todas las tareas del Backlog
export const getTareasController = async (): Promise<ITareaBacklog[] | undefined> => {
  try {
    // Hacemos una petición GET a la API para obtener las tareas
    const response = await axios.get<{ Tareas: ITareaBacklog[] }>(API_URL);
    return response.data.Tareas; // Retornamos la lista de tareas
  } catch (error) {
    console.log("Problemas en getTareasController", error); // Manejamos errores
  }
};

// 🔹 Función para crear una nueva tarea en el Backlog
export const createTareaController = async (tareaNueva: ITareaBacklog) => {
  try {
    // Obtenemos la lista de tareas actuales
    const tareasBd = await getTareasController();

    if (tareasBd) {
      // Si existen tareas, agregamos la nueva a la lista y actualizamos
      await putTareaList([...tareasBd, tareaNueva]);
    } else {
      // Si no existen tareas, creamos la lista con la nueva tarea
      await putTareaList([tareaNueva]);
    }

    return tareaNueva; // Retornamos la tarea creada
  } catch (error) {
    console.log("Error en createTareaController", error);
  }
};

// 🔹 Función para actualizar una tarea existente
export const updateTareaController = async (tareaActualizada: ITareaBacklog) => {
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

      await putTareaList(result); // Guardamos la nueva lista de tareas
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

      await putTareaList(result); // Guardamos la nueva lista sin la tarea eliminada
    }
  } catch (error) {
    console.log("Error en deleteTareaController", error);
  }
};



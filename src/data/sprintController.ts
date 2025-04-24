import axios from "axios";
import { ISprint } from "../types/ISprint";
import { ITareaSprint } from "../types/ITareaSprint";
import { v4 as uuidv4 } from "uuid";

// 🔹 URL base del backend
const API_BASE_URL = "http://localhost:3000";

// 🔹 Obtener todos los sprints
export const getSprintsController = async (): Promise<ISprint[] | undefined> => {
  try {
    const response = await axios.get<{ listSprints: ISprint[] }>(`${API_BASE_URL}/sprints`);
    return response.data.listSprints;
  } catch (error) {
    console.error("❌ Error en getSprintsController:", error);
  }
};

// 🔹 Crear un nuevo sprint (agrega a listSprints)
export const createSprintController = async (sprint: ISprint): Promise<ISprint | undefined> => {
  try {
    const sprints = await getSprintsController();
    if (!sprints) throw new Error("No se pudieron obtener los sprints");

    const nuevaLista = [...sprints, sprint];

    await axios.put(`${API_BASE_URL}/sprints`, { listSprints: nuevaLista });

    return sprint;
  } catch (error) {
    console.error("❌ Error en createSprintController:", error);
  }
};

// 🔹 Eliminar un sprint por ID (remueve de listSprints)
export const deleteSprintController = async (id: string): Promise<void> => {
  try {
    const sprints = await getSprintsController();
    if (!sprints) throw new Error("No se pudieron obtener los sprints");

    const nuevaLista = sprints.filter((s) => s.id !== id);

    await axios.put(`${API_BASE_URL}/sprints`, { listSprints: nuevaLista });

  } catch (error) {
    console.error("❌ Error en deleteSprintController:", error);
  }
};

// 🔹 Actualizar un sprint por ID (reemplaza en listSprints)
export const updateSprintController = async (sprint: ISprint): Promise<ISprint | undefined> => {
  try {
    const sprints = await getSprintsController();
    if (!sprints) throw new Error("No se pudieron obtener los sprints");

    const nuevaLista = sprints.map((s) => (s.id === sprint.id ? sprint : s));

    await axios.put(`${API_BASE_URL}/sprints`, { listSprints: nuevaLista });

    return sprint;
  } catch (error) {
    console.error("❌ Error en updateSprintController:", error);
  }
};

// 🔹 Enviar una tarea de Backlog a un Sprint
export const addTareaToSprintController = async (
  idSprint: string,
  nuevaTarea: ITareaSprint
): Promise<void> => {
  try {
    const sprints = await getSprintsController();
    if (!sprints) throw new Error("No se pudieron obtener los sprints");

    const nuevaLista = sprints.map((sprint) => {
      if (sprint.id === idSprint) {
        return {
          ...sprint,
          tareas: [...sprint.tareas, nuevaTarea]
        };
      }
      return sprint;
    });

    await axios.put(`${API_BASE_URL}/sprints`, { listSprints: nuevaLista });
  } catch (error) {
    console.error("❌ Error en addTareaToSprintController:", error);
  }
};

// 🔹 Mover una tarea de un sprint al backlog
export const moverTareaABacklogController = async (
  idSprint: string,
  tareaId: string
): Promise<void> => {
  try {
    const sprints = await getSprintsController();
    if (!sprints) throw new Error("No se pudieron obtener los sprints");

    const sprint = sprints.find(s => s.id === idSprint);
    if (!sprint) throw new Error("Sprint no encontrado");

    const tarea = sprint.tareas.find(t => t.id === tareaId);
    if (!tarea) throw new Error("Tarea no encontrada");

    // Obtener tareas actuales del backlog
    const responseBacklog = await axios.get(`${API_BASE_URL}/backlog`);
    const tareasBacklog = responseBacklog.data.Tareas || [];

    // Crear la nueva tarea para el backlog (se mantiene el mismo ID)
    const nuevaTareaBacklog = {
      id: tarea.id,
      nombre: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaInicio: new Date().toISOString().split("T")[0],
      fechaFin: tarea.fechaLimite || new Date().toISOString().split("T")[0]
    };

    // Agregar la tarea al backlog
    await axios.put(`${API_BASE_URL}/backlog`, {
      Tareas: [...tareasBacklog, nuevaTareaBacklog]
    });

    // Eliminar la tarea del sprint
    const sprintActualizado: ISprint = {
      ...sprint,
      tareas: sprint.tareas.filter(t => t.id !== tareaId)
    };

    const nuevaListaSprints = sprints.map(s =>
      s.id === idSprint ? sprintActualizado : s
    );

    await axios.put(`${API_BASE_URL}/sprints`, { listSprints: nuevaListaSprints });

  } catch (error) {
    console.error("❌ Error en moverTareaABacklogController:", error);
  }
};

// 🔹 Función para crear una nueva tarea dentro de un Sprint
export const createTareaSprint = async (
  idSprint: string,
  tareaNueva: { titulo: string; descripcion: string; fechaLimite?: string }
) => {
  try {
    // Obtenemos todos los sprints
    const response = await axios.get<{ listSprints: ISprint[] }>("http://localhost:3000/sprints");
    const sprints = response.data.listSprints;

    // Buscamos el sprint donde se agregará la nueva tarea
    const sprint = sprints.find(s => s.id === idSprint);
    if (!sprint) throw new Error("Sprint no encontrado");

    // Creamos la nueva tarea
    const nuevaTarea = {
      id: uuidv4(), // Generamos un ID único usando uuid
      titulo: tareaNueva.titulo,
      descripcion: tareaNueva.descripcion,
      fechaLimite: tareaNueva.fechaLimite || new Date().toISOString().split("T")[0], // Si no se especifica fecha, se pone la fecha actual
      estado: "pendiente" // Asignamos el estado inicial como pendiente
    };

    // Añadimos la nueva tarea al sprint
    const sprintActualizado = {
      ...sprint,
      tareas: [...sprint.tareas, nuevaTarea] // Añadimos la tarea a la lista de tareas del sprint
    };

    // Actualizamos la lista de sprints en la base de datos
    const nuevosSprints = sprints.map(s => s.id === idSprint ? sprintActualizado : s);
    await axios.put("http://localhost:3000/sprints", {
      listSprints: nuevosSprints
    });

    // Devolvemos la tarea creada (opcional)
    return nuevaTarea;
  } catch (error) {
    console.error("❌ Error en createTareaController:", error);
  }
};

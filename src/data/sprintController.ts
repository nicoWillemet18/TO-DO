import axios from "axios";
import { ISprint } from "../types/ISprint";

// 🔹 URL base del backend
const API_BASE_URL = "http://localhost:3000";

// 🔹 Obtener todos los sprints
export const getSprintsController = async (): Promise<ISprint[] | undefined> => {
  try {
    const response = await axios.get<{ listSprints: ISprint[] }>(`${API_BASE_URL}/Sprints`);
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

    await axios.put(`${API_BASE_URL}/Sprints`, { listSprints: nuevaLista });

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

    await axios.put(`${API_BASE_URL}/Sprints`, { listSprints: nuevaLista });

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

    await axios.put(`${API_BASE_URL}/Sprints`, { listSprints: nuevaLista });

    return sprint;
  } catch (error) {
    console.error("❌ Error en updateSprintController:", error);
  }
};

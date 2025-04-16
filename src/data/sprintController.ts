import axios from "axios";
import { ISprint } from "../types/ISprint";

// 🔹 URL base del backend
const API_BASE_URL = "http://localhost:3000";

// 🔹 Obtener todos los sprints
export const getSprintsController = async (): Promise<ISprint[] | undefined> => {
  try {
    const response = await axios.get<ISprint[]>(`${API_BASE_URL}/sprints`);
    return response.data;
  } catch (error) {
    console.error("❌ Error en getSprintsController:", error);
  }
};

// 🔹 Crear un nuevo sprint
export const createSprintController = async (sprint: ISprint): Promise<ISprint | undefined> => {
    try {
      const response = await axios.post<ISprint>(`${API_BASE_URL}/sprints`, sprint);
      return response.data;
    } catch (error) {
      console.error("❌ Error en createSprintController:", error);
    }
  };

  // 🔹 Eliminar un sprint por ID
export const deleteSprintController = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/sprints/${id}`);
      console.log(`✅ Sprint con ID ${id} eliminado correctamente`);
    } catch (error) {
      console.error("❌ Error en deleteSprintController:", error);
    }
  };

  // 🔹 Actualizar un sprint por ID
export const updateSprintController = async (sprint: ISprint): Promise<ISprint | undefined> => {
    try {
      const response = await axios.put<ISprint>(`${API_BASE_URL}/sprints/${sprint.id}`, sprint);
      console.log(`✅ Sprint con ID ${sprint.id} actualizado correctamente`);
      return response.data;
    } catch (error) {
      console.error("❌ Error en updateSprintController:", error);
    }
  };
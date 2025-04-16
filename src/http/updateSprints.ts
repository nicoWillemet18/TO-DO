// putSprintList.ts
import axios from "axios";
import { ISprint } from "../types/ISprint";

// URL base del backend
const API_BASE_URL = "http://localhost:3000";

// Actualizar la lista de sprints
export const putSprintList = async (sprints: ISprint[]): Promise<any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/sprints`, sprints);
    return response.data;
  } catch (error) {
    console.error("Error en putSprintList:", error);
  }
};

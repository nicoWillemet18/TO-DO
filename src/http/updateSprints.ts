// putSprintList.ts
import axios from "axios";
import { ISprint } from "../types/ISprint";

// URL base del backend
const API_BASE_URL = "http://localhost:3000";

// 🔹 Actualizar la lista completa de sprints
export const putSprintList = async (sprints: ISprint[]): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/Sprints`, {
      listSprints: sprints,
    });
    console.log("✅ Lista de sprints actualizada correctamente");
  } catch (error) {
    console.error("❌ Error en putSprintList:", error);
  }
};

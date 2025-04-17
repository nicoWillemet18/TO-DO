import axios from "axios";
import { ISprint } from "../types/ISprint";

const API_URL = 'http://localhost:3000/Sprints';

export async function getSprintById(id: number): Promise<ISprint> {
  const response = await axios.get<ISprint>(`${API_URL}/${id}`);
  if (!response.data) throw new Error("No se pudo cargar el sprint");
  return response.data;
}

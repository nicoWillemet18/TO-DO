import { ITareaSprint } from "./ITareaSprint";

export interface ISprint {
  id: string; 
  nombre: string;
  inicio: string;
  fin: string;
  tareas: ITareaSprint[]; 
}
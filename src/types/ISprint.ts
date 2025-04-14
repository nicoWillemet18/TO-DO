import { ITarea } from "./ITarea";

export interface ISprint {
    id: number,   
    nombre: string,
    inicio: string,
    fin: string,
    tareas: ITarea[];
  }
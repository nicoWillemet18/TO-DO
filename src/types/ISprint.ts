import { ITarea } from "./ITarea";

export interface ISprint {
  id: string; 
  nombre: string;
  inicio: string;
  fin: string;
  tareas: ITarea[]; 
}

  export interface ISprintList {
    sprints: ISprint[];
  }
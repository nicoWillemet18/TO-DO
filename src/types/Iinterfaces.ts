export interface IProyectoList {
    proyectos: IProyecto[]; 
  }
  
  // Interfaz que representa un proyecto individual
  export interface IProyecto {
    id: string; // Identificador único del proyecto
    nombre: string; // Nombre del proyecto
    descripcion: string; // Descripción del proyecto
    fechaInicio: string; // Fecha de inicio del proyecto en formato "YYYY-MM-DD"
    fechaFin: string; // Fecha de finalización del proyecto en formato "YYYY-MM-DD"
  }
export interface ITarea {
    id: number;
    titulo: string;
    descripcion: string;
    estado: "pendiente" | "en-progreso" | "completado" | "backlog";
    fechaLimite: string;
  }
  
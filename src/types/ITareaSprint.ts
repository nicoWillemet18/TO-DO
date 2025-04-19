export interface ITareaSprint {
    id: number;
    titulo: string;
    descripcion: string;
    estado: "pendiente" | "en-progreso" | "completado" | "backlog";
    fechaLimite: string;
  }
  
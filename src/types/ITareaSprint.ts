export interface ITareaSprint {
    id: string;
    titulo: string;
    descripcion: string;
    estado: "pendiente" | "en-progreso" | "completado" | "backlog";
    fechaLimite: string;
  }
  
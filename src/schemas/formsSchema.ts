import * as yup from "yup";

// Esquema de validación para las tareas, utilizando yup. 
// Asegura que todos los campos sean válidos antes de proceder con la creación o actualización de una tarea o sprint.

export const tareaSchema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),
  descripcion: yup
    .string()
    .required("La descripción es obligatoria")
    .min(3, "Debe tener al menos 3 caracteres"),
  fechaInicio: yup
    .string()
    .required("La fecha de inicio es obligatoria"),
  fechaFin: yup
    .string()
    .required("La fecha de fin es obligatoria")
    .test("fecha-valida", "La fecha de fin debe ser posterior o igual a la fecha de inicio", function (value) {
      const { fechaInicio } = this.parent;
      return !fechaInicio || !value || new Date(fechaInicio) <= new Date(value);
    }),
});

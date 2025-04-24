import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ITareaBacklog } from "../../../types/ITareaBacklog";
import {
  createTareaController,
  updateTareaController,
} from "../../../data/tareaController";
import styles from "./modal.module.css";
import Swal from "sweetalert2";
import { createTareaSprint } from "../../../data/sprintController";

type TareaModalProps = {
  closeModal: () => void;
  refreshTareas: () => void;
  tarea?: ITareaBacklog;
  idSprint?: string;
  esBacklog?: boolean;
};

const TareaModal = ({
  closeModal,
  refreshTareas,
  tarea,
  idSprint,
  esBacklog,
}: TareaModalProps) => {
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const [errores, setErrores] = useState({
    nombre: "",
    descripcion: "",
    fechas: "",
  });

  // Si estamos editando, cargamos los valores actuales de la tarea
  useEffect(() => {
    if (tarea) {
      setNombre(tarea.nombre);
      setDescripcion(tarea.descripcion);
      setFechaInicio(tarea.fechaInicio);
      setFechaFin(tarea.fechaFin);
    }
  }, [tarea]);

  // Validación reactiva para los campos
  useEffect(() => {
    const nuevosErrores = {
      nombre: "",
      descripcion: "",
      fechas: "",
    };

    if (nombre.trim().length > 0 && nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    }

    if (descripcion.trim().length > 0 && descripcion.trim().length < 3) {
      nuevosErrores.descripcion = "La descripción debe tener al menos 3 caracteres.";
    }

    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
      nuevosErrores.fechas = "La fecha de inicio no puede ser mayor que la fecha de fin.";
    }

    setErrores(nuevosErrores);
  }, [nombre, descripcion, fechaInicio, fechaFin]);

  const validarCampos = () => {
    if (!nombre || !descripcion || !fechaInicio || !fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de continuar.",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }

    if (nombre.trim().length < 3 || descripcion.trim().length < 3) {
      Swal.fire({
        icon: "warning",
        title: "Texto demasiado corto",
        text: "El nombre y la descripción deben tener al menos 3 caracteres.",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      Swal.fire({
        icon: "warning",
        title: "Fechas inválidas",
        text: "La fecha de inicio no puede ser mayor que la fecha de fin.",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }

    return true;
  };

  // Crear o editar tarea para el backlog
  const handleCreateTareaBacklog = async () => {
    if (!validarCampos()) return;

    const tareaEditada: ITareaBacklog = {
      // Usamos uuid para generar un id único si es nueva
      id: tarea ? tarea.id : uuidv4(),
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
    };

    if (tarea) {
      await updateTareaController(tareaEditada);
      Swal.fire({
        icon: "success",
        title: "Tarea actualizada",
        text: "La tarea fue editada correctamente.",
        confirmButtonColor: "#3085d6",
      });
    } else {
      await createTareaController(tareaEditada);
      Swal.fire({
        icon: "success",
        title: "Tarea creada",
        text: "La tarea fue creada exitosamente.",
        confirmButtonColor: "#3085d6",
      });
    }

    refreshTareas();
    closeModal();
  };

  // Crear tarea para el sprint correspondiente
  const handleCreateTareaSprint = async () => {
    if (!validarCampos() || !idSprint) return;

    const tareaNueva = {
      titulo: nombre,
      descripcion,
      fechaLimite: fechaFin,
    };

    await createTareaSprint(idSprint, tareaNueva);

    Swal.fire({
      icon: "success",
      title: "Tarea creada",
      text: "La tarea fue añadida al sprint correctamente.",
      confirmButtonColor: "#3085d6",
    });

    refreshTareas();
    closeModal();
  };

  return (
    <div className={styles.proyectoModal}>
      <div className={styles.proyectoModalContent}>
        <h2 className={styles.proyectoModalTitle}>
          {tarea ? "Editar Tarea" : "Crear Nueva Tarea"}
        </h2>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Nombre de la tarea:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la tarea"
            className={styles.proyectoInput}
          />
          {errores.nombre && <p className={styles.error}>{errores.nombre}</p>}
        </div>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción de la tarea"
            className={styles.proyectoTextarea}
          />
          {errores.descripcion && <p className={styles.error}>{errores.descripcion}</p>}
        </div>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Fecha de Inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className={styles.proyectoInput}
          />
        </div>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Fecha de Fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className={styles.proyectoInput}
          />
          {errores.fechas && <p className={styles.error}>{errores.fechas}</p>}
        </div>

        <div className={styles.proyectoModalActions}>
          <button className={styles.proyectoButtonCancel} onClick={closeModal}>
            Cancelar
          </button>
          <button
            className={styles.proyectoButton}
            onClick={esBacklog ? handleCreateTareaBacklog : handleCreateTareaSprint}
          >
            {tarea ? "Guardar Cambios" : "Crear Tarea"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TareaModal;

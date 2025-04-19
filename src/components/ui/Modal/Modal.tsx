import { useState, useEffect } from "react";
import { ITareaBacklog } from "../../../types/ITareaBacklog";
import {
  createTareaController,
  getTareasController,
  updateTareaController,
} from "../../../data/tareaController"; // Importando las funciones actualizadas
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

const TareaModal = ({ closeModal, refreshTareas, tarea, idSprint, esBacklog}: TareaModalProps) => {
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  useEffect(() => {
    if (tarea) {
      setNombre(tarea.nombre);
      setDescripcion(tarea.descripcion);
      setFechaInicio(tarea.fechaInicio);
      setFechaFin(tarea.fechaFin);
    }
  }, [tarea]);

  const handleCreateTareaBacklog = async () => {
    if (!nombre || !descripcion || !fechaInicio || !fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de continuar.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const tareasBd = (await getTareasController()) || [];
    const nextId =
      tareasBd.length > 0
        ? (Math.max(...tareasBd.map((t: ITareaBacklog) => Number(t.id))) + 1).toString()
        : "1";

    const tareaEditada: ITareaBacklog = {
      id: tarea ? tarea.id : nextId,
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
    };

    if (tarea) {
      await updateTareaController(tareaEditada); // Función para actualizar
    } else {
      await createTareaController(tareaEditada); // Función para crear
    }

    refreshTareas();
    closeModal();
  };

  const handleCreateTareaSprint = async () => {

    if (!nombre || !descripcion || !fechaFin || !idSprint) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos y asegúrate de seleccionar un Sprint antes de continuar.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const tareaNueva = {
      titulo: nombre,
      descripcion,
      fechaLimite: fechaFin,
    };

    // Llamamos a la función para crear una tarea dentro del Sprint usando el idSprint obtenido de la URL
    await createTareaSprint(idSprint, tareaNueva);

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
        </div>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción de la tarea"
            className={styles.proyectoTextarea}
          />
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

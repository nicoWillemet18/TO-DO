import { useState, useEffect } from "react";
import { ISprint } from "../../../types/ISprint";
import { createSprintController, getSprintsController } from "../../../data/sprintController";
import styles from "./modal.module.css";
import Swal from "sweetalert2";

type SprintModalProps = {
  closeModal: () => void;
  refreshSprints: () => void;
  sprint?: ISprint | null; // Permitir null además de ISprint o undefined
};

const SprintModal = ({ closeModal, refreshSprints, sprint }: SprintModalProps) => {
  const [nombre, setNombre] = useState<string>(sprint ? sprint.nombre : "");
  const [inicio, setInicio] = useState<string>(sprint ? sprint.inicio : "");
  const [fin, setFin] = useState<string>(sprint ? sprint.fin : "");
  

  // Si hay un sprint, estamos en modo "ver" y no podemos modificar los campos
  const isViewMode = !!sprint;

  const handleCreateSprint = async () => {
    if (!nombre || !inicio || !fin) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de continuar.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const sprintsBd = (await getSprintsController()) || [];
    const nextId =
      sprintsBd.length > 0
        ? (Math.max(...sprintsBd.map((s: ISprint) => Number(s.id))) + 1).toString()
        : "1";

    const sprintNuevo: ISprint = {
      id: nextId,
      nombre,
      inicio,
      fin,
      tareas: [],
    };

    await createSprintController(sprintNuevo);
    refreshSprints();
    closeModal();
  };

  return (
    <div className={styles.proyectoModal}>
      <div className={styles.proyectoModalContent}>
        <h2 className={styles.proyectoModalTitle}>{isViewMode ? "Detalles del Sprint" : "Crear Nuevo Sprint"}</h2>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Nombre del Sprint:</label>
          {isViewMode ? (
            <p>{sprint?.nombre}</p>
          ) : (
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del Sprint"
              className={styles.proyectoInput}
            />
          )}
        </div>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Fecha de Inicio:</label>
          {isViewMode ? (
            <p>{new Date(sprint?.inicio).toISOString().split("T")[0]}</p>
          ) : (
            <input
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className={styles.proyectoInput}
            />
          )}
        </div>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Fecha de Fin:</label>
          {isViewMode ? (
            <p>{new Date(sprint?.fin).toISOString().split("T")[0]}</p>
          ) : (
            <input
              type="date"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              className={styles.proyectoInput}
            />
          )}
        </div>

        <div className={styles.proyectoModalActions}>
          <button className={styles.proyectoButtonCancel} onClick={closeModal}>
            {isViewMode ? "Cerrar" : "Cancelar"}
          </button>
          {!isViewMode && (
            <button className={styles.proyectoButton} onClick={handleCreateSprint}>
              Crear Sprint
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SprintModal;

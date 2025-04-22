import { useState, useEffect } from "react";
import { ISprint } from "../../../types/ISprint";
import {
  createSprintController,
  getSprintsController,
  updateSprintController,
} from "../../../data/sprintController";
import styles from "./modal.module.css";
import Swal from "sweetalert2";

type SprintModalProps = {
  closeModal: () => void;
  refreshSprints: () => void;
  sprint?: ISprint | null;
  editMode?: boolean;
};

const SprintModal = ({
  closeModal,
  refreshSprints,
  sprint,
  editMode = false,
}: SprintModalProps) => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState<string>(sprint ? sprint.nombre : "");
  const [inicio, setInicio] = useState<string>(sprint ? sprint.inicio : "");
  const [fin, setFin] = useState<string>(sprint ? sprint.fin : "");

  // Estado para los errores de validación
  const [errores, setErrores] = useState({
    nombre: "",
    fechas: "",
  });

  // Determina si es el modo de solo vista
  const isViewMode = sprint && !editMode;

  useEffect(() => {
    const nuevosErrores = {
      nombre: "",
      fechas: "",
    };

    // Validaciones
    if (nombre.trim().length > 0 && nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    }

    if (inicio && fin && new Date(inicio) > new Date(fin)) {
      nuevosErrores.fechas = "La fecha de inicio no puede ser mayor que la fecha de fin.";
    }

    setErrores(nuevosErrores);
  }, [nombre, inicio, fin]);

  // Función de validación de campos
  const validarCampos = () => {
    if (!nombre || !inicio || !fin) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos.",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }

    if (nombre.trim().length < 3) {
      Swal.fire({
        icon: "warning",
        title: "Nombre demasiado corto",
        text: "El nombre debe tener al menos 3 caracteres.",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }

    if (new Date(inicio) > new Date(fin)) {
      Swal.fire({
        icon: "warning",
        title: "Fechas inválidas",
        text: "La fecha de inicio no puede ser mayor que la de fin.",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }

    return true;
  };

  // Función para crear un sprint
  const handleCreateSprint = async () => {
    if (!validarCampos()) return;

    const sprintsBd = (await getSprintsController()) || [];
    const nextId =
      sprintsBd.length > 0
        ? (
            Math.max(...sprintsBd.map((s: ISprint) => Number(s.id))) + 1
          ).toString()
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

  // Función para guardar los cambios de un sprint
  const handleSaveChanges = async () => {
    if (!sprint || !validarCampos()) return;

    const sprintActualizado: ISprint = {
      ...sprint,
      nombre,
      inicio,
      fin,
    };

    try {
      await updateSprintController(sprintActualizado);
      refreshSprints();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "No se pudo actualizar el sprint. Intenta nuevamente.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className={styles.proyectoModal}>
      <div className={styles.proyectoModalContent}>
        <h2 className={styles.proyectoModalTitle}>
          {isViewMode
            ? "Detalles del Sprint"
            : sprint
            ? "Editar Sprint"
            : "Crear Nuevo Sprint"}
        </h2>

        {/* Formulario para el nombre del sprint */}
        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Nombre del Sprint:</label>
          {isViewMode ? (
            <p>{sprint?.nombre}</p>
          ) : (
            <>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del Sprint"
                className={styles.proyectoInput}
              />
              {errores.nombre && <p className={styles.error}>{errores.nombre}</p>}
            </>
          )}
        </div>

        {/* Formulario para la fecha de inicio */}
        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Fecha de Inicio:</label>
          {isViewMode ? (
            <p>{new Date(sprint?.inicio || "").toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            })}</p>
          ) : (
            <input
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className={styles.proyectoInput}
            />
          )}
        </div>

        {/* Formulario para la fecha de fin */}
        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Fecha de Fin:</label>
          {isViewMode ? (
            <p>{new Date(sprint?.fin || "").toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            })}</p>
          ) : (
            <>
              <input
                type="date"
                value={fin}
                onChange={(e) => setFin(e.target.value)}
                className={styles.proyectoInput}
              />
              {errores.fechas && <p className={styles.error}>{errores.fechas}</p>}
            </>
          )}
        </div>

        {/* Acciones del modal */}
        <div className={styles.proyectoModalActions}>
          <button className={styles.proyectoButtonCancel} onClick={closeModal}>
            {isViewMode ? "Cerrar" : "Cancelar"}
          </button>
          {!isViewMode && !sprint && (
            <button className={styles.proyectoButton} onClick={handleCreateSprint}>
              Crear Sprint
            </button>
          )}
          {!isViewMode && sprint && (
            <button className={styles.proyectoButton} onClick={handleSaveChanges}>
              Guardar Cambios
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SprintModal;

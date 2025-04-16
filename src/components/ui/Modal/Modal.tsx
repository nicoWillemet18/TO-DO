import { useState, useEffect } from "react";
import { IProyecto } from "../../../types/Iinterfaces";
import {
  createProyectoController,
  getProyectosController,
  updateProyectoController,
} from "../../../data/proyectoController";
import styles from "./modal.module.css";
import Swal from "sweetalert2";

type ProyectoModalProps = {
  closeModal: () => void;
  refreshProyectos: () => void;
  proyecto?: IProyecto;
};

const ProyectoModal = ({ closeModal, refreshProyectos, proyecto }: ProyectoModalProps) => {
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  useEffect(() => {
    if (proyecto) {
      setNombre(proyecto.nombre);
      setDescripcion(proyecto.descripcion);
      setFechaInicio(proyecto.fechaInicio);
      setFechaFin(proyecto.fechaFin);
    }
  }, [proyecto]);

  const handleCreateProject = async () => {
    if (!nombre || !descripcion || !fechaInicio || !fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de continuar.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const proyectosBd = (await getProyectosController()) || [];
    const nextId =
      proyectosBd.length > 0
        ? (Math.max(...proyectosBd.map((p: IProyecto) => Number(p.id))) + 1).toString()
        : "1";

    const proyectoEditado: IProyecto = {
      id: proyecto ? proyecto.id : nextId,
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
    };

    if (proyecto) {
      await updateProyectoController(proyectoEditado);
    } else {
      await createProyectoController(proyectoEditado);
    }

    refreshProyectos();
    closeModal();
  };

  return (
    <div className={styles.proyectoModal}>
      <div className={styles.proyectoModalContent}>
        <h2 className={styles.proyectoModalTitle}>
          {proyecto ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
        </h2>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Nombre del Proyecto:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del Proyecto"
            className={styles.proyectoInput}
          />
        </div>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del Proyecto"
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
          <button className={styles.proyectoButton} onClick={handleCreateProject}>
            {proyecto ? "Guardar Cambios" : "Crear Proyecto"}
          </button>
          <button className={styles.proyectoButtonCancel} onClick={closeModal}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProyectoModal;



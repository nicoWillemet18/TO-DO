import { useState, useEffect } from "react";
import { IProyecto, IMiembro } from "../../../types/Iinterfaces"; // Asegúrate de importar las interfaces correctas
import { createProyectoController } from "../../../data/proyectoController"; // Asegúrate de importar el controlador para crear el proyecto
import styles from "./modal.module.css"; // Asegúrate de que la ruta sea correcta

type ProyectoModalProps = {
  closeModal: () => void;
  refreshProyectos: () => void;
  proyecto?: IProyecto; // Agregar proyecto como propiedad opcional
};

const ProyectoModal = ({ closeModal, refreshProyectos, proyecto }: ProyectoModalProps) => {
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [miembros, setMiembros] = useState<IMiembro[]>([]); // Para almacenar los miembros dinámicamente
  const [miembroNombre, setMiembroNombre] = useState<string>("");
  const [miembroRol, setMiembroRol] = useState<string>("");

  // Precargar los datos cuando se pasa un proyecto (para editar)
  useEffect(() => {
    if (proyecto) {
      setNombre(proyecto.nombre);
      setDescripcion(proyecto.descripcion);
      setFechaInicio(proyecto.fechaInicio);
      setFechaFin(proyecto.fechaFin);
      setMiembros(proyecto.miembros);
    }
  }, [proyecto]); // Solo se ejecuta cuando cambia el proyecto

  const handleAddMiembro = () => {
    if (miembroNombre && miembroRol) {
      const nuevoMiembro: IMiembro = {
        id: (miembros.length + 1).toString(),
        nombre: miembroNombre,
        rol: miembroRol,
      };
      setMiembros([...miembros, nuevoMiembro]);
      setMiembroNombre("");
      setMiembroRol("");
    }
  };

  const handleCreateProject = async () => {
    if (!nombre || !descripcion || !fechaInicio || !fechaFin || miembros.length === 0) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const nuevoProyecto: IProyecto = {
      id: proyecto ? proyecto.id : (new Date().getTime()).toString(),
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
      miembros,
    };

    if (proyecto) {
      // Si existe un proyecto, se debe actualizar
      // Aquí puedes hacer la lógica para actualizar el proyecto existente
    } else {
      // Crear un nuevo proyecto
      await createProyectoController(nuevoProyecto);
    }

    refreshProyectos();
    closeModal();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{proyecto ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</h2>

        <div className={styles.formGroup}>
          <label>Nombre del Proyecto:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del Proyecto"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del Proyecto"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Fecha de Inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Fecha de Fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <h3>Miembros del Proyecto</h3>
          <div className={styles.miembroInput}>
            <input
              type="text"
              value={miembroNombre}
              onChange={(e) => setMiembroNombre(e.target.value)}
              placeholder="Nombre del Miembro"
            />
            <input
              type="text"
              value={miembroRol}
              onChange={(e) => setMiembroRol(e.target.value)}
              placeholder="Rol del Miembro"
            />
            <button onClick={handleAddMiembro}>Agregar Miembro</button>
          </div>

          <div className={styles.miembrosLista}>
            {miembros.map((miembro) => (
              <div key={miembro.id} className={styles.miembro}>
                <span>{miembro.nombre} - {miembro.rol}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleCreateProject}>
            {proyecto ? "Guardar Cambios" : "Crear Proyecto"}
          </button>
          <button onClick={closeModal}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ProyectoModal;



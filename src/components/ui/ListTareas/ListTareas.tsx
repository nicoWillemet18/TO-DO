import { FC, useState, useEffect } from "react";
import styles from "./ListTareas.module.css";
import { ITareaBacklog } from "../../../types/ITareaBacklog";
import { ISprint } from "../../../types/ISprint";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { BsDropbox } from "react-icons/bs";
import Modal from "react-modal";
import { addTareaToSprintController, getSprintsController } from "../../../data/sprintController";
import { ITareaSprint } from "../../../types/ITareaSprint";
import { deleteTareaController, getTareasController } from "../../../data/tareaController";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

type IPropsIProyecto = {
  proyecto: ITareaBacklog;
  onEdit: () => void;
  onDelete: (id: string) => void;
  setTareas: React.Dispatch<React.SetStateAction<ITareaBacklog[]>>;
};

const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

const ListTareas: FC<IPropsIProyecto> = ({ proyecto, onEdit, onDelete, setTareas }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<string>("");

  // Fetch de los sprints disponibles desde el servidor al montar el componente
  useEffect(() => {
    const fetchSprints = async () => {
      const data = await getSprintsController();
      if (data) {
        const validSprints = data.filter((sprint) => sprint.id && sprint.nombre);
        setSprints(validSprints); // Actualiza los sprints disponibles
      }
    };

    fetchSprints();
  }, []); // Se ejecuta una sola vez cuando el componente se monta

  // Maneja el cambio de selección del sprint
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSprint(e.target.value); // Actualiza el sprint seleccionado
  };

  // Función para enviar la tarea seleccionada al sprint y eliminarla del backlog
  const handleEnviarTarea = async () => {
    if (!selectedSprint) return; // Verifica si un sprint ha sido seleccionado

    const result = await Swal.fire({
      title: "Confirmación Necesaria",
      text: "¿Deseas enviar esta tarea al sprint seleccionado?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        const tareaExistente: ITareaSprint = {
          id: proyecto.id,
          titulo: proyecto.nombre,
          descripcion: proyecto.descripcion,
          estado: "pendiente",
          fechaLimite: proyecto.fechaFin
        };

        // Envía la tarea al sprint y la elimina del backlog
        await addTareaToSprintController(selectedSprint, tareaExistente);
        await deleteTareaController(proyecto.id);

        // Obtiene las tareas actualizadas y actualiza el estado
        const tareasActualizadas = await getTareasController();
        setTareas(tareasActualizadas || []); // Actualiza las tareas mostradas

        Swal.fire("Tarea enviada", "La tarea ha sido enviada correctamente al sprint.", "success"); // Alerta de éxito
      } catch (error) {
        console.error("Error al enviar la tarea", error); // Maneja errores durante el proceso
        Swal.fire("Error", "Hubo un problema al enviar la tarea.", "error"); // Alerta de error
      }
    }
  };

  return (
    <div className={styles.proyecto}>
      <div className={styles.cont}>
        <div className={styles.containerRow}>
          <span className={styles.titulo} data-tooltip={proyecto.nombre}>
            <strong>Nombre:</strong> {proyecto.nombre}
          </span>

          <span className={styles.fecha} data-tooltip={`Fecha de Inicio: ${formatearFecha(proyecto.fechaInicio)}`}>
            <strong>Fecha de inicio:</strong> {formatearFecha(proyecto.fechaInicio)}
          </span>

          <button
            className={styles.enviar}
            style={{ maxWidth: "200px" }}
            disabled={!selectedSprint}
            onClick={handleEnviarTarea} // Llama a la función para enviar la tarea
          >
            Enviar a <BsDropbox className={styles.icon} />
          </button>

          <span className={styles.descripcion} data-tooltip={proyecto.descripcion}>
            <strong>Descripción:</strong> {proyecto.descripcion}
          </span>

          <span className={styles.fecha} data-tooltip={`Fecha de Fin: ${formatearFecha(proyecto.fechaFin)}`}>
            <strong>Fecha de fin:</strong> {formatearFecha(proyecto.fechaFin)}
          </span>

          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              value={selectedSprint}
              onChange={handleSelectChange} // Llama a la función que maneja el cambio de selección de sprint
            >
              <option value="">Seleccione un Sprint</option>
              {sprints.length > 0 ? (
                sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.nombre}
                  </option>
                ))
              ) : (
                <option disabled>No hay sprints disponibles</option>
              )}
            </select>
          </div>
        </div>

        <div className={styles.acciones}>
          <button onClick={() => setModalIsOpen(true)}>
            <FaEye size={27} color="C8B810" />
          </button>

          <button onClick={onEdit}>
            <FaEdit size={25} color="0D7DD8" />
          </button>

          <button onClick={() => onDelete(proyecto.id)}>
            <FaTrash size={25} color="A90505" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)} // Cierra el modal al solicitarlo
        contentLabel="Detalles del Proyecto"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>{proyecto.nombre}</h2>
          <p><strong>Descripción:</strong> {proyecto.descripcion}</p>
          <p><strong>Fecha de Inicio:</strong> {formatearFecha(proyecto.fechaInicio)}</p>
          <p><strong>Fecha de Fin:</strong> {formatearFecha(proyecto.fechaFin)}</p>
          <button
            className={styles.modalCloseButton}
            onClick={() => setModalIsOpen(false)} // Cierra el modal al hacer clic en el botón
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ListTareas;
